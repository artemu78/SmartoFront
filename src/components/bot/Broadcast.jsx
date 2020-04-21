import React, { Component } from 'react';
import { post } from 'axios';
import css from './../../css/broadcast.css';
const { connect } = require('react-redux');
const utils = require('./../../utils.js');
let api_url = 'data/sendmessage.php';

class Broadcast extends Component {
  constructor(props) {
    super(props);
    this.immediatePushFormData = new window.FormData();
    this.handleChange = this.handleChange.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.filesOnChange = this.filesOnChange.bind(this);
    this.handleResponse_push = this.handleResponse_push.bind(this);
    this.pushes = this.pushes.bind(this);
    this.state = {
      message: '',
      message_push: '',
      push_mins: '',
      pushes: [],
      pushes_i: [],
      var: '',
      val: ''
    };
  }

  filesOnChange(e) {
    const files = Array.from(e.target.files);

    files.forEach((file, i) => {
      this.immediatePushFormData.append('attach', file, file.name);
    });
    /*
    this.immediatePushFormData.append('l', utils.getCookie('l'));
    this.immediatePushFormData.append('b', this.props.bot.id);
    this.immediatePushFormData.append('t', 'kur');

    post(api_url, this.immediatePushFormData).then(response => {
      this.setState({ save: 'Saved successful' }, () => {
        setTimeout(() => { this.setState({ save: 'Save', disable: false }) }, 500);
      });
    }).catch(error => {
      this.setState({ save: 'Save' });
      window.alert(error);
    });
    */
  }

  componentDidMount() {
    this.getPushes();
  }

  getPushes() {
    let obj = {
      l: utils.getCookie('l'),
      b: this.props.bot.id,
      t: 'g'
    };
    let method = window.location.hostname === 'localhost' ? 'GET' : 'POST';
    utils.sendRequest(obj, this.pushes, api_url, method);
  }

  pushes(response) {
    if (typeof response.data === 'object')
      this.setState({ pushes: response.data.p, pushes_i: response.data.i });
    // console.log(response, 'pushes response');
  }

  handleResponse(response) {
    this.immediatePushFormData = new window.FormData();
    if (response.res === 'ok') {
      window.webix.message({
        text: 'Message sent',
        type: 'info',
        expire: 5000,
        id: 'message1'
      });
      this.setState({ message: '' });
      this.getPushes();
    } else
      window.webix.message({
        text: response.error,
        type: 'error',
        expire: 10000,
        id: 'message1'
      });
  }

  handleResponse_push(response) {
    this.immediatePushFormData = new window.FormData();
    window.webix.message({
      text: 'Message sent',
      type: 'info',
      expire: 10000,
      id: 'message1'
    });
    this.setState({ message_push: '', push_mins: '', var: '', val: '' });
    this.getPushes();
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  send() {
    const confirm_obj = {
      text: 'Message for all bots users will be sent immediately. Are you sure?',
      callback: (answer) => {
        answer && this.sendImmediateMessage();
      }
    };
    window.webix.confirm(confirm_obj);
  }

  sendImmediateMessage() {
    this.immediatePushFormData.append('l', utils.getCookie('l'));
    this.immediatePushFormData.append('b', this.props.bot.id);
    this.immediatePushFormData.append('t', 'i');
    this.immediatePushFormData.append('message', this.state.message);

    post(api_url, this.immediatePushFormData)
      .then((response) => {
        this.handleResponse(response.data);
      })
      .catch((error) => {
        window.webix.message({
          text: error,
          type: 'error',
          expire: 10000,
          id: 'message2'
        });
        this.immediatePushFormData = new window.FormData();
      });
  }

  send_push() {
    let obj = {
      l: utils.getCookie('l'),
      b: this.props.bot.id,
      t: 'p',
      message: this.state.message_push,
      mins: this.state.push_mins,
      var: this.state.var,
      val: this.state.val
    };
    utils.sendRequest(obj, this.handleResponse_push, 'data/sendmessage.php');
  }

  push_template(push_item) {
    return (
      <>
        <hr />
        {push_item.var}={push_item.val}, {push_item.min_delay} min.
        <br />
        {push_item.text}
      </>
    );
  }

  push_immediate_template(push_item) {
    return (
      <>
        <hr />
        {push_item.dt} {push_item.text}
      </>
    );
  }

  render() {
    let pushes = this.state.pushes.map((push_item, i) => {
      return this.push_template(push_item, i);
    });
    let immediate_pushes = this.state.pushes_i.map((push_item, i) => {
      return this.push_immediate_template(push_item, i);
    });
    let conditional_push = (
      <fieldset className={css.Broadcast}>
        <legend>Conditional pushes</legend>
        <div className='text_input'>
          Message
          <br />
          <textarea
            type='text'
            name='message_push'
            value={this.state.message_push}
            onChange={this.handleChange}
          />
          <br />
          Send after{' '}
          <input
            type='number'
            name='push_mins'
            size='3'
            min='0'
            value={this.state.push_mins}
            onChange={this.handleChange}
          />{' '}
          minutes for &nbsp;
          <input
            type='text'
            name='var'
            min='0'
            value={this.state.var}
            onChange={this.handleChange}
            style={{ width: '90px' }}
          />
          &nbsp;=&nbsp;
          <input
            type='text'
            name='val'
            min='0'
            value={this.state.val}
            onChange={this.handleChange}
            style={{ width: '90px' }}
          />
        </div>
        <div
          className='button'
          onClick={() => {
            this.send_push();
          }}
        >
          Set push
        </div>
        <div className={css.pushes}>
          <div>Current pushes:</div>
          {pushes}
        </div>
      </fieldset>
    );

    return (
      <div className='bot_options'>
        <div className='chapter_header'>Broadcast</div>
        <fieldset className={css.Broadcast}>
          <legend>Immediate send</legend>
          <div className='text_input'>
            Message
            <br />
            <textarea
              type='text'
              name='message'
              value={this.state.message}
              onChange={this.handleChange}
            />
          </div>
          <div className='text_input'>
            Attachment <br />
            <input type='file' id='multi' onChange={this.filesOnChange} multiple />
          </div>
          <div
            className='button'
            onClick={() => {
              this.send();
            }}
          >
            Immediate send
          </div>
          <div className={css.pushes}>
            <div>Immediate pushes history:</div>
            {immediate_pushes}
          </div>
        </fieldset>
        <br />
        {conditional_push}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  bot: state.bot
});

export default connect(mapStateToProps)(Broadcast);
