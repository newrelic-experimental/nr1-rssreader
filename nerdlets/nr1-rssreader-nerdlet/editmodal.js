import React from 'react';
import { Modal, Header, Button, Icon, Form, Label } from 'semantic-ui-react'

import PropTypes from 'prop-types'

export default class EditModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = { rssurl: props.rssurl, logourl: props.logourl }
  }

  confirmClick = (event, data) => {
    //console.log("Passed in Prop Value: " + this.props.valueIntoModal);
    
    var rssurl = document.getElementById("rssurl").value;
    var logourl = document.getElementById("logourl").value;
  
    this.props.handleConfirm(rssurl, logourl);
  }

 // cancelClick = (event, data) => {
    //console.log("Passed in Prop Value: " + this.props.valueIntoModal);
 //   this.props.handleClose();
 // }

 //value="https://status.pagerduty.com/history.rss"

 //value="https://www.logo.wine/a/logo/PagerDuty/PagerDuty-Logo.wine.svg"
  render() {



    return (
      <Modal
        open={this.props.modalOpen}
        size='small'
        closeOnEscape={true}
        closeOnRootNodeClick={true}
      >
        <Header icon='browser' content='Setup your RSS feed' />
        <Modal.Content>
          <h3>Please confirm:</h3>
          <div class="ui labeled input fluid">
            <div class="ui label label">RSS URL: </div>
            <input id="rssurl" type="text" placeholder="mysite.com" fluid defaultValue={this.state.rssurl}/>
          </div>
          <br></br>

          <div class="ui labeled input fluid">
            <div class="ui label label">Service Logo URL: </div>
            <input id="logourl" type="text" placeholder="mysite.com" fluid defaultValue={this.state.logourl} />
          </div>



        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            type='button'
            icon='remove'
            labelPosition='right'
            onClick={this.props.handleClose}
            content='Cancel'
          />
          <Button
            positive
            type='button'
            icon='checkmark'
            labelPosition='right'
            onClick={this.confirmClick}
            content='Confirm'
          />
        </Modal.Actions>
      </Modal>
    )
  }



}

EditModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
 
  valueIntoModal: PropTypes.string.isRequired
}
