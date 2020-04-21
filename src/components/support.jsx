import React, { Component } from 'react';
import css from './../css/support.css';
const { connect } = require('react-redux');
const utils = require('./../utils.js');

class Support extends Component {
  constructor () {
    super();
    this.state = { val: '' };
    this.handleChange = this.handleChange.bind(this);
    this.is_sent = this.is_sent.bind(this);
  }

  handleChange (event) {
    this.setState({ val: event.target.value });
  }

  send_support_request () {
    let text = this.state.val;
    let login = utils.getCookie('l');
    let request_obj = { l: login, text: text };
    utils.sendRequest(request_obj, this.is_sent, 'data/support.php');
  }

  is_sent (response) {
    this.setState({ val: '' });
    let text = 'Thank you. Your request is sent. We answer as soon as we can.';
    window.alert(text);
  }

  render () {
    // if (!this.props.show_support)
    //   return null;

    return (
      <div className={css.support}>
        <div className={css.text1}>Support</div>
        <div className={css.text2}>Here you can write us about your problems and we will gladly help you.</div>
        <div className={css.text3}>Ask your question here</div>
        <div><textarea className={css.textArea} onChange={this.handleChange} value={this.state.val} /></div>
        <div className={css.send_btn} onClick={() => { this.send_support_request() }}>Send</div>
      </div>
    );
  }
};

const mapStateToProps = state => ({
  show_support: state.show_support
});

export default connect(
  mapStateToProps
)(Support);
