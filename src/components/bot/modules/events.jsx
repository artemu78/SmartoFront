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
  Button,
  Fab
} from '@material-ui/core';
import { Add, Save } from '@material-ui/icons';
import test_polls from 'root/test_data/test_polls.json';
import test_events from 'root/test_data/test_events.json';
import EventAddItem from './event_add_item.jsx';
import EventRow from './event_row.jsx';
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
const allPossibleEvents = [
  { id: 'new_vote_poll', name: 'New poll vote' }
];
const allPossibleActions = [
  { id: 'grp', name: 'Send group post' },
  { id: 'cmnt', name: 'Answer as comment' },
  { id: 'prm', name: 'Answer in private message' }
];

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
      events: new Map(),
      addEvents: new Map()
    };
    this.handlePollsDataResponse = this.handlePollsDataResponse.bind(this);
    this.setEventItem = this.setEventItem.bind(this);
    this.saveEvents = this.saveEvents.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.handleEventsDataResponse = this.handleEventsDataResponse.bind(this);
    this.handleSaveEventsResponse = this.handleSaveEventsResponse.bind(this);
  }

  setEventItem (obj) {
    debugger;
    let { addEvents } = this.state;
    addEvents.set(obj.id, obj);
  }

  cutText (str, len) {
    return str.length > len ? (str.substring(0, len - 2) + '...') : str;
  }

  handleSaveEventsResponse (res) {
    const { events, addEvents } = this.state;
    const newEvents = new Map([...events, ...addEvents]);
    this.setState({ addEvents: new Map(), events: newEvents });
  }

  handleEventsDataResponse (eventsData = {}) {
    const { events } = this.state;
    eventsData && eventsData.data && eventsData.data.forEach(eventServer => {
      const event = {
        id: eventServer.id,
        eventType: eventServer.event,
        actionType: eventServer.action,
        screenId: eventServer.screen,
        active: eventServer.active,
        pollId: eventServer.poll,
        pollAnswerId: eventServer.answer
      }
      events.set(event.id, event);
    });
    this.setState({ events });
  }

  handlePollsDataResponse (pollsData = {}) {
    const pollsRawData = pollsData && pollsData.data;
    if (!pollsRawData)
      return;
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
    let request2 = { l: utils.getCookie('l'), b: this.props.bot.id, o: 'gevents' };
    if (window.location.port === '3000') {
      this.handlePollsDataResponse(test_polls);
      this.handleEventsDataResponse(test_events);
    } else {
      utils.sendRequest(request, this.handlePollsDataResponse, save_url);
      utils.sendRequest(request2, this.handleEventsDataResponse, save_url);
    }
    this.setScreensMenu();
  }

  saveEvents () {
    const { addEvents } = this.state;
    const request = {
      l: utils.getCookie('l'),
      b: this.props.bot.id,
      o: 'sevent',
      data: Array.from(addEvents.values())
    }
    utils.sendRequest(request, this.handleSaveEventsResponse, save_url);
  }

  addEvent () {
    let { addEvents } = this.state;
    const event = {
      id: (new Date()).getTime()
    }
    addEvents.set(event.id, event);
    this.setState({ addEvents });
  }

  render () {
    const { addEvents, pollsRawData, events } = this.state;
    let eventsComponents = [];
    addEvents.forEach(event => {
      eventsComponents.push(<EventAddItem
        allPossibleEvents={allPossibleEvents}
        allPossibleActions={allPossibleActions}
        polls = { pollsRawData } id={event.id}
        setEventItem={this.setEventItem} key={event.id}/>);
    });

    return <React.Fragment>
      <Table>
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
            <StyledTableCell>&nbsp;</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            Array.from(events.values()).map(eventItem => {
              return <EventRow event={eventItem} allPossibleEvents={allPossibleEvents} allPossibleActions={allPossibleActions} allPossiblePolls={pollsRawData} setEventItem={this.setEventItem}/>
            })
          }
          { eventsComponents }
        </TableBody>
      </Table>
      <br/>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Fab color="primary" aria-label="add" onClick={this.addEvent}><Add/></Fab>
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
