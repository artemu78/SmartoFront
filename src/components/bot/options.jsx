import React, { Component } from 'react';
import Button from 'components/common/button.jsx';
import TextInput from 'components/common/textinput.jsx';
const utils = require('./../../utils.js');
const save_url = 'data/saveoptions.php';

class BotOptions extends Component {
  constructor (props) {
    super(props);
    const widget_code = `<script type='text/javascript' src='https://smartobotobots.ru/js/chatbox.min.js' token='${this.props.bot.widget}' id='smartobotobots_CHB'></script>`;
    this.state = {
      tg: this.props.bot.telegram || '',
      fb: this.props.bot.facebook || '',
      dlgfl: this.props.bot.dlgfl || '',
      dlgfl_id: this.props.bot.dlgfl_id || '',
      vbr: this.props.bot.viber || '',
      chtfl: this.props.bot.chtfl || '',
      chtfl_id: this.props.bot.chtfl_id || '',
      vk_group: this.props.bot.vkontakte || '',
      bitrix: this.props.bot.data ? this.props.bot.data.bitrix : '',
      vk_token: this.props.bot.data ? this.props.bot.data.vk_token : '',
      vk_secret: this.props.bot.data ? this.props.bot.data.vk_secret : '',
      vk_confirm: this.props.bot.data ? this.props.bot.data.vk_confirm : '',
      chatbase: this.props.bot.data ? this.props.bot.data.chatbase : '',
      owners: this.props.bot.owners ? this.props.bot.owners.replace(/,/g, '\n') : '',
      widget: this.props.bot.widget || '',
      widget_code,
      password: this.props.bot.password
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleResponseInfo = this.handleResponseInfo.bind(this);
    this.send = this.send.bind(this);
    this.copyWidgetCode = this.copyWidgetCode.bind(this);
    this.widgetCodeRef = React.createRef();
  }

  copyWidgetCode () {
    this.widgetCodeRef.current.select();
    window.document.execCommand('copy');
    window.getSelection().removeAllRanges();
    window.webix.message({
      text: 'Widget code has been copied in clipboard',
      type: 'info',
      expire: 5000,
      id: 'message1'
    });
  }

  setWebHook () {
    let add = { l: utils.getCookie('l'), b: this.props.bot.id, o: 'swh' };
    let obj = Object.assign({}, this.state, add);
    utils.sendRequest(obj, this.handleResponse, save_url);
  }

  removeWebHook () {
    let add = { l: utils.getCookie('l'), b: this.props.bot.id, o: 'rwh' };
    let obj = Object.assign({}, this.state, add);
    utils.sendRequest(obj, this.handleResponse, save_url);
  }

  infoWebHook () {
    let add = { l: utils.getCookie('l'), b: this.props.bot.id, o: 'iwh' };
    let obj = Object.assign({}, this.state, add);
    utils.sendRequest(obj, this.handleResponseInfo, save_url);
  }

  send () {
    let add = { l: utils.getCookie('l'), b: this.props.bot.id, o: 's' };
    let obj = Object.assign({}, this.state, add);
    obj.owners = this.state.owners.replace(/\n/g, ',');
    let str = JSON.stringify(obj);
    utils.sendRequest(str, this.handleResponse, save_url);
    let bot = this.props.bot;
    bot.telegram = this.state.tg;
    bot.chatfuel = this.state.chtfl;
    bot.facebook = this.state.fb;
    bot.viber = this.state.vbr;
    bot.vkontakte = this.state.vk_group;
    bot.dlgfl = this.state.dlgfl;
    bot.dlgfl_id = this.state.dlgfl_id;
    bot.chtfl = this.state.chtfl;
    bot.chtfl_id = this.state.chtfl_id;
    bot.data = {};
    bot.data.bitrix = this.state.bitrix;
    bot.data.vk_token = this.state.vk_token;
    bot.data.vk_secret = this.state.vk_secret;
    bot.data.vk_confirm = this.state.vk_confirm;
    bot.data.chatbase = this.state.chatbase;
    bot.owners = this.state.owners.replace(/\n/g, ',');
    utils.saveSessionBot(bot);
  }

  handleResponseInfo (response) {
    var infoText = 'pending_update_count=' + response.getWebhookInfo.pending_update_count +
            '\nlast_error_date=' + response.getWebhookInfo.last_error_date +
            '\nlast_error_message=' + response.getWebhookInfo.last_error_message +
            '\nfirst_name=' + response.getme.first_name +
            '\nid=' + response.getme.id +
            '\nusername=' + response.getme.username;

    window.webix.message({
      text: infoText,
      type: 'info',
      expire: 5000,
      id: 'message1'
    });
  }

  handleResponse (response) {
    window.webix.message({
      text: 'Options saved',
      type: 'info',
      expire: 5000,
      id: 'message1'
    });
  }

  handleChange (event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  openVKAuth () {
    window.open('https://oauth.vk.com/authorize?client_id=7134236&display=page&redirect_uri=https://smartobotobots.ru/vk_callback/&scope=groups&response_type=code&state=usr__' + this.props.bot.id, 'Smartoboto Vkontakte settings', 'menubar=0,toolbar=0,status=0,location=0,centerscreen=1');
    window.webix.message({
      text: 'Reload page to see new settings',
      type: 'info',
      expire: -1,
      id: 'message1'
    });
  }

  render () {
    let vk_style = { 'paddingLeft': '15px' };
    let tg_link = null;
    let tg_username = null;
    let vk_link = null;
    let vk_name = null;
    let chbs_link = null;
    let chbs_username = null;

    if (this.props.bot && this.props.bot.tg_data && this.props.bot.tg_data.result) {
      tg_link = `https://t.me/${this.props.bot.tg_data.result.username}`;
      tg_username = '@' + this.props.bot.tg_data.result.username;
    }

    if (this.state.vk_group) {
      vk_link = `https://vk.com/public${this.state.vk_group}`;
      vk_name = `vk.com/public${this.state.vk_group}`;
    }

    if (this.state.chatbase) {
      chbs_link = `https://chatbase.com/overview?botKey=${this.state.chatbase}`;
      chbs_username = 'chatbase.com';
    }

    return (
      <div className="bot_options">
        <div className="chapter_header">Social networks and messengers</div>
        <div className="text_input">
                    Token Telegram <a href={tg_link} target="_blank" rel="noopener noreferrer">{tg_username}</a><br/>
          <input type="text" name="tg" value={this.state.tg} onChange={this.handleChange}/>
          <i title="Set webhook" className="material-icons optionsButton" onClick={() => { this.setWebHook() }}>send</i>
          <i title="Remove webhook" className="material-icons optionsButton" onClick={() => { this.removeWebHook() }}>remove_circle_outline</i>
          <i title="Info" className="material-icons optionsButton" onClick={() => { this.infoWebHook() }}>info_outline</i>
        </div>
        <TextInput onChange={this.handleChange} name="fb" value={this.state.fb} text='Token Facebook Messenger'/>
        <TextInput text='Token Viber'name="vbr" value={this.state.vbr} onChange={this.handleChange}/>
        <TextInput text='Bitrix webhook' name="bitrix" value={this.state.bitrix} onChange={this.handleChange} placeholder="https://mydomen.bitrix24.ru/rest/9/mybithashstring/"/>
        <TextInput text='Chatbase' name="chatbase" value={this.state.chatbase} onChange={this.handleChange}>
          <a href={chbs_link} target="_blank" rel="noopener noreferrer">{chbs_username}</a>
        </TextInput>

        <div className="text_input">Site widget
          <div style={vk_style}><br/>
            <span>Insert this code on your site</span>
            <span style={{ marginLeft: '60px', cursor: 'pointer' }} onClick={this.copyWidgetCode}>copy to clipboard<i title="copy to clipboard" className="material-icons optionsButton" style={{ fontSize: 'large' }}>file_copy</i></span>
            <br/>
            {/* <TextInput text='Token' name="widget_token" value={this.state.widget} readOnly /> */}
            <textarea ref={this.widgetCodeRef} name="owners" value={this.state.widget_code} rows="5" readOnly/>
            <TextInput text='Password' name="password" value={this.state.password} readOnly/>
          </div>
        </div>

        <div className="text_input">Dialogflow</div>
        <div style={vk_style}>
          <TextInput text='Token' name="dlgfl" value={this.state.dlgfl} onChange={this.handleChange} />
          <TextInput text='project id' name="dlgfl_id" value={this.state.dlgfl_id} onChange={this.handleChange} />
        </div>

        <div className="text_input">Chatfuel</div>
        <div style={vk_style}>
          <TextInput text='Token' name="chtfl" value={this.state.chtfl} onChange={this.handleChange} />
          <TextInput text='Id' name="chtfl_id" value={this.state.chtfl_id} onChange={this.handleChange} />
        </div>
        <div className="text_input">VKontakte&nbsp;
          <a href='#' onClick={() => { this.openVKAuth() }}>connect bot&nbsp;
            <i title="Set group" className="material-icons optionsButton" style={{ fontSize: 'large' }}>open_in_new</i>
          </a>
        </div>
        <div style={vk_style}>
          <TextInput text='Group id' name="vk_group" value={this.state.vk_group} onChange={this.handleChange}>
            <a href={vk_link} target="_blank" rel="noopener noreferrer">{vk_name}</a>
          </TextInput>
          <TextInput text='Token' name="vk_token" value={this.state.vk_token} onChange={this.handleChange}/>
          <TextInput text='Secret' name="vk_secret" value={this.state.vk_secret} onChange={this.handleChange}/>
          <TextInput text='Confirm' name="vk_confirm" value={this.state.vk_confirm} onChange={this.handleChange}/>
        </div>
        <div className="text_input">
            Owners<br/>
          <textarea name="owners" value={this.state.owners} onChange={this.handleChange} rows="5"/>
        </div>
        <Button text='Save' onClick={this.send} />
      </div>);
  }
}

export default BotOptions;
