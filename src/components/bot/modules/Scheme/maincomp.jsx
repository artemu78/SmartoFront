import React from 'react';
import axios from 'axios';
import MainScreen from './mainscreen'
import scheme_style from '../../../../css/scheme.css';
const url = './data/scheme.php';
const utils = require('./../../../../utils');

const default_screen = [{
  _id: Date.now(),
  name: '',
  text: '',
  parent: 0,
  payload: '',
  media: null,
  buttons: []
}];

class MainComp extends React.Component {
  constructor (props) {
    super(props);
    default_screen.bot = this.props.bot.id;
    this.state = {
      loading: true
    };
    this.getScreensData = this.getScreensData.bind(this);
    this.add = this.add.bind(this);
    this.del = this.del.bind(this);
    this.data = [];
  }

  componentDidMount () {
    this.botId = this.props.bot.id;
    if (window.location.hostname !== 'localhost')
      this.getDataFromServer();
    else {
      let scheme = default_screen;
      this.data = scheme;
      this.setState({ data: scheme, loading: false, files: [], save: 'Save', disable: false });
    }
  }

  getDataFromServer () {
    const formData = new window.FormData();
    formData.append('b', this.props.bot.id);
    formData.append('l', utils.getCookie('l'));
    formData.append('oper', 'get');
    axios.post(url, formData)
      .then(response => {
        if (typeof (response.data) !== 'object' || typeof (response.data.length) !== 'number') {
          window.alert('error: json is not array');
          response.data = [];
        }
        let data = response.data;
        if (data.length === 0)
          data = default_screen;
        this.data = data;
        this.setState({ data, loading: false, files: [], save: 'Save', disable: false });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getScreensData () {
    return [this.data, this.botId];
  }

  del (id) {
    const data = this.data.filter((item) => {
      return item._id !== id && item.parent !== id;
    });
    this.data = data;
    this.setState({ data: this.data });
  }

  add (parent) {
    let obj = {
      _id: Date.now(),
      parent: parent,
      name: 'New screen',
      varname: '',
      text: '',
      screen_val: '',
      screen_var: ''
    };
    this.data.unshift(obj);
    this.setState({ data: this.data })
  }

  createList (data, parent) {
    const listItems = data.map((item, i) => {
      if (item.parent === parent) {
        let child_screens = null;
        let childs = data.filter((child) => child.parent === item._id);
        if (childs.length)
          child_screens = <ul>
            { this.createList(data, item._id) }
          </ul>

        return <li className={scheme_style.screen} key={item._id}>
          <a><MainScreen obj={item} store={this.data} add={this.add} del={this.del} bot={this.props.bot}/></a>
          {child_screens}
        </li>
      }
      return null;
    });
    return listItems;
  }

  mysort (a, b) {
    if (a._id > b._id)
      return -1;
    if (a._id < b._id)
      return 1;
    return 0;
  }

  render () {
    if (this.state.loading) return null;
    return (
      <ul className="tree" style={{ padding: '0px' }}>
        { this.createList(this.state.data.sort(this.mysort), 0) }
      </ul>
    );
  }
}

export default MainComp;
