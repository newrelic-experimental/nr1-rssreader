import React from 'react';
import axios from 'axios';
import * as Parser from 'rss-parser';
import { Container, Grid, Image, Card, Icon, List, Modal, Button, Header } from 'semantic-ui-react'
import _ from 'lodash'
import { UserStorageMutation, UserStorageQuery, Toast } from 'nr1';

import EditModal from './editmodal'
import { v1 as uuidv1 } from 'uuid';
import StatusCard from './statuscard'
// Types
import PropTypes from 'prop-types';

let parser = new Parser();


export default class RssStatusNerdletNerdlet extends React.Component {

  static propTypes = {
    nerdletUrlState: PropTypes.object.isRequired,
    launcherUrlState: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      valueIntoModal: "123456abcdef",
      dashboardCards: [],
      remountKey: (new Date()).getTime()
    }
  }

  componentDidMount() {
    //if (this.props.nerdletUrlState && this.props.nerdletUrlState.entityGuid) {
    //  console.debug("Calling loadState with props", this.props);
    this._loadState();
    // } else {
    //  this.setState({ openModal: true });
    // }
  }

  removeCard(uuid) {

      var collection = this.state.dashboardCards;
      // search through all cards for this url,  and remove it, 
      for(var i = 0; i < collection.length; i++)
      {

        var targetuuid = collection[i].uuid;
        if(targetuuid == uuid)   /// remove by uuid
        {
          // remove it,  ,,
          collection = collection.splice(i,1)
          break; 
        }
      }

    const { entity } = this.props;
    const cards = this.state.dashboardCards;

    this.setState({ dashboardCards: collection }, () => {
      UserStorageMutation.mutate({
        actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'rss-dashboard-cards',
        documentId: '2434slkj230iufsolwkjw',
        document: { cards }
      }).then(() => {
        Toast.showToast({ title: "Update Saved.", type: Toast.TYPE.NORMAL });
      }).catch(error => {
        console.error(error);
        Toast.showToast({ title: error.message, type: Toast.TYPE.CRITICAL });
      });
    });
  }


  editCard(uuid, _rssurl, _logourl) {

    var collection = this.state.dashboardCards;
    // search through all cards for this url,  and remove it, 
    for(var i = 0; i < collection.length; i++)
    {
      var targetuuid = collection[i].uuid;
      if(targetuuid == uuid)   /// find by uuid
      {
        // update  it,  ,,
        collection[i].rssurl = _rssurl;
        collection[i].logourl = _logourl;
        break; 
      }
    }

    const { entity } = this.props;
    const cards = this.state.dashboardCards;

    this.setState({ removeCard: (new Date()).getTime() , dashboardCards: collection }, () => {

     // window.location.reload(false);

      UserStorageMutation.mutate({
        actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'rss-dashboard-cards',
        documentId: '2434slkj230iufsolwkjw',
        document: { cards }
      }).then(() => {
        Toast.showToast({ title: "Update Saved.", type: Toast.TYPE.NORMAL });
      }).catch(error => {
        console.error(error);
        Toast.showToast({ title: error.message, type: Toast.TYPE.CRITICAL });
      });
    });

  }





  appendDashboard(_rssurl, _logourl) {

    var bla = this.state.dashboardCards;
    var new_uuid = uuidv1();
    var ele = {
      // rssurl : "https://status.pagerduty.com/history.rss",
      // logourl : "https://www.logo.wine/a/logo/PagerDuty/PagerDuty-Logo.wine.svg"
      uuid: new_uuid,
      rssurl: _rssurl,
      logourl: _logourl

    }

    bla.push(ele)

    const { entity } = this.props;
    const cards = this.state.dashboardCards;

    this.setState({ dashboardCards: bla }, () => {
      UserStorageMutation.mutate({
        actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'rss-dashboard-cards',
        documentId: '2434slkj230iufsolwkjw',
        document: { cards }
      }).then(() => {
        Toast.showToast({ title: "Update Saved.", type: Toast.TYPE.NORMAL });
      }).catch(error => {
        console.error(error);
        Toast.showToast({ title: error.message, type: Toast.TYPE.CRITICAL });
      });
    });

  }



  /**
     * Load the entity using the loadEntity utils function, then look up if there's a entityList-v0 collection for this entity and user.
     * @param {string} entityGuid
     */
  _loadState() {


    UserStorageQuery.query({
      collection: 'rss-dashboard-cards',
      documentId: '2434slkj230iufsolwkjw'
    }).then(({ data }) => {
      console.debug(data);
      if (data.cards) {
        this.setState({ dashboardCards: data.cards });
      } else {
        this.setState({ dashboardCards: [] });
      }
    }).catch(error => {
      console.error(error);
      this.setState({ dashboardCards: [] });
      Toast.showToast({ title: error.message, type: Toast.TYPE.CRITICAL });
    });
  }


  render() {

    // let { feed } = this.state;

    return (


      [
        <Button  // Button to click to activate the Modal
          key='button1'
          primary
          content='Add New Card'
          onClick={
            () => {
              this.setState({ modalOpen: true })
            }
          }
        />,
        <EditModal // The invisible modal itself
          key='modal1'
          modalOpen={this.state.modalOpen}
          rssurl=""
          logourl=""
          handleClose={() => {
            this.setState({ modalOpen: false })  // just close the dialog
          }
          }
          handleConfirm={(rss, logo) => {
            var bla = logo;

            // add some checksum on the urls... 
            this.appendDashboard(rss, logo)
            this.setState({ modalOpen: false })
          }
          }
        
          valueIntoModal={this.state.valueIntoModal}
        />,
        <Grid divided='vertically' >
          <Grid.Row columns={4}>

            {
              this.state.dashboardCards.map((item, i) => {
                
                return (
                  <Grid.Column >
                    <StatusCard  data={item} key={this.state.remountKey}
                    handleEdit={(uuid, rss, logo) => {
                      var bla = logo;
                      this.editCard(uuid, rss, logo)
                      // add some checksum on the urls... 
                      // this.appendDashboard(rss, logo)
                      //this.setState({ modalOpen: false })
                    }
                    } handleDelete={(uuid) => {
                      this.removeCard(uuid)
                    }
                    }
                    ></StatusCard>
                  </Grid.Column>
                );
              })
            }






            {
             /* <Grid.Column >
                    <StatusCard url="https://status.aws.amazon.com/rss/ec2-us-east-2.rss" icon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOoAAAB7CAMAAABNcOyaAAAAtFBMVEX///8jLz7/mQD/lQD/lwAgLTz/kwAaKDgXJjceKzv/kQBMU13k5eb/+fT/s24SIjQAAAAAAB//jQAGGy/19fYAESgAFywAABrT1NYoLj2VmJ2ipaqCh44AABMAABc1P0y4ur3GyMusr7OOj5VobHRZYGn/8eL/pk54fYQAAAo+SFP/0KD/37//w5D/wYD/oTj/59D/mh0dITP/rEz/1bH/rlj/oCz/qUH/sWL/y5X/u3T/uXtuGUAoAAAI4ElEQVR4nO2Za2OiOhCGRe4IRW6KogUUrfXurlrb/v//dTIJSEC32+7Rwp6T50tLCDEvM5mZhEaDwWAwGAwGg8FgMBgMBoPBYDAYDMb/FD0K+uPxuB9E+m0GdGM8YBD57m0GvA3+IOyppukgTJVrBefJueMBYlTujRj7xcYIGvt5nyQUyXgyFyalASpDD5Sho4pchihb3VEqNrZguu0+3d8fdlCb1ytYP2pDx27a5k/aipiNKIqmZQV1MG0UeipXQvQGZGquDJdqSD8QWLhPN6YbWwp+SeRi1HNKA6pWHQw7IdNSZVlRFDm1ruilhpyABM6kLTgxcZcObWq3B8+ZM3wReTLxDsVEKDLc6sy+TdCvAXuojhO2JkmSTFqyQ8S2yVocYROatE0s0kGmTR3jN/KIn/F/4A6O2Epmg8EsmYQdh3PqIVXphoPI18FlXT0aEK3KBN/VidRB3l9/Tp3ymRpkDJZWVTzEDLuJl8SpK7j+aGY910HqpN2KXTpoRF3sfhw2kYvdVUnyDiMvlfqYx2A3gV7Ecr6CHXZMD+nq/VLArgT3IjYGWIwZ4AusTAzzmSZKKpVarPocIpsX4QfAD9RWHSLu79E5mLhDnNbHgaoTZTfdlsqJc9CbujgQg8+qc/w+Bh1YyMk3z/kPcWfgjiZxWh3H4M44u+mHIqdOIvQyxPnZcn0PP4D/x0tV+UukEg9WWiSs4Igjn2WNTIhS4LEil2VWF7+O1OOxVPkvceDGqENJjXCStLLMOkZKrAjnWydI21wPnFwhXUh6koPLYetIRAxDpk6qA6SOXEGsbeuNgXlezWipdqmSysdBTe31L4atIwWpjcTMFyIOWaoFxXFu98YA+nupHUniQddmoNfSi10/GiGiGKZXlBrh7GGSC5AI+dMdorikpCkohIj9mLl4/COre9XZqA7ptEA8a4Uy2XHNW0kwVmipoArpI1cQa3HpDgkp9Wq9GLga42FW5DtmOAlutP+9CX44NNV0dyOKqtLBld1ZaurBxD/nKEh5cAPSZ1rYQlA++y8w+JGVGRwarT2PauLIbuCdJ0aTS8UxNd21tLMbEIrSih/SsKjQe7qo1ZWpkax59J2KfknfwQZF++fh8/Pz0PJMspHLpfqwDZMnYBp/CIEX/tM7qPEZ1/eQeM4hiqCPuGdHPm/3FWdcA8NGZKNihgna3CDiAK1bsSDVhTKQFAx9cNsRaUS2tKAN6qfC3oegj1shHN8QrIv7346LoyfnzWijjAoROC2YPFCIDJgVSeNOmlnxhkCJrgzuB7PQSsUO4ysdvpUAJ0FzUmiMSlJjkSN+66J6UJ2nVZEDfRokq4q96w7q6oHqpUv/fiI+Bcn3ollMCGWrYtPLoduIkU2zTQuu+0MdyZfzCuMagUNCe8Vm1Vsyjq5FmwSdolQcY7mujn3ASSs+Fx4Vo4b+CPeiD36kT+9/K8PHS7VTqlfHZam4yEWVA/iqlRVA4BBmnxRT1kcBlsQDZ/xBl2/AF9VS+m+AvZSS1AZsXZQJTiuPWRu4Ocq2cCLzkf+ej2OqlsqRg6BCI7bTOfxgElwl6ChTKvOsDU7Y0PswqX3Pdcj5lFnxVkeHmAL2otrcXlpTUKU6Vq9A0qFeiyVyojpSi0dPV3BNnKejG8/9i6Q7LouKjv48rRM96vCXrGl4LV3qQA1MDW5hUgeKjeCi4k0gBIu9qsv+Mc4EKpcJ0IOeycnYrPSZdrYJ5VQxnzGujcWyb7a7aj+mZPkzHICrP95Pj+IVOPT2oSj0VM6c48qw8FWmn0qlDah3SZuoUv7rtjnVk1uz8Sj2dRgxJC/TqtqoqNYhxYxqmoqimCaUA3OdZH36q1TMkdqdzku4eMABjBoPSYXPNXg4GJBUwWp+ulohrQ5HI3qQZHogwqNTCKmVOTPKm9wB+bJVDOCcyV2gKHX4ENfQE4v6tmpaffDQ+FGVrcIWYOaJCLkQawML2sR2If76raEiFoSq1scR+hsZgaNhZzPlSSovcMJizer2gB+F5KhPfkBbeX8WT3rYgWUEjBzW4jsywY0GSTJJksEot+NlFHHdy88719qgOe7PkhYwmfUr372VcN1bn2S6sNGv5/Eog8FgMP57TJf7BWI5rXoid2W6XB9t29YA9PfnwqhkGqvVvV/zdLXRJL6Zw9vrO//kdSTtuLjn+Mb6KAlniFbheM9f/CXLHW8fl3fzKAP5LTLpcYPZEetWJLWx3PC89rC80+jTh/Viv19ut9vpdLpd7n9KFUptTHdSkxcO2/uMXvKX6RE5MX+4z2/9HuMgCShWvNzPjSnWyKxaNWEJMFYSvGv7sL9fNJ5uyYsEqfa9lstnWNoQL3h+83Yfy07Xm907DG08oB+yq8mr2VzAiVHAkJAf39q00+WLDQkHooGB1ir/UqnUhvGq8WmCf1ndcNUay9URu4yGHWZqo//umsg/w/KopRleEp7WtwnI0/XTjriLTZbG3m4S81bMepfVb8iRpfV2+m+Ma0y3azQKKZCkTRqJXvgm/1Ct/xKWJ01o5mp3b3+6ETGWi/djphOtiazQNlD85fc3nPGfY+y1XGxT4LXd0+l1+0UrbF9PyG0znch3j+fksuCbwu7Wk/5TjNVRysWihcVLmt08LVBh9zvFBvLZ/VvTtiVeyJ2D3+RRyDjx1SbVEtP3ndYsIiC50vGwfoVyFmkuiAaFqLpdrB5eBFTbC4UHtSO9SdweBentu/V8yHRla0KzLBfZV9KE3WbzdDidHs6cDoenzU6QJInnSw8JmrYurPW9xG/qdgphrDcXE88UY/gz9Ea00JEXNq9Fnzc2/K5G7pthLE78pWk/jaAJ7/vy4t7aUj2ibxlju+bt66b9nU7Jbl6L22utnkox29NGkL4kF63o3eatBvXQ1zH2q4NQiqu/hNe048OqhsvxsxgoWx5tW+OvRZ/UlgLkI/vn6/JfFZM1Yft62KCkwkNSKSHsdpunt8VXq6pag6qhxWr1/kDzvnpdLP9TKmkMmqonw2AwGAwGg8FgMBgMBoPBYDAYDMbfyT9LorZpc83OCQAAAABJRU5ErkJggg=="></StatusCard>
              </Grid.Column>

              <Grid.Column >
                <StatusCard url="https://status.aws.amazon.com/rss/elastictranscoder-us-east-1.rss" icon="data:image/png;base64,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"></StatusCard>
             
              </Grid.Column>

              <Grid.Column >
                <StatusCard url="https://status.pagerduty.com/history.rss" icon="https://www.logo.wine/a/logo/PagerDuty/PagerDuty-Logo.wine.svg"></StatusCard>
              </Grid.Column>
        
              <Grid.Column >
                <StatusCard url="https://status.twilio.com/history.rss" icon="https://logo.clearbit.com/twilio.com"></StatusCard>
              </Grid.Column>
              <Grid.Column >
                <StatusCard url="https://jira-software.status.atlassian.com/history.rss" icon="https://wac-cdn.atlassian.com/dam/jcr:75ba14ba-5e19-46c7-98ef-473289b982a7/Jira%20Software-blue.svg?cdnVersion=1123"></StatusCard>
              </Grid.Column>

              <Grid.Column >
                <StatusCard url="https://www.githubstatus.com/history.rss" icon="https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png"></StatusCard>
              </Grid.Column>

         
             */}


          </Grid.Row>
        </Grid>
      ]

    );

  }


}
