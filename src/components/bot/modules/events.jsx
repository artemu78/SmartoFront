import React, {
  Component
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  Checkbox,
  Select,
  Button,
  FormHelperText,
  Fab
} from '@material-ui/core';
import { Add, Save } from '@material-ui/icons';
import test_polls from 'root/test_data/test_polls.json';
import EventItem from './events_item.jsx';
const { connect } = require('react-redux');
const utils = require('root/utils.js');
const save_url = 'data/saveoptions.php';
// import userModuleStyle from 'css/users.css';
// const { connect } = require('react-redux');
// const utils = require('root/utils.js');

const StyledTableCell = withStyles(theme => ({
  head: {
    fontSize: '1rem'
  }
}))(TableCell);

class Events extends Component {
  constructor (props) {
    super(props);
    this.state = {
      eventRows: [],
      pollsRawData: [],
      pollAnswersItems: [],
      screens: [],
      pollsItems: [],
      screensComponents: [],
      currentPollId0: '',
      currentScreen0: '',
      currentActionType0: 'grp',
      currentPollAnswerId0: '',
      eventIsActive0: false,
      events: new Map()
    };
    this.handlePollsDataResponse = this.handlePollsDataResponse.bind(this);
    this.setEventItem = this.setEventItem.bind(this);
    this.saveEvents = this.saveEvents.bind(this);
    this.addEvent = this.addEvent.bind(this);
  }

  setEventItem (obj) {
    let { events } = this.state;
    events.set(obj.id, obj);
  }

  cutText (str, len) {
    return str.length > len ? (str.substring(0, len - 2) + '...') : str;
  }

  handlePollsDataResponse (pollsData) {
    const pollsRawData = pollsData.data;
    const pollsItems = pollsRawData.map(poll => {
      const pollName = this.cutText(poll.question, 25);
      return <MenuItem value={poll.id} key={poll.id}>{pollName}</MenuItem>;
    });
    this.setState({ pollsItems, pollsRawData });
  }

  setScreensMenu () {
    const { schemes, bot } = this.props;

    const screensComponents = schemes[bot.id].map(screen => {
      return <MenuItem value={screen._id} key={screen._id}>{screen.name}</MenuItem>;
    });
    this.setState({ screensComponents });
  }

  componentDidMount () {
    let request = { l: utils.getCookie('l'), b: this.props.bot.id, o: 'gpoll' };
    if (window.location.port === '3000')
      this.handlePollsDataResponse(test_polls);
    else
      utils.sendRequest(request, this.handlePollsDataResponse, save_url);
    this.setScreensMenu();
  }

  saveEvents () {
    const { events } = this.state;
    const request = {
      l: utils.getCookie('l'),
      b: this.props.bot.id,
      o: 'sevent',
      data: Array.from(events.values())
    }
    utils.sendRequest(request, this.handlePollsDataResponse, save_url);
  }

  addEvent () {
    let { events } = this.state;
    const event = {
      id: (new Date()).getTime()
    }
    events.set(event.id, event);
    this.setState({ events })
  }

  render () {
    const { eventIsActive0, currentPollId0, pollsItems, currentActionType0, currentScreen0, screensComponents, pollAnswersItems, currentPollAnswerId0, pollsRawData, events } = this.state;
    let eventsComponents = [];
    events.forEach(event => {
      eventsComponents.push(<EventItem polls = { pollsRawData } id={event.id} setEventItem={this.setEventItem} key={event.id}/>);
    });
    return <React.Fragment>
      {/* <Table>
        <colgroup>
          <col width="30%" />
          <col width="30%" />
          <col width="30%" />
          <col width="10%" />
        </colgroup>
        <TableHead>
          <TableRow>
            <StyledTableCell>Event</StyledTableCell>
            <StyledTableCell>Action</StyledTableCell>
            <StyledTableCell>Screen</StyledTableCell>
            <StyledTableCell>Active</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>New vote in poll:<br/><br/>
              <Select value={currentPollId0} onChange={this.handleSelectPoll('currentPollId0')}>
                {pollsItems}
              </Select>
              <FormHelperText>Poll question</FormHelperText>
              <br/>
              <Select value={currentPollAnswerId0} onChange={this.handleSelect('currentPollAnswerId0')}>
                {pollAnswersItems}
              </Select>
              <FormHelperText>Poll answer</FormHelperText>
            </TableCell>
            <TableCell>
              <Select value={currentActionType0} onChange={this.handleSelect('currentActionType0')}>
                <MenuItem value='grp'>Send group post</MenuItem>
                <MenuItem value='cmnt'>Answer as comment</MenuItem>
                <MenuItem value='prm'>Answer in private message</MenuItem>
              </Select>
            </TableCell>
            <TableCell>
              <Select value={currentScreen0} onChange={this.handleSelect('currentScreen0')}>
                {screensComponents}
              </Select>
            </TableCell>
            <TableCell>
              <Checkbox color="default" checked={eventIsActive0} onChange={this.handleCheck('eventIsActive0')}/>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table> */}
      <br/>
      { eventsComponents }
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Fab color="primary" aria-label="add" onClick={this.addEvent}>
          <Add />
        </Fab>
        <Button variant="contained" size="large" color="primary" style={{ float: 'right' }} onClick={this.saveEvents}><Save />&nbsp;Save</Button>
      </div>
    </React.Fragment>;
  }
}

const mapStateToProps = state => ({
  bot: state.bot,
  schemes: state.schemes
});
export default connect(mapStateToProps)(Events);
