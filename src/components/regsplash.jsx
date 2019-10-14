import React, { Component } from 'react';
import './../css/regsplash.css';
const { connect } = require('react-redux');
const { GoogleLogin } = require('react-google-login');
const utils = require('./../utils.js');

class Content extends Component {
  constructor () {
    super();
    this.state = {
      checkbox_style: null,
      GoogleLoginDisabled: true,
      google_bg: '#DFDFDF'
    }
  }

  responseGoogle (response) {
    if (response && response.profileObj)
      saveUser(response.profileObj, this);
  }

  failResponseGoogle (response) {
    this.responseGoogle(this.fake_response);
  }

  login_html (component_obj) {
    let uxMode = getQueryVariable('uxMode') || 'popup';
    let autoLoad = getQueryVariable('autoLoad') || false;
    let goo_log_style = {
      position: 'absolute',
      width: '224px',
      height: '40px',
      left: '18px',
      top: '67px',
      background: this.state.google_bg,
      borderRadius: '4px'
    };

    let login = <div className="login_box">
      <div className="templaterobot_logo" />
      <div className="logDiv">
        <div className='google_logo'/>
        <div className='sign_descr'>Sign in with Google account to create your first bot.</div>
        <GoogleLogin
          className='send_btn'
          disabled={this.state.GoogleLoginDisabled}
          autoLoad={autoLoad}
          style={goo_log_style}
          clientId="548560152629-c5n96slggeh0uenm3fm1vc6d3ghdo9mi.apps.googleusercontent.com"
          onSuccess={this.responseGoogle}
          onFailure={this.failResponseGoogle}
          buttonText ='Sign in With Google'
          isSignedIn='false'
          uxMode={uxMode}>
        </GoogleLogin>
        <div className='checkbox' style={this.state.checkbox_style} onClick={() => {
          let new_state;
          if (!this.allow) {
            this.allow = true;

            new_state = {
              checkbox_style: { backgroundColor: '#7EC228',
                backgroundRepeatX: 'no-repeat',
                backgroundRepeatY: 'no-repeat',
                backgroundPositionY: 'center',
                backgroundPositionX: 'center',
                backgroundRepeat: 'no_repeat',
                backgroundImage: 'url(../img/ok_sign.png)' },
              google_bg: '#408CD2',
              GoogleLoginDisabled: false
            };
          } else {
            this.allow = false;
            new_state = {
              checkbox_style: { background: '#DFDFDF' },
              google_bg: '#DFDFDF',
              GoogleLoginDisabled: true
            };
          }
          this.setState(new_state);
        }}/>
        <div className='agree'>I agree to Smartoboto<br/>
          <a href="https://smartoboto.co/policy" target="_blank">Privacy policy</a></div>
      </div>
      <div className='need_permission'>We need permissions to create your account on the system.</div>
    </div>;
    return login;
  }

  render () {
    if (!this.props.show_regsplash)
      return null;
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';

    let login = this.login_html(this);
    let success = getQueryVariable('success');

    let content = null;
    if (success === '' || utils.getCookie('st') === 'p') {
      let profileObj = { l: utils.getCookie('l'), state: 'p' };
      if (success === '')
        saveUser(profileObj, this);
      content = <div>
        <div className='onestep'>Payment <span>was</span> successfull</div>
        <div className='ok_img'/>
        <div className="description" style={{ top: 373 }}>Done! Now you are in our community! We will certainly notify you about opening access to the platform. Now you can connect your Google account for easy access. You can also subscribe to our facebook community</div>
      </div>;
    } else
      content = <div>
        <div className="onestep">One Step Away From Winning!</div>
        <div className="description">You are on the waiting list. Now we are completing the necessary work to give you access to the control panel as possible.
                    Subscribe to our community</div>
        <div style={{ position: 'absolute', top: '440px', left: 'calc(50% - 60px)', width: '120px' }}>
          <a href="https://www.facebook.com/templaterobot/" target="_blank" style={{ float: 'right' }} rel="noopener noreferrer">
            <img src="./img/social/fb_48.png" border="0"/>
          </a>
          <a href="https://vk.com/templaterobot" target="_blank" rel="noopener noreferrer">
            <img src="./img/social/vk_48.png" border="0"/>
          </a>
        </div>
      </div>;

    let pay = <div className="splashroot">
      <a href="https://templaterobot.co" target="_blank" rel="noopener noreferrer"><div className="logo"></div></a>
      {content}
    </div>;

    if (this.props.show_payment)
      return pay;
    return login;
  }
};

const mapStateToProps = state => ({
  show_regsplash: state.show_regsplash,
  show_payment: state.show_payment
});

export default connect(
  mapStateToProps
)(Content);

function getQueryVariable (search_variable) {
  let query = window.location.search.substring(1);

  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    if (pair[0] === search_variable)
      return pair[1] || '';
  };
  return null;
}

function saveUser (profileObj, component_obj) {
  var xhr = new window.XMLHttpRequest();
  var FD = new window.FormData();
  // console.log(profileObj, 'profileObj');
  for (let name in profileObj)
    FD.append(name, profileObj[name]);

  let url = 'saveuser.php';
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  //    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    let response_obj = JSON.parse(xhr.responseText);
    if (xhr.status === 200 && response_obj.res !== 'ok')
      window.alert('Something went wrong.  ' + response_obj.error);

    else if (xhr.status !== 200)
      window.alert('Request failed.  Returned status of ' + xhr.status);

    else {
      utils.setCookie('l', response_obj.login, 365);
      utils.setCookie('s', response_obj.state, 365);
      utils.setCookie('st', 'g', 365);
      window.location.reload();
      // if (response_obj.pay != '1')
      //    component_obj.props.dispatch({ type: 'SHOW_REGSPLASH' });
    }
  };
  xhr.send(JSON.stringify(profileObj));
  // return true;
  // component_obj.props.dispatch({ type: 'SHOW_REGSPLASH' });
}
