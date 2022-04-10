import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Router } from '../routes';
import web3 from '../ethereum/web3';
import instantiateCampaign from '../ethereum/campaign';

export default class RequestRow extends Component {

  state = {
    loadingOnApprove: false,
    loadingOnFinalize: false
  }

  onApprove = async () => {
    this.setState({ loadingOnApprove: true });

    try {
      const campaign = instantiateCampaign(this.props.address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.approveRequest(this.props.id).send({ from: accounts[0] });

      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } finally {
      this.setState({ loadingOnApprove: false });
    }
  }

  onFinalize = async () => {
    this.setState({ loadingOnFinalize: true });

    try {
      const campaign = instantiateCampaign(this.props.address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.finalizeRequest(this.props.id).send({ from: accounts[0] });

      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } finally {
      this.setState({ loadingOnFinalize: false });
    }
  }

  render() {
    const { Row, Cell } = Table;
    const { id, approversCount, request } = this.props;
    const readyToFinalize = request.approvalsCount > approversCount / 2;

    return (
      <Row positive={readyToFinalize && !request.complete} disabled={request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{web3.utils.fromWei(web3.utils.toBN(request.value), 'ether')}</Cell>
        <Cell>{request.approvalsCount}/{approversCount}</Cell>
        <Cell>
          {request.complete ? null : (
            <Button basic color='green' loading={this.state.loadingOnApprove} onClick={this.onApprove}>Approve</Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button basic color='teal' loading={this.state.loadingOnFinalize} onClick={this.onFinalize}>Finalize</Button>
          )}
        </Cell>
      </Row>
    )
  }

}
