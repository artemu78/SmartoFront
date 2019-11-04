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
  FormHelperText
} from '@material-ui/core';
import test_polls from 'root/test_data/test_polls.json';
import SaveIcon from '@material-ui/icons/Save';
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
      eventIsActive0: false
    };
    this.handlePollsDataResponse = this.handlePollsDataResponse.bind(this);
  }

  cutText (str, len) {
    return str.length > len ? (str.substring(0, len - 2) + '...') : str;
  }

  handleSelect (name) {
    return event => {
      this.setState({ [name]: event.target.value });
    }
  };

  handleCheck (name) {
    return event => {
      this.setState({ [name]: event.target.checked });
    }
  };

  handleSelectPoll (name) {
    const handleFunc = this.handleSelect(name);
    return event => {
      const currentPollId = event.target.value;
      const { pollsRawData } = this.state;
      const currentPoll = pollsRawData.find(item => item.id == currentPollId);
      if (currentPoll && currentPoll.data) {
        const pollAnswersItems = currentPoll.data.map(answer => {
          return <MenuItem value={answer.id} key={answer.id} title={answer.text}>{this.cutText(answer.text, 15)}</MenuItem>
        });
        this.setState({ pollAnswersItems });
      }
      handleFunc(event);
    }
  };

  handlePollsDataResponse (pollsData) {
    const pollsRawData = pollsData.data;
    const pollsItems = pollsRawData.map(poll => {
      const pollName = this.cutText(poll.question, 15);
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
    const { eventIsActive0, currentPollId0, currentActionType0, currentScreen0, currentPollAnswerId0 } = this.state;
    const request = {
      l: utils.getCookie('l'),
      b: this.props.bot.id,
      o: 'sevent',
      data: [
        {
          active: eventIsActive0,
          event: 'new_vote_poll',
          data: {
            poll: currentPollId0,
            answer: currentPollAnswerId0
          },
          action: currentActionType0,
          screen: currentScreen0
        }
      ]
    }
    utils.sendRequest(request, this.handlePollsDataResponse, save_url);
  }

  render () {
    const { eventIsActive0, currentPollId0, pollsItems, currentActionType0, currentScreen0, screensComponents, pollAnswersItems, currentPollAnswerId0, pollsRawData } = this.state;
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
      </Table>
      <br/>
      <EventItem polls = { pollsRawData }/>
      <Button variant="contained" size="large" color="primary" style={{ float: 'right' }} onClick={this.saveEvents}><SaveIcon />&nbsp;Save</Button>
    </React.Fragment>;
  }
}

const mapStateToProps = state => ({
  bot: state.bot,
  schemes: state.schemes
});
export default connect(mapStateToProps)(Events);
