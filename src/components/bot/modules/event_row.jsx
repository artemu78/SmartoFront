import React from 'react';
import { Edit, CheckBox, CheckBoxOutlineBlank, Poll, RadioButtonChecked } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import {
  TableCell,
  TableRow,
  Button,
  Fab
} from '@material-ui/core';
const { connect } = require('react-redux');
const toObject = (array) => {
  let result = {};
  array.map(item => {
    const property = (item.id || item._id).toString();
    result[property] = item.name || item.question || item.text;
  });
  return result;
}

const EventRow = (props) => {
  const { event, allPossibleEvents, allPossibleActions, schemes, bot, allPossiblePolls } = props;
  const editEvent = (event_id) => {
    return () => {};
  }
  const eventsNamesObj = toObject(allPossibleEvents);
  const eventsActionsObj = toObject(allPossibleActions);
  const screensObj = toObject(schemes[bot.id]);
  let pollsObj = toObject(allPossiblePolls);
  let answersObj = {}
  allPossiblePolls && allPossiblePolls.forEach(pollItem => {
    Object.assign(answersObj, toObject(pollItem.data));
  });
  const pollText = event.pollId ? (<><br/><Poll/> {pollsObj[event.pollId]}</>) : '';
  const answerText = event.pollAnswerId ? (<><br/><RadioButtonChecked/> {answersObj[event.pollAnswerId]}</>) : '';
  return (
    <TableRow key={event.event_id}>
      {+event.active ? <CheckBox /> : <CheckBoxOutlineBlank/>}
      &nbsp;
      <TableCell key="1">
        {eventsNamesObj[event.eventType]}
        {pollText}
        {answerText}
      </TableCell>
      <TableCell key="2">{eventsActionsObj[event.actionType]}</TableCell>
      <TableCell key="3">{screensObj[event.screenId]}</TableCell>
      <TableCell key="4">
        <Fab color="primary" aria-label="edit" onClick={this.editEvent(event.event_id)}><Edit/></Fab>
      </TableCell>
    </TableRow>
  );
}

const mapStateToProps = state => ({
  bot: state.bot,
  schemes: state.schemes
});
export default connect(mapStateToProps)(EventRow);
