import React from 'react';
import { Container, Grid, Image, Header, Card, Icon, List } from 'semantic-ui-react'
// Types
import PropTypes from 'prop-types';
import StatusItem from './statusitem'

export default class StatusList extends React.Component {

  constructor(props) {
    super(props);
    this.state = { items: [] }
  }

  componentWillReceiveProps(nextProps) {

   
    if(nextProps.items != undefined &&  nextProps.items.length > 0)
    {
      var temp = nextProps.items;
      if(temp.length > 3)
      {
         temp = temp.slice(0,3);
      }
     
      this.setState({ items: temp});
    }

   
  }


   componentDidMount() {
    
  }
//style={{overflow: 'auto', maxHeight: 200 }}
  render() {
  
    return (

      <List divided relaxed >
          {
          this.state.items.map((item, i) => {
            return(

              <StatusItem item={item}></StatusItem>
                );
            })
          }
            
      </List>

    );
   
  }
}