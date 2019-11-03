import React, {
  Component
} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  Checkbox,
  Select,
  Button
} from '@material-ui/core';
import test_polls from 'root/test_data/test_polls.json';
import SaveIcon from '@material-ui/icons/Save';
const { connect } = require('react-redux');
const utils = require('root/utils.js');
const save_url = 'data/saveoptions.php';
// import userModuleStyle from 'css/users.css';
// const { connect } = require('react-redux');
// const utils = require('root/utils.js');

class Events extends Component {
  constructor (props) {
    super(props);
    this.state = {
      screens: [],
      pollsComponents: [],
      screensComponents: [],
      currentPollId0: '',
      currentScreen0: '',
      currentActionType0: 'grp'
    };
    this.handlePollsData = this.handlePollsData.bind(this);
  }

  handleSelect (name) {
    return event => {
      // this.props.setMainScreen(this.state.screen._id, event.target.checked);
      this.setState({ [name]: event.target.value });
    }
  };

  handlePollsData (pollsData) {
    const pollsComponents = pollsData.data.map(poll => {
      const pollName = poll.question.length > 15 ? (poll.question.substring(0, 13) + '...') : poll.question;
      return <MenuItem value={poll.id} key={poll.id}>{pollName}</MenuItem>;
    });
    this.setState({ pollsComponents });
  }

  setScreensMenu () {
    const { schemes, bot } = this.props;

    const screensComponents = schemes[bot.id].map(screen => {
      return <MenuItem value={screen._id} key={screen._id}>{screen.name}</MenuItem>;
    });
    this.setState({ screensComponents });
  }

  componentDidUpdate () {
    console.log(this.props);
  }

  componentDidMount () {
    let request = { l: utils.getCookie('l'), b: this.props.bot.id, o: 'gpoll' };
    if (window.location.port === '3000')
      this.handlePollsData(test_polls);
    else
      utils.sendRequest(request, this.handlePollsData, save_url);
    this.setScreensMenu();
  }

  render () {
    const { currentPollId0, pollsComponents, currentActionType0, currentScreen0, screensComponents } = this.state;
    return <React.Fragment>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Active</TableCell>
            <TableCell>Event</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Screen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Checkbox color="default" />
            </TableCell>
            <TableCell>New vote in poll:<br/>
              <Select value={currentPollId0} onChange={this.handleSelect('currentPollId0')}>
                {pollsComponents}
              </Select>
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
          </TableRow>
        </TableBody>
      </Table>
      <br/>
      <Button variant="contained" size="large" color="primary" style={{ float: 'right' }} startIcon={<SaveIcon />}>Save</Button>
    </React.Fragment>;
  }
}

const mapStateToProps = state => ({
  bot: state.bot,
  schemes: state.schemes
});
export default connect(mapStateToProps)(Events);
