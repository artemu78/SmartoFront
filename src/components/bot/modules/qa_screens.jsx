import React, { Component } from 'react';
const { connect } = require('react-redux');
const utils = require('./../../../utils.js');

class QAScreens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question1: 'question1',
      question2: 'question2',
      question3: 'question3',
      question4: 'question4',
      question5: 'question5',
      question6: 'question6',
      question7: 'question7',
      answer1: 'Фонарь, фонарик, карманный фонарик, ручной фонарик',
      answer2: 'Смартфон, фотик, фотоаппарат, телефон, камера, айфон',
      answer3: 'Полотенце, полотенец',
      answer4: 'Подушка',
      answer5:
        'Садовые ножницы, секатор, ножницы для сада, ножницы для цветов, ножницы для огорода, ножницы для дачи',
      answer6: 'answer1',
      answer7: 'answer1'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleResponseModule = this.handleResponseModule.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
      ComponentUpdate: false
    });
  }

  handleResponse(response) {
    let bot = this.props.bot;
    utils.saveSessionBot(bot);
    this.message('Module data saved');
  }

  message(text, type = 'info', id = 'message1') {
    window.webix.message({
      text,
      type,
      id,
      expire: 5000
    });
  }

  send() {
    let obj = {
      l: utils.getCookie('l'),
      b: this.props.bot.id,
      m: 11,
      o: 'savmod',
      data: {
        question1: this.state.question1,
        question2: this.state.question2,
        question3: this.state.question3,
        question4: this.state.question4,
        question5: this.state.question5,
        question6: this.state.question6,
        question7: this.state.question7,
        answer1: this.state.answer1,
        answer2: this.state.answer2,
        answer3: this.state.answer3,
        answer4: this.state.answer4,
        answer5: this.state.answer5,
        answer6: this.state.answer6,
        answer7: this.state.answer7
      }
    };
    let str = JSON.stringify(obj);
    utils.sendRequest(str, this.handleResponse, './data/saveoptions.php');
  }

  handleResponseModule(data) {
    let state_obj = {
      answer1: data.data.answer1,
      answer2: data.data.answer2,
      answer3: data.data.answer3,
      answer4: data.data.answer4,
      answer5: data.data.answer5,
      answer6: data.data.answer6,
      answer7: data.data.answer7,
      question1: data.data.question1,
      question2: data.data.question2,
      question3: data.data.question3,
      question4: data.data.question4,
      question5: data.data.question5,
      question6: data.data.question6,
      question7: data.data.question7
    };
    console.log(state_obj, 'state_obj');
    this.setState(state_obj);
  }

  getModuleData() {
    let add = {
      l: utils.getCookie('l'),
      b: this.props.bot.id,
      m: 11,
      o: 'gmod'
    };
    let obj = Object.assign({}, add);
    let str = JSON.stringify(obj);
    utils.sendRequest(str, this.handleResponseModule, './data/saveoptions.php');
  }

  componentDidMount() {
    this.getModuleData();
  }

  screenAsnwer(screenNumber) {
    let screenInputName = 'question' + screenNumber;
    let answerInputName = 'answer' + screenNumber;
    return (
      <React.Fragment>
        <div className='text_input'>
          Screen&nbsp;
          <input
            type='text'
            name={screenInputName}
            value={this.state[screenInputName]}
            onChange={this.handleChange}
          />
          &nbsp;
          <textarea
            name={answerInputName}
            value={this.state[answerInputName]}
            onChange={this.handleChange}
          />
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div>
          {this.screenAsnwer(1)}
          {this.screenAsnwer(2)}
          {this.screenAsnwer(3)}
          {this.screenAsnwer(4)}
          {this.screenAsnwer(5)}
        </div>
        <div
          className='button'
          onClick={() => {
            this.send();
          }}
        >
          Save
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  bot: state.bot
});

export default connect(mapStateToProps)(QAScreens);
