import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';

import style from 'css/users.css';
import test_users from 'root/test_data/test_users.json';
import test_user_dialog from 'root/test_data/test_user_dialog.json';
import vk_avatar from 'root/img/social/35x35/vk.png';
import tm_avatar from 'root/img/social/35x35/tm.png';
import web_avatar from 'root/img/social/35x35/web.png';
const utils = require('root/utils.js');
const save_url = 'data/saveoptions.php';
const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: '1rem'
  }
}))(TableCell);

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRowsHTML: null,
      dialogOpen: false,
      userDialogRowsHTML: null,
      currentUser: null,
      userDialogs: new Map()
    };
    this.display_users = this.display_users.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.displayUserDialogHTML = this.displayUserDialogHTML.bind(this);
  }

  handleCloseDialog() {
    this.setState({ dialogOpen: false, userDialogRowsHTML: null, currentUser: null });
  }

  handleOpenDialog(param1, userItem) {
    this.setState({ dialogOpen: true, currentUser: userItem });
  }

  getUserHTMLByBotType(item) {
    let userObj = {
      link: null
    };
    switch (item.bot_type) {
      case 'tg':
        userObj.bot_type = tm_avatar;
        userObj.link = item.username ? (
          <a href={`https://t.me/${item.username}`} target='_blank'>
            {item.username}
          </a>
        ) : null;
        break;
      case 'vk':
        userObj.bot_type = vk_avatar;
        userObj.link = item.vk_id ? (
          <a href={`https://vk.com/id${item.vk_id}`} target='_blank'>
            id{item.vk_id}
          </a>
        ) : null;
        break;
      case 'ws':
        userObj.bot_type = web_avatar;
        break;
      default:
        userObj.bot_type = null;
        break;
    }
    return userObj;
  }

  componentDidMount() {
    let obj = { l: utils.getCookie('l'), b: this.props.bot.id, o: 'gus' };
    if (window.location.port === '3000') this.display_users(test_users);
    else utils.sendRequest(obj, this.display_users, save_url);
  }

  display_users(users) {
    if (!users || !users.data || Array.isArray(!users.data)) return;
    let usersRowsHTML = users.data.map((item, i) => {
      let userObj = this.getUserHTMLByBotType(item);
      return (
        <TableRow
          key={item.id}
          hover
          className={style.usersRow}
          onClick={(e) => this.handleOpenDialog(e, item)}
        >
          <TableCell>{item.create_dt}</TableCell>
          <TableCell>
            {item.name} {item.surname} {userObj.link}
          </TableCell>
          <TableCell>{item.screens_count}</TableCell>
          <TableCell>
            <img src={userObj.bot_type} alt='' />
          </TableCell>
        </TableRow>
      );
    });
    this.setState({ usersRowsHTML });
  }

  displayUserDialogHTML(userDialogData) {
    if (!userDialogData || !userDialogData.data || Array.isArray(!userDialogData.data)) return;

    let userDialogRowsHTML = userDialogData.data.map((item, i) => {
      const fakeKey1 = Math.random().toFixed(9) * 1000000000;
      const fakeKey2 = Math.random().toFixed(9) * 1000000000;
      const itemButtonAnswer = item.btn ? <span className={style.fakeButton}>{item.btn}</span> : '';
      const userRequest = item.req ? item.req : itemButtonAnswer;
      return (
        <React.Fragment>
          <TableRow key={fakeKey1}>
            <TableCell>{item.dt}</TableCell>
            <TableCell>{userRequest}</TableCell>
            <TableCell>&nbsp;</TableCell>
          </TableRow>
          <TableRow key={fakeKey2}>
            <TableCell>{item.dt}</TableCell>
            <TableCell>&nbsp;</TableCell>
            <TableCell>{item.answ}</TableCell>
          </TableRow>
        </React.Fragment>
      );
    });
    this.setState({ userDialogRowsHTML });
  }

  getUserDialogTableHTML() {
    const { userDialogRowsHTML, userDialogs, currentUser } = this.state;

    if (currentUser && !userDialogs.has(currentUser.id) && !userDialogRowsHTML) {
      let obj = { l: utils.getCookie('l'), b: this.props.bot.id, u: currentUser.id, o: 'gusd' };
      if (window.location.port === '3000') this.displayUserDialogHTML(test_user_dialog);
      else utils.sendRequest(obj, this.displayUserDialogHTML, save_url);
    }

    return (
      <Table>
        <TableHead>
          <TableRow className={style.usersHeader}>
            <StyledTableCell>Date/time</StyledTableCell>
            <StyledTableCell>Visitor</StyledTableCell>
            <StyledTableCell>Bot</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>{userDialogRowsHTML}</TableBody>
      </Table>
    );
  }

  getDialogContainerHTML() {
    const userDialogTableHTML = this.getUserDialogTableHTML();
    const dialog = (
      <Dialog
        maxWidth='lg'
        fullWidth={true}
        open={this.state.dialogOpen}
        onClose={this.handleCloseDialog}
        aria-labelledby='max-width-dialog-title'
      >
        {/* <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle> */}
        <DialogContent>
          <DialogContentText>{userDialogTableHTML}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseDialog} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
    return dialog;
  }

  render() {
    const { usersRowsHTML } = this.state;
    const dialogContainerHTML = this.getDialogContainerHTML();
    return (
      <div className='bot_options'>
        <Table>
          <colgroup>
            <col width='20%' />
            <col width='35%' />
            <col width='35%' />
            <col width='10%' />
          </colgroup>
          <TableHead>
            <TableRow className={style.usersHeader}>
              <StyledTableCell>Registration</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Answers</StyledTableCell>
              <StyledTableCell>Platform</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{usersRowsHTML}</TableBody>
        </Table>
        {dialogContainerHTML}
      </div>
    );
  }
}

export default Users;
