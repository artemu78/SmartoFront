import React, { Component } from 'react';
import styles from './../css/mybots.css';

const my_bots = require('root/test_data/test_bots');
const bots_url = 'data/bots.php';
const { connect } = require('react-redux');
const utils = require('./../utils.js');

class MyBots extends Component {
  constructor() {
    super();
    let bots = [];
    this.state = { bots: bots };
    this.display_bots = this.display_bots.bind(this);
  }

  componentDidMount() {
    let login = utils.getCookie('l');
    let bots_str = window.sessionStorage.getItem('bots');
    let request_obj = { l: login };
    if (login && !bots_str)
      utils.sendRequest(JSON.stringify(request_obj), this.display_bots, bots_url);
    if (bots_str) {
      let bots = JSON.parse(bots_str);
      this.display_bots({ bots: bots });
    }

    if (window.location.port === '3000') this.display_bots(my_bots);
  }

  social_icons(item) {
    let ret = [];
    if (item.viber) ret.push('viber');
    if (item.vkontakte) ret.push('vk');
    if (item.facebook) ret.push('fb');
    if (item.telegram) ret.push('tm');
    return ret;
  }

  display_bots(response) {
    let bots = response.bots.map((item, i) => {
      return {
        _id: i,
        name: item.name,
        logo: item.logo,
        users: item.users_count,
        w_active: '',
        social: this.social_icons(item),
        id: item.id,
        vkontakte: item.vkontakte,
        facebook: item.facebook,
        viber: item.viber,
        telegram: item.telegram,
        data: item.data,
        modules: item.modules,
        tg_data: item.tg_data,
        chtfl: item.chatfuel,
        chtfl_id: item.chatfuelid,
        dlgfl: item.dialogflow,
        dlgfl_id: item.dialogflowid,
        create_dt: item.create_dt,
        template: item.template,
        owners: item.owners,
        widget: item.widget,
        password: item.password
      };
    });
    // window.localStorage.setItem('bots', JSON.stringify(bots));
    this.setState({ bots });
    window.sessionStorage.setItem('bots', JSON.stringify(bots));
    if (response.modules)
      window.sessionStorage.setItem('modules', JSON.stringify(response.modules));
  }

  bot_click(item) {
    this.props.dispatch({ type: 'SHOW_BOT', bot: item });
  }

  render() {
    if (!this.props.show_mybots) return null;

    let bot_divs = this.state.bots.map((item, i) => {
      return this.bot_template(item, i);
    });
    return <div className='bots_container'>{bot_divs}</div>;
  }

  bot_template(item, i) {
    let logo = 'img/bots_logo/' + item.logo;
    let icons = item.social.map((soci_item, i) => {
      let icon = `img/social/35x35/${soci_item}.png`;
      return <img src={icon} key={i} alt='social' />;
    });
    return (
      <div className='bot_box' key={i} onClick={(e) => this.bot_click(item)}>
        <div className={styles.logo}>
          <img src={logo} alt={item.name} />
        </div>
        <div className='date'>{item.create_dt}</div>
        <div className='name'>{item.name}</div>
        <div className='template'>{item.template}</div>
        <div className='settings'>
          <img src='img/settings.png' alt='Bot settings' />
        </div>
        <div className='social'>Social:</div>
        <div className='icons'>{icons}</div>
        <div className='users'>Users:</div>
        <div className='users_val'>{item.users}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  show_mybots: state.show_mybots
});

export default connect(mapStateToProps)(MyBots);
