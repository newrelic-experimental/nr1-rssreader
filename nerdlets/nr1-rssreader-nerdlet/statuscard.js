import React from 'react';
import * as Parser from 'rss-parser';
import { Container, Grid, Image, Header, Card, Icon, List, Modal, Button } from 'semantic-ui-react'
// Types
import PropTypes from 'prop-types';

import StatusList from './statuslist'
import DeleteModal from './deletemodal'
import EditModal from './editmodal'

let parser = new Parser();

export default class StatusCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = { feed_data: [], title: "", url: props.data.rssurl, logo: props.data.logourl, deleteModalOpen: false, editModalOpen: false }
  }

  //status.aws.amazon.com/rss/apigateway-us-west-2.rss'
  //https://status.pagerduty.com/
  //status.slack.com/feed/rss
  async componentDidMount() {
    const feed = await parser.parseURL('https://cors-anywhere.herokuapp.com/' + this.state.url);

    this.setState({ feed_data: feed.items, title: feed.title, lastBuild: feed.lastBuildDate });
  }

  async makeRefresh() {
    const feed = await parser.parseURL('https://cors-anywhere.herokuapp.com/' + this.state.url);
    this.setState({ feed_data: feed.items, title: feed.title, lastBuild: feed.lastBuildDate });
  }


  componentWillReceiveProps(nextProps) {
    var ddd = 0;
    ddd = ddd + 1;
    this.setState({ feed_data: [], title: "", url: nextProps.data.rssurl, logo: nextProps.data.logourl }, () => {

      this.makeRefresh()
    });

  }

  componentDidUpdate(prevProps, prevState) {
    var bla = 0;
    var bbldd = this.state.url;
    bla = bla + 1;
  }


  handleDelete = () => {
    this.props.handleDelete(this.props.data.uuid);  // pass the delete up to the parent, to alter the collection, 
    this.setState({ deleteModalOpen: false })  // close the delete modal
  }

  handleEdit = (rssurl, logourl) => {

    this.props.handleEdit(this.props.data.uuid, rssurl, logourl);  // pass org uuid , along with edits, 
    this.setState({ editModalOpen: false })
  }


  //<h4>{this.state.title} </h4>   
  render() {
    // let { feed } = this.state;

    return ([

      <DeleteModal // The invisible modal itself
        key='dmodal1'
        modalOpen={this.state.deleteModalOpen}
        handleClose={() => {
          this.setState({ deleteModalOpen: false })
        }
        }
        handleDelete={() => {
          this.handleDelete();
        }
        }
        valueIntoModal={this.state.valueIntoModal}
      />,
      <EditModal // The invisible modal itself
        key='emodal1'
        rssurl={this.state.url}
        logourl={this.state.logo}
        modalOpen={this.state.editModalOpen}
        handleClose={() => {
          this.setState({ editModalOpen: false })  // just close it ,ignore whats there. 
        }
        }
        handleConfirm={(rss, logo) => {
          // add some checksum on the urls... 
          this.handleEdit(rss, logo)
        }
        }
        valueIntoModal={this.state.valueIntoModal}
      />,
      <Card fluid >
        <div style={{ height: '150px' }}>
          <div style={{ height: '25%', width: '100%' }}>
            <Button icon style={{ float: 'right' }} color='blue' size='mini'
              onClick={
                () => {
                  this.setState({ deleteModalOpen: true })
                }
              }>
              <Icon name='trash' size="large" />
            </Button>

            <Button icon style={{ float: 'right' }} color='orange' size='mini'
              onClick={
                () => {
                  this.setState({ editModalOpen: true })
                }
              }>
              <Icon name='edit' size="large" />
            </Button>
          </div>
          <div style={{ height: '60%', width: '30%', display: 'inline-block' }}>
            <Image size='tiny' src={this.state.logo} />
          </div>
          <div style={{ height: '60%', width: '70%', display: 'inline-block', verticalAlign: 'top' }}>
            <div style={{ height: '70%', width: '100%'}}>
              <Header as='h3'>{this.state.title}</Header>
            </div>
            <div style={{ height: '30%', width: '100%'}}>
              <Header as='h5'>Minutes Since last Post: </Header>
            </div>
          </div>


        </div>
        <Card.Content>
          <Card.Header></Card.Header>

          <Card.Description>
          </Card.Description>
          <StatusList items={this.state.feed_data}></StatusList>
        </Card.Content>
      </Card>

    ]

    );

  }
}