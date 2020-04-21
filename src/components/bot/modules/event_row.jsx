import React, { useState } from 'react';
import { Edit, CheckBox, CheckBoxOutlineBlank, Poll, RadioButtonChecked } from '@material-ui/icons';
import EventAddItem from './event_add_item.jsx';
import { TableCell, TableRow, Fab } from '@material-ui/core';
const { connect } = require('react-redux');
const toObject = (array) => {
  let result = {};
  array.map((item) => {
    const property = (item.id || item._id).toString();
    result[property] = item.name || item.question || item.text;
  });
  return result;
};

const EventRow = (props) => {
  const {
    event,
    allPossibleEvents,
    allPossibleActions,
    schemes,
    bot,
    allPossiblePolls,
    setEventItem
  } = props;
  const [mode, setMode] = useState('view');
  const setViewMode = (mode) => {
    return () => {
      setMode(mode);
    };
  };
  const eventsNamesObj = toObject(allPossibleEvents);
  const eventsActionsObj = toObject(allPossibleActions);
  const screensObj = toObject(schemes[bot.id]);
  let pollsObj = toObject(allPossiblePolls);
  let answersObj = {};
  allPossiblePolls &&
    allPossiblePolls.forEach((pollItem) => {
      Object.assign(answersObj, toObject(pollItem.data));
    });
  const pollText = event.pollId ? (
    <>
      <br />
      <Poll /> {pollsObj[event.pollId]}
    </>
  ) : (
    ''
  );
  const answerText = event.pollAnswerId ? (
    <>
      <br />
      <RadioButtonChecked /> {answersObj[event.pollAnswerId]}
    </>
  ) : (
    ''
  );
  let rowContent = null;
  const addEvensProps = {
    allPossibleEvents,
    allPossibleActions,
    polls: allPossiblePolls,
    id: event.id,
    setEventItem,
    key: event.id,
    eventType: event.eventType,
    pollId: event.pollId,
    pollAnswerId: event.pollAnswerId,
    actionType: event.actionType,
    screenId: event.screenId,
    active: !!+event.active,
    cancelFunc: () => setViewMode('view'),
    saveFunc: setEventItem
  };
  if (mode === 'view')
    rowContent = (
      <TableRow key={event.event_id}>
        <TableCell key='1'>
          {eventsNamesObj[event.eventType]}
          {pollText}
          {answerText}
        </TableCell>
        <TableCell key='2'>{eventsActionsObj[event.actionType]}</TableCell>
        <TableCell key='3'>{screensObj[event.screenId]}</TableCell>
        <TableCell key='3.5'>
          {+event.active ? <CheckBox /> : <CheckBoxOutlineBlank />}
          &nbsp;
        </TableCell>
        <TableCell key='4'>
          <Fab color='primary' aria-label='edit' onClick={setViewMode('edit')}>
            <Edit />
          </Fab>
        </TableCell>
      </TableRow>
    );
  else rowContent = <EventAddItem {...addEvensProps} />;
  return rowContent;
};

const mapStateToProps = (state) => ({
  bot: state.bot,
  schemes: state.schemes
});
export default connect(mapStateToProps)(EventRow);
