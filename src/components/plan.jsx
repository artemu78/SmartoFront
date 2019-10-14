import React, { Component } from 'react';
import './../css/plan.css';
const { connect } = require('react-redux');

class Plan extends Component {
  constructor () {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (event) {
    this.setState({ value: event.target.value });
  }

  render () {
    if (!this.props.show_plan)
      return null;

    return (
      <div className="plan">
        <div className="text1">Setting up a subscription</div>
        <div className="text2">By changing the subscription terms, you can adjust the amount of the monthly payment. Choosing the optimal number of chat bots, modules and traffic packets.</div>
      </div>
    );
  }
};

const mapStateToProps = state => ({
  show_plan: state.show_plan
});

export default connect(
  mapStateToProps
)(Plan);
