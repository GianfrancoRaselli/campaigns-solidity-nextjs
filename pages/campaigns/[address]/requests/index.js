import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../../routes';
import Layout from '../../../../components/Layout';
import RequestRow from '../../../../components/RequestRow';
import instantiateCampaign from '../../../../ethereum/campaign';

class RequestIndex extends Component {

  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = instantiateCampaign(address);

    const approversCount = await campaign.methods.approversCount().call();
    const requestsCount = await campaign.methods.getRequestsCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestsCount)).fill().map((element, index) => {
        return campaign.methods.requests(index).call();
      })
    );

    return { address, approversCount, requestsCount, requests };
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          approversCount={this.props.approversCount}
          request={request}
          address={this.props.address}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}`}>
          <a>Back to Campaign</a>
        </Link>

        <h3>Requests</h3>

        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated='right' style={{ marginBottom: 10 }}>Add Request</Button>
          </a>
        </Link>

        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Approvals Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>
            {this.renderRows()}
          </Body>
        </Table>

        <div>Found {this.props.requestsCount}</div>
      </Layout>
    );
  }

}

export default RequestIndex;
