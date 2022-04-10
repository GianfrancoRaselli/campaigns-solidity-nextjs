import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { Router } from '../routes';
import web3 from '../ethereum/web3';
import instantiateCampaign from '../ethereum/campaign';

export default class ContributeForm extends Component {

  state = {
    value: '',
    errorMessage: '',
    loading: false
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ errorMessage: '', loading: true });

    try {
      const campaign = instantiateCampaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .contribute()
        .send({ from: accounts[0], value: web3.utils.toWei(this.state.value, 'ether') });

      Router.replaceRoute(`/campaigns/${this.props.address}`);
      } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ value: '', loading: false });
  }

  render() {
    return (
      <div>
        <h3>Create a Campaign</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Amount to Contribute</label>
            <Input
              label='ether'
              labelPosition='right'
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </Form.Field>

          <Message error header='Oops!' content={this.state.errorMessage} />

          <Button primary loading={this.state.loading}>Contribute!</Button>
        </Form>
      </div>
    )
  }

}
