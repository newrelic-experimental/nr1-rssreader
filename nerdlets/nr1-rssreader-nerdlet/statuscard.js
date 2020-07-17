import React from 'react';
import * as Parser from 'rss-parser';
import { Container, Grid, Image, Header, Card, Icon, List, Modal, Button } from 'semantic-ui-react'
// Types
import PropTypes from 'prop-types';

import StatusList from './statuslist'
import DeleteModal from './deletemodal'
import EditModal from './editmodal'

import moment from 'moment';

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

    this.setState({ feed_data: [], title: "", url: nextProps.data.rssurl, logo: nextProps.data.logourl }, () => {
      this.makeRefresh()
    });

  }

  componentDidUpdate(prevProps, prevState) {

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

    // trigger words: issue, incident, problem, 
    // resolve words:  resolve, resolved, fixed
    var triggers = ['issue', 'incident', 'problem'];
    var resolutions = ['resolved', 'fixed']
    // let { feed } = this.state;
    let statusval = "question"; //"gripfire";
    let statuscolor = "yellow";

    let minsincelu = 0;

    if (this.state.feed_data.length > 0) {
      var mostrecent = this.state.feed_data[0];
      var momdt = moment(mostrecent.isoDate);
      var now = new moment();
      minsincelu = now.diff(momdt, 'minutes');

      if(minsincelu < 0)
        minsincelu = "future"

      // // dig for trigger / resolve words to calc state.
      var incidentfound = false;
      var resolved = false;
      for (var i = 0; i < triggers.length; i++) {
        var test1 = mostrecent.contentSnippet.toLowerCase().search(triggers[i]);
        if (test1 >= 0) {
          incidentfound = true;
          break;
        }
      }

      for (var i = 0; i < resolutions.length; i++) {
        var test1 = mostrecent.contentSnippet.toLowerCase().search(resolutions[i]);
        if (test1 >= 0) {
          resolved = true;
          break;
        }
      }

      // set up icon and color based on what we found. 
      if (incidentfound) {
        statusval = "gripfire";
        statuscolor = "red"

        if (resolved) {
          statusval = "thumbs up";
          statuscolor = "green"
        }
      }






      //var test1 = mostrecent.contentSnippet.search("Resolved");
      //if(test1 >= 0)
      //{
      //  statusval = "thumbs up";
      //  statuscolor = "green"
      //}

    }




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
            <Header as='h3' style={{ float: 'left' }}>Status:  </Header>
            <Icon style={{ float: 'left' }} color={statuscolor} name={statusval} size="large" />


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
          <div style={{ height: '55%', width: '30%', display: 'inline-block' }}>
            <Image size='tiny' src={this.state.logo} />
          </div>
          <div style={{ height: '55%', width: '70%', display: 'inline-block', verticalAlign: 'top' }}>
            <div style={{ height: '70%', width: '100%' }}>
              <Header as='h3'>{this.state.title}</Header>
            </div>
            <div style={{ height: '30%', width: '100%' }}>

              <Header as='h5'>Minutes Since last Update: {minsincelu} </Header>
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