import React, { Component } from 'react';
import { Grid, Card, Button } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import ContributeForm from '../../../components/ContributeForm';
import web3 from '../../../ethereum/web3';
import instantiateCampaign from '../../../ethereum/campaign';
import { Link } from '../../../routes'

class CampaignShow extends Component {

  static async getInitialProps(props) {
    const campaign = instantiateCampaign(props.query.address);

    const summary = await campaign.methods.getSummary().call();

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4]
    };
  }

  renderCards() {
    const { minimumContribution, balance, requestsCount, approversCount, manager } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description: 'The manager created this campaign and can create requests to withdraw money'
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'You must contribute at least this much wei to become an approver'
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description: 'A request tries to withdram money from the contract. Requests must be approved by approvers'
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description: 'Number of people who have already donated to this campaign'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description: 'The balance is how much money this campaign has left to spend'
      }
    ];

    return <Card.Group items={items} style={{ overflowWrap: 'break-word' }} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>

        <Grid>
          <Grid.Column width={10}>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  {this.renderCards()}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                      <Button primary>View Requests</Button>
                    </a>
                  </Link>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={this.props.address} />
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }

}

export default CampaignShow;
