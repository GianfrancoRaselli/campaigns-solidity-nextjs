const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider({ gasLimit: '999999999' }));

const compiledCamapignFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCamapign = require('../ethereum/build/Campaign.json');

let accounts;
let campaignFactory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  campaignFactory = await new web3.eth.Contract(compiledCamapignFactory.abi)
    .deploy({ data: compiledCamapignFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '999999999' });

  await campaignFactory.methods.createCampaign('100').send({
    from: accounts[1],
    gas: '999999999'
  });

  [campaignAddress] = await campaignFactory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(compiledCamapign.abi, campaignAddress);
});

describe('Campaign', () => {
  it('deploys a campaignFactory and a campaign', () => {
    assert.ok(campaignFactory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();

    assert.equal(accounts[1], manager);
  });

  it('allows people to contribure money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      from: accounts[2],
      value: '200',
      gas: '999999999'
    });
    const isContributor = await campaign.methods.approvers(accounts[2]).call();

    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[2],
        value: '10',
        gas: '999999999'
      });

      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods.createRequest('Buy batteries', accounts[3], '100').send({
      from: accounts[1],
      gas: '999999999'
    });
    const request = await campaign.methods.requests(0).call();

    assert.equal('Buy batteries', request.description);
  });

  it('processes request', async () => {
    await campaign.methods.contribute().send({
      from: accounts[2],
      value: web3.utils.toWei('10', 'ether'),
      gas: '999999999'
    });

    await campaign.methods.createRequest('A', accounts[4], web3.utils.toWei('5', 'ether')).send({
      from: accounts[1],
      gas: '999999999'
    });

    await campaign.methods.approveRequest(0).send({
      from: accounts[2],
      gas: '999999999'
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[1],
      gas: '999999999'
    });

    const balance = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(accounts[4]), 'ether'));

    assert(balance > 104);
  });
});