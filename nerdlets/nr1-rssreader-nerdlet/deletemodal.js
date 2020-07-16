import React from 'react';
import { Modal, Header, Button, Icon, Form, Label } from 'semantic-ui-react'

import PropTypes from 'prop-types'

export default class DeleteModal extends React.Component {

  constructor(props) {
    super(props);
  }

  confirmClick = (event, data) => {
    this.props.handleDelete(); // call parent, which has url already to make delete call 
  }

  render() {
    return (
      <Modal open={this.props.modalOpen} size='small'
        closeOnEscape={true}
        closeOnRootNodeClick={true}
      >
        <Modal.Content>
          <p>
            Are you sure you want to remove this card?
      </p>
        </Modal.Content>
        <Modal.Actions>
          <Button  color='red' inverted onClick={this.props.handleClose}>
            <Icon name='remove'/> No
        </Button>
          <Button color='green' inverted onClick={this.confirmClick}>
            <Icon name='checkmark' /> Yes
      </Button>
        </Modal.Actions>
      </Modal>
    )
  }



}

DeleteModal.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  valueIntoModal: PropTypes.string.isRequired
}
