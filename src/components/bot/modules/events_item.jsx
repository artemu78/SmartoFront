import React, {
  Component
} from 'react';
import {
  MenuItem,
  InputLabel,
  Checkbox,
  Select
  // FormHelperText
} from '@material-ui/core';
import style from 'root/css/events.css';
const { connect } = require('react-redux');
const allPossibleEvents = [
  { id: 'new_vote_poll', name: 'New poll vote' }
];

class EventItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      id: props.id,
      eventType: '',
      pollId: '',
      pollAnswerId: '',
      actionType: '',
      screenId: '',
      pollAnswersItems: [],
      active: false
    }
  }

  cutText (str, len) {
    return str.length > len ? (str.substring(0, len - 2) + '...') : str;
  }

  handleSelect (name) {
    return (event) => {
      let stateShadow = { ...this.state };
      this.setState({ [name]: event.target.value });
      stateShadow[name] = event.target.value;
      this.props.setEventItem(stateShadow);
    }
  };

  handleCheck (name) {
    return event => {
      let stateShadow = { ...this.state };
      this.setState({ [name]: event.target.checked });
      stateShadow[name] = event.target.checked;
      this.props.setEventItem(stateShadow);
    }
  };

  handleSelectPoll (name) {
    const handleFunc = this.handleSelect(name);
    return event => {
      const currentPollId = event.target.value;
      const currentPoll = this.props.polls.find(item => item.id == currentPollId);
      if (currentPoll && currentPoll.data) {
        const pollAnswersItems = currentPoll.data.map(answer => {
          return <MenuItem value={answer.id} key={answer.id} title={answer.text}>{this.cutText(answer.text, 15)}</MenuItem>
        });
        this.setState({ pollAnswersItems });
      }
      handleFunc(event);
    }
  };

  getPollsMenuItems () {
    return this.props.polls.map(poll => {
      const pollName = this.cutText(poll.question, 15);
      return <MenuItem value={poll.id} key={poll.id}>{pollName}</MenuItem>;
    });
  }

  getScreensMenuItemsList () {
    const { schemes, bot } = this.props;
    return schemes[bot.id].map(screen => {
      return <MenuItem value={screen._id} key={screen._id}>{screen.name}</MenuItem>;
    });
  }

  render () {
    const { eventType, pollId, pollAnswerId, actionType, screenId, pollAnswersItems } = this.state;

    const eventTypeComponent = <div className = { style.event_item }>
      <InputLabel>Event type</InputLabel>
      <Select value={eventType} onChange={this.handleSelect('eventType')}>
        {allPossibleEvents.map(event => {
          return <MenuItem value={event.id} key={event.id}>{event.name}</MenuItem>;
        })}
      </Select>
    </div>;

    const pollComponent = <div className = { style.event_item }>
      <InputLabel>Poll</InputLabel>
      <Select value={pollId} onChange={this.handleSelectPoll('pollId')}>
        {this.getPollsMenuItems()}
      </Select>
    </div>;

    const answersComponent = <div className = { style.event_item }>
      <InputLabel>Answer</InputLabel>
      <Select value={pollAnswerId} onChange={this.handleSelect('pollAnswerId')}>
        {pollAnswersItems}
      </Select>
    </div>;

    const actionTypeComponent = <div className = { style.event_item }>
      <InputLabel>Action</InputLabel>
      <Select value={actionType} onChange={this.handleSelect('actionType')}>
        <MenuItem value='grp'>Send group post</MenuItem>
        <MenuItem value='cmnt'>Answer as comment</MenuItem>
        <MenuItem value='prm'>Answer in private message</MenuItem>
      </Select>
    </div>;

    const screensComponent = <div className = { style.event_item }>
      <InputLabel>Screen</InputLabel>
      <Select value={screenId} onChange={this.handleSelect('screenId')}>
        {this.getScreensMenuItemsList()}
      </Select>
    </div>;

    const activateCheckbox = <div className = { style.event_item }>
      <InputLabel>Active</InputLabel>
      <Checkbox color="default" onChange={this.handleCheck('active')}/>
    </div>;

    return <div id="zzz" style={{ display: 'flex', padding: '20px 0px' }}>
      {eventTypeComponent}
      {eventType ? pollComponent : null}
      {pollId ? answersComponent : null}
      {pollAnswerId ? actionTypeComponent : null}
      {actionType ? screensComponent : null}
      {screenId ? activateCheckbox : null}
    </div>
  }
}

const mapStateToProps = state => ({
  bot: state.bot,
  schemes: state.schemes
});
export default connect(mapStateToProps)(EventItem);
