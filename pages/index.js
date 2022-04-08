import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import camapaignFactory from '../ethereum/campaignFactory';
import Layout from '../components/Layout';

class CampaignIndex extends Component {

  static async getInitialProps() {
    const campaigns = await camapaignFactory.methods.getDeployedCampaigns().call();

    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: <a>View Campaigns</a>,
        fluid: true
      }
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>
        <div>{this.renderCampaigns()}</div>
        <Button content="Create Campaign" icon="add circle" primary></Button>
      </Layout>
    );
  }

}

export default CampaignIndex;
