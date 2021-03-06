import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { Router } from '../../routes';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import campaignFactory from '../../ethereum/campaignFactory';

class CampaignNew extends Component {

  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ errorMessage: '', loading: true });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaignFactory.methods
        .createCampaign(this.state.minimumContribution)
        .send({ from: accounts[0] });
        
        Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  }

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label='wei'
              labelPosition='right'
              value={this.state.minimumContribution}
              onChange={event => this.setState({ minimumContribution: event.target.value })}
            />
          </Form.Field>

          <Message error header='Oops!' content={this.state.errorMessage} />

          <Button primary loading={this.state.loading}>Create!</Button>
        </Form>
      </Layout>
    );
  }

}

export default CampaignNew;
