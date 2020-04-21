import React from 'react';
import axios from 'axios';
import MainScreen from './mainscreen';
import scheme_style from 'root/css/scheme.css';
import test_scheme from 'root/test_data/test_scheme';
const { connect } = require('react-redux');
const url = './data/scheme.php';
const utils = require('root/utils');

const default_screen = [
  {
    _id: Date.now(),
    name: 'First screen',
    text: '',
    parent: 0,
    payload: '',
    media: null,
    main: true,
    buttons: []
  }
];

class MainComp extends React.Component {
  constructor(props) {
    super(props);
    default_screen.bot = this.props.bot.id;
    this.state = {
      loading: true
    };
    this.addScreen = this.addScreen.bind(this);
    this.deleteScreen = this.deleteScreen.bind(this);
    this.setMainScreen = this.setMainScreen.bind(this);
    this.data = [];
  }

  componentDidMount() {
    this.botId = this.props.bot.id;
    if (window.location.hostname !== 'localhost') this.getDataFromServer();
    else {
      let scheme = test_scheme;
      this.data = scheme;
      const action_data = { type: 'SET_BOT_SCHEME', bot: this.botId, scheme };
      this.props.dispatch(action_data);
      this.setState({ data: scheme, loading: false, files: [], save: 'Save', disable: false });
    }
  }

  getDataFromServer() {
    const formData = new window.FormData();
    const bot_id = this.props.bot.id;
    formData.append('b', bot_id);
    formData.append('l', utils.getCookie('l'));
    formData.append('oper', 'get');
    axios
      .post(url, formData)
      .then((response) => {
        if (typeof response.data !== 'object' || typeof response.data.length !== 'number') {
          window.alert('error: json is not array');
          response.data = [];
        }
        let data = response.data;
        if (data.length === 0) data = default_screen;
        this.data = data;
        const action_data = { type: 'SET_BOT_SCHEME', bot: bot_id, scheme: data };
        this.props.dispatch(action_data);
        this.setState({ data, loading: false, files: [], save: 'Save', disable: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setMainScreen(screenId, setChecked) {
    const { data } = this.state;
    let yesRemoveMain = true;
    let atLeastOneScreenIsMain = false;
    const screensList = data.map((item) => {
      const setScreenMain = item._id === screenId && setChecked;
      item.main = setScreenMain;
      atLeastOneScreenIsMain = atLeastOneScreenIsMain || setScreenMain;
      return item;
    });
    if (!atLeastOneScreenIsMain)
      yesRemoveMain = window.confirm(
        'No screen set as first. Bot will be in silent mode. Are you sure?'
      );
    if (!yesRemoveMain) return;
    this.data = screensList;
    this.setState({ data: this.data });
  }

  deleteScreen(screen_obj) {
    let id = screen_obj._id;
    if (!window.confirm(`delete screen ${screen_obj.name}?`)) return;
    const data = this.data.filter((item) => {
      return item._id !== id && item.parent !== id;
    });
    this.data = data;
    this.setState({ data: this.data });
  }

  addScreen(parent_screen) {
    let obj = {
      _id: Date.now(),
      parent: parent_screen._id,
      name: 'New screen ' + this.data.length.toString(),
      varname: '',
      text: '',
      screen_val: '',
      screen_var: ''
    };

    this.data.forEach((element) => {
      if (element._id === parent_screen._id) element.name = 'yes parent';
    });
    this.data.unshift(obj);
    this.setState({ data: this.data });
  }

  createList(data, parent) {
    const listItems = data.map((item, i) => {
      if (item.parent === parent) {
        let child_screens = null;
        let childs = data.filter((child) => child.parent === item._id);
        if (childs.length) child_screens = <ul>{this.createList(data, item._id)}</ul>;
        return (
          <li className={scheme_style.screen} key={item._id}>
            <a>
              <MainScreen
                dispatch={this.props.dispatch}
                obj={item}
                store={this.data}
                addScreen={this.addScreen}
                deleteScreen={this.deleteScreen}
                bot={this.props.bot}
                setMainScreen={this.setMainScreen}
              />
            </a>
            {child_screens}
          </li>
        );
      }
      return null;
    });
    return listItems;
  }

  mysort(a, b) {
    if (a._id > b._id) return -1;
    if (a._id < b._id) return 1;
    return 0;
  }

  render() {
    if (this.state.loading) return null;
    return (
      <ul className='tree' style={{ padding: '0px' }}>
        {this.createList(this.state.data.sort(this.mysort), 0)}
      </ul>
    );
  }
}

export default connect()(MainComp);
