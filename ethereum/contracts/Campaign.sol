// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CampaignFactory {

  address[] public deployedCampaigns;

  function getDeployedCampaigns() public view returns (address[] memory) {
    return deployedCampaigns;
  }

  function createCampaign(uint _minimum) public {
    Campaign newCampaign = new Campaign(msg.sender, _minimum);
    deployedCampaigns.push(address(newCampaign));
  }

}

contract Campaign {

  struct Request {
    string description;
    address recipient;
    uint value;
    bool complete;
    mapping(address => bool) approvals;
    uint approvalsCount;
  }

  address public manager;
  uint public minimumContribution;
  mapping(address => bool) public approvers;
  uint public approversCount;
  Request[] public requests;

  modifier onlyManager() {
    require(manager == msg.sender, 'Only manager can access');
    _;
  }

  modifier notManager() {
    require(manager != msg.sender, 'The manager can not access');
    _;
  }

  constructor(address _manager, uint _minimumContribution) {
    manager = _manager;
    minimumContribution = _minimumContribution;
  }

  function contribute() public payable notManager {
    require(minimumContribution <= msg.value);

    if (!approvers[msg.sender]) {
      approvers[msg.sender] = true;
      approversCount++;
    }
  }

  function createRequest(string memory _description, address _recipient, uint _value) public onlyManager {
    Request storage newRequest = requests.push();

    newRequest.description = _description;
    newRequest.recipient = _recipient;
    newRequest.value = _value;
    newRequest.complete = false;
    newRequest.approvalsCount = 0;
  }

  function approveRequest(uint _index) public notManager {
    Request storage request = requests[_index];

    require(approvers[msg.sender]);
    require(!request.approvals[msg.sender]);

    request.approvals[msg.sender] = true;
    request.approvalsCount++;
  }

  function finalizeRequest(uint _index) public onlyManager {
    Request storage request = requests[_index];

    require(!request.complete);
    require(request.approvalsCount > (approversCount / 2));

    payable(request.recipient).transfer(request.value);
    request.complete = true;
  }

}
