import React from 'react';
import * as Parser from 'rss-parser';
import { Container, Grid, Image, Header, Card, Icon, List, Popup, Button } from 'semantic-ui-react'
// Types
import PropTypes from 'prop-types';
let parser = new Parser();

export default class StatusItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = { item: props.item }
  }

  componentWillReceiveProps(nextProps) {


    this.setState({ item: nextProps.item});
  }

  componentDidMount() {
    var bla = 0
    bla = bla+ 1
  }

  render() {
  
    return (
      <List.Item >
        <List.Icon name='window close' color="yellow" size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header >{this.state.item.title}</List.Header>
          <List.Description >
              <h4>{this.state.item.pubDate}</h4>
              <a href={this.state.item.guid}>LINK</a>
              <Popup
                trigger={<Icon name='info' color='green' size='large'/>}
                content={this.state.item.contentSnippet.substring(0,500)}
                basic
                size='small'
              />
          </List.Description>
        </List.Content>
      </List.Item>
    );
  }
}