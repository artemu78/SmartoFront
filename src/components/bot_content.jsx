import React, { Component } from 'react';
import BotmContent from './bot/main.jsx';
import BotmOptions from './bot/options.jsx';
import BotmModules from './bot/modules.jsx';
import Broadcast from './bot/Broadcast.jsx';
import Users from './bot/users.jsx';
import BotmStatistics from './bot/statistics.jsx';
import utils from '../utils.js';
import bot_style from 'css/bot_content.css';
import styles from './module_bot_content.scss';
import axios from 'axios';
import 'css/main.css';
const { connect } = require('react-redux');

class Bot_Content extends Component {
  constructor(props) {
    super(props);
    this.options = [
      { id: 'modules', name: 'Modules' },
      { id: 'options', name: 'Options' },
      { id: 'broadcast', name: 'Broadcast' },
      { id: 'users', name: 'Users' }
    ];

    let botname = this.props.bot ? this.props.bot.name : '';
    let logo = this.props.bot ? this.props.bot.logo : '';

    this.state = {
      botname: botname,
      option: 'modules',
      textName: false,
      logo
    };
    this.nameInputKeyPress = this.nameInputKeyPress.bind(this);
    this.nameInputBlur = this.nameInputBlur.bind(this);
    this.clickName = this.clickName.bind(this);
  }

  saveBot(bot) {
    let add = { l: utils.getCookie('l'), b: bot.id, o: 'sn' };
    let obj = Object.assign({}, this.state, add);
    let str = JSON.stringify(obj);
    utils.sendRequest(str, this.handleResponse, 'data/saveoptions.php');
    utils.saveSessionBot(bot);
  }

  handleResponse(response) {
    window.webix.message({
      text: 'Options saved',
      type: 'info',
      expire: 5000,
      id: 'message1'
    });
  }

  nameInputBlur(e) {
    this.setState({
      textName: false,
      botname: this.state.oldname
    });
  }

  nameInputKeyPress(e) {
    if (e.nativeEvent.type === 'input') this.setState({ botname: e.target.value });
    else {
      if (e.nativeEvent.keyCode === 27)
        this.setState({
          textName: false,
          botname: this.state.oldname
        });

      if (e.nativeEvent.keyCode === 13) {
        this.setState({
          textName: false
        });
        this.props.bot.name = this.state.botname;
        this.saveBot(this.props.bot);
      }
    }
  }

  clickName(e) {
    this.setState({
      textName: true,
      oldname: this.state.botname
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      botname: newProps.bot.name,
      logo: newProps.bot.logo
    });
  }

  componentDidUpdate() {
    if (this.inputNameRef) this.inputNameRef.focus();
    if (document.documentElement) document.documentElement.scrollTop = 0;
  }

  fileSelect = (event) => {
    const bot = this.props.bot;
    const fd = new FormData();
    const file = event.target.files[0];
    if (!file) return;

    // let add = { l: utils.getCookie('l'), b: bot.id, o: 'logo', file };
    // let str = JSON.stringify(add);
    // utils.sendRequest(str, this.handleResponse, 'data/saveoptions.php');

    fd.append('newlogo', file, file.name);
    fd.append('l', utils.getCookie('l'));
    fd.append('b', bot.id);

    axios.post('/data/logo_upload.php', fd).then((res) => {
      if (res && res.status === 200 && res.data && res.data.res === 'ok') {
        const { newfilename } = res.data;
        this.setState({ logo: newfilename });
        bot.logo = newfilename;
        utils.saveSessionBot(bot);
      }
    });
  };

  header() {
    let bot_logo_src = 'img/bots_logo/' + this.state.logo;
    let name_control;
    let input_style = {
      top: '8px',
      left: 'auto'
    };
    let photo_icon_class = `${styles.photo_icon} material-icons`;

    if (!this.state.textName)
      name_control = (
        <div
          className={styles.header_text}
          onClick={this.clickName}
          title='Change your bot name. It will affect site widget.'
        >
          <span>
            {this.state.botname}
            &nbsp;<span className='material-icons'>create</span>
          </span>
        </div>
      );
    else
      name_control = (
        <div className='text_input' style={input_style}>
          <input
            type='text'
            value={this.state.botname}
            onBlur={this.nameInputBlur}
            onChange={this.nameInputKeyPress}
            onKeyUp={this.nameInputKeyPress}
            style={{ width: '200px' }}
            ref={(ref) => {
              this.inputNameRef = ref;
            }}
          />
        </div>
      );
    let options_html = this.options.map((item, i) => {
      let cl = item.id === this.state.option ? 'selected' : 'selectable';
      let classes = bot_style.module + ' ' + cl;
      return (
        <div
          className={classes}
          key={i}
          onClick={() => {
            this.setState({ option: item.id });
          }}
        >
          {item.name}
        </div>
      );
    });

    let header = (
      <div className={styles.header}>
        <a
          href='#'
          className={styles.back}
          onClick={() => this.props.dispatch({ type: 'SHOW_MYBOTS' })}
        >
          ⇦
        </a>
        <div
          className={styles.bot_logo}
          title='Upload a new logo for your bot. It will affect site widget.'
          onClick={this.fileUpload}
        >
          <label htmlFor='image_logo_file_input'>
            <img className={styles.bot_logo_img} height='58' width='58' src={bot_logo_src} alt='' />
            <span className={photo_icon_class}>photo_camera</span>
          </label>
          <input
            id='image_logo_file_input'
            type='file'
            onChange={this.fileSelect}
            style={{ display: 'none' }}
          />
        </div>
        {name_control}
        <div className={bot_style.modules}>{options_html}</div>
      </div>
    );
    return header;
  }

  render() {
    if (!this.props.show_bot) return null;

    let bot = this.props.bot;
    let header = this.header();
    let content;
    switch (this.state.option) {
      case 'main':
        content = <BotmContent bot={bot} />;
        break;
      case 'options':
        content = <BotmOptions bot={bot} />;
        break;
      case 'modules':
        content = <BotmModules bot={bot} />;
        break;
      case 'statistics':
        content = <BotmStatistics bot={bot} />;
        break;
      case 'broadcast':
        content = <Broadcast bot={bot} />;
        break;
      case 'users':
        content = <Users bot={bot} />;
        break;
      default:
        content = null;
        break;
    }

    return (
      <div className='bot_container'>
        {header}
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  show_bot: state.show_bot,
  bot: state.bot,
  bot_id: state.bot_id
});

export default connect(mapStateToProps)(Bot_Content);
