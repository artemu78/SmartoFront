import React, { Component } from 'react';
import './../css/service.css';
const { connect } = require('react-redux');

class Service extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    if (!this.props.show_service) return null;

    return (
      <div className='service'>
        <div className='text1'>Service</div>
        <div className='text2'>
          Here you can order additional services if you have difficulty creating your chat-bot or
          want to add specific functions necessary for your company.
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  show_service: state.show_service
});

export default connect(mapStateToProps)(Service);
