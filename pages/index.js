import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import { Link } from '../routes';
import Layout from '../components/Layout';
import camapaignFactory from '../ethereum/campaignFactory';

class CampaignIndex extends Component {

  static async getInitialProps() {
    const campaigns = await camapaignFactory.methods.getDeployedCampaigns().call();

    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true
      }
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>

        <Link route="campaigns/new">
          <a>
            <Button
              content="Create Campaign"
              icon="add circle"
              primary
              floated="right"
            />
          </a>
        </Link>

        <div>{this.renderCampaigns()}</div>
      </Layout>
    );
  }

}

export default CampaignIndex;
