import React, { Component } from 'react';
import { Menu, Segment } from 'semantic-ui-react';
import { Link } from '../routes';

export default class Header extends Component {

  render() {
    return (
      <Segment inverted style={{ marginTop: '10px' }}>
        <Menu inverted pointing secondary>
          <Link route="/">
            <a className='item'>CrowdCoin</a>
          </Link>
          <Menu.Menu position='right'>
            <Link route="/">
              <a className='item'>Campaigns</a>
            </Link>
            <Link route="/campaigns/new">
              <a className='item'>+</a>
            </Link>
          </Menu.Menu>
        </Menu>
      </Segment>
    )
  }

}
