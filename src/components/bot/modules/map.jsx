import React, { Component } from 'react';
import Mymap from './gmap.jsx';
import Error from './../../errorboundary.jsx';
const { connect } = require('react-redux');
const utils = require('./../../../utils.js');

class MapModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: '',
      showmap: true,
      c_name: '',
      c_phone: '',
      c_site: '',
      c_about: '',
      map: {
        markers: [
          {
            lat: 55.7,
            lng: 37.7
          }
        ]
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleResponseModule = this.handleResponseModule.bind(this);
    this.handleShowMapCheckbox = this.handleShowMapCheckbox.bind(this);
    this.map = { marker: {} };
  }

  send() {
    let marker_pos = JSON.parse(window.sessionStorage.getItem('gmap_marker'));
    let add = {
      l: utils.getCookie('l'),
      b: this.props.bot.id,
      m: 1,
      o: 'savmod',
      data: {
        markers: [marker_pos],
        showmap: this.state.showmap,
        c_name: this.state.c_name,
        c_about: this.state.c_about,
        c_phone: this.state.c_phone,
        c_site: this.state.c_site
      }
    };
    let str = JSON.stringify(add);
    utils.sendRequest(str, this.handleResponse, './data/saveoptions.php');
  }

  message(text, type = 'info', id = 'message1') {
    window.webix.message({
      text,
      type,
      id,
      expire: 5000
    });
  }

  handleResponse(response) {
    let bot = this.props.bot;
    utils.saveSessionBot(bot);
    this.message('Module data saved');
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

  handleShowMapCheckbox(event) {
    this.setState({
      showmap: !this.state.showmap,
      ComponentUpdate: true
    });
  }

  componentDidMount() {
    this.getModuleData();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log(position.coords.latitude, 'position.co;ords');
        let state_position = { lat: position.coords.latitude, lng: position.coords.longitude };
        this.setState({
          map: { markers: [state_position] }
        });
      },
      (error) => window.alert(error)
    );
  }

  handleResponseModule(data) {
    let state_obj = {
      c_name: data.data.c_name,
      c_about: data.data.c_about,
      c_phone: data.data.c_phone,
      c_site: data.data.c_site,
      ComponentUpdate: true
    };
    if (
      data.data.markers &&
      Array.isArray(data.data.markers) &&
      data.data.markers.length > 0 &&
      data.data.markers[0]
    )
      state_obj.map = {
        markers: [
          {
            lat: data.data.markers[0].lat,
            lng: data.data.markers[0].lng
          }
        ]
      };
    console.log(state_obj, 'state_obj');
    this.setState(state_obj);
  }

  getModuleData() {
    let add = {
      l: utils.getCookie('l'),
      b: this.props.bot.id,
      m: 1,
      o: 'gmod'
    };
    let obj = Object.assign({}, add);
    let str = JSON.stringify(obj);
    utils.sendRequest(str, this.handleResponseModule, './data/saveoptions.php');
  }

  render() {
    let marker_coords = {
      lat: this.state.map.markers[0].lat,
      lng: this.state.map.markers[0].lng
    };

    let map = null;
    let showmap_checked = false;
    if (this.state.showmap) {
      showmap_checked = true;
      map = (
        <div className='text_input'>
          Company location
          <Mymap marker_coords={marker_coords} />
        </div>
      );
    }

    return (
      <div>
        <div className='text_input'>
          Company name
          <br />
          <input type='text' name='c_name' value={this.state.c_name} onChange={this.handleChange} />
        </div>
        <div className='text_input'>
          About company
          <br />
          <textarea
            name='c_about'
            value={this.state.c_about}
            rows='3'
            onChange={this.handleChange}
          ></textarea>
        </div>
        <div className='text_input'>
          Phone number
          <br />
          <input
            type='text'
            name='c_phone'
            value={this.state.c_phone}
            onChange={this.handleChange}
          />
        </div>
        <div className='text_input'>
          Site
          <br />
          <input type='text' name='c_site' value={this.state.c_site} onChange={this.handleChange} />
        </div>
        <div>
          <label>
            <input
              type='checkbox'
              onChange={this.handleShowMapCheckbox}
              checked={showmap_checked}
            />{' '}
            Show map
          </label>
        </div>
        <Error>{map}</Error>
        <div
          className='button'
          onClick={() => {
            this.send();
          }}
        >
          Save
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  show_mybots: state.show_mybots,
  bot: state.bot
});

export default connect(mapStateToProps)(MapModule);
