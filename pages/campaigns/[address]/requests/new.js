import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { Router, Link } from '../../../../routes';
import Layout from '../../../../components/Layout';
import web3 from '../../../../ethereum/web3';
import instantiateCampaign from '../../../../ethereum/campaign';

class RequestNew extends Component {

  state = {
    description: '',
    recipient: '',
    value: '',
    errorMessage: '',
    loading: false
  }

  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ errorMessage: '', loading: true });

    try {
      const campaign = instantiateCampaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      const { description, recipient, value} = this.state;
      await campaign.methods
        .createRequest(description, recipient, web3.utils.toWei(value, 'ether'))
        .send({ from: accounts[0] });
        
        Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  }

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>Back to Requests</a>
        </Link>
        
        <h3>Create a Request</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event => this.setState({ description: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={event => this.setState({ recipient: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Value</label>
            <Input
              label='ether'
              labelPosition='right'
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </Form.Field>

          <Message error header='Oops!' content={this.state.errorMessage} />

          <Button primary loading={this.state.loading}>Create!</Button>
        </Form>
      </Layout>
    );
  }

}

export default RequestNew;
