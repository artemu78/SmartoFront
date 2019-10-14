import Button from 'components/common/button.jsx';
import TextInput from 'components/common/textinput.jsx';
import ReactPhoneInput from 'react-phone-input-2';
import { GoogleLogout } from 'react-google-login';
import 'react-phone-input-2/dist/style.css';
import './../css/profile.css';
const React = require('react');
const { connect } = require('react-redux');
const utils = require('./../utils.js');
const save_url = 'data/savecustomer.php';

class Profile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      user_name: this.props.user_name,
      user_email: this.props.user_email,
      user_phohe: this.props.user_phohe
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.send = this.send.bind(this);
    this.logout = this.logout.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  send () {
    let { dialCode, phone } = this.state;
    let data = { l: utils.getCookie('l'), dialCode, phone };
    let str = JSON.stringify(data);
    utils.sendRequest(str, this.handleResponse, save_url);
    let user_profile = { user_phohe: this.state.user_phohe };
    this.props.dispatch({ type: 'SET_USER_PROFILE', user_profile });
  }

  handleResponse (response) {
    window.webix.message({
      text: 'Profile data saved',
      type: 'info',
      expire: 5000,
      id: 'message1'
    });
  }

  onFailure (response) {
    console.log(response);
  }

  handleChange (value, data) {
    let dialCode = data.dialCode;
    let phone = value.replace(/[^0-9]+/g, '').slice(data.dialCode.length);
    this.setState({ user_phohe: value, phone, dialCode });
  }

  responseGoogle (response) {
    if (response && response.profileObj) {
      this.setState({
        user_logo: response.profileObj.imageUrl,
        user_name: response.profileObj.name,
        user_email: response.profileObj.email
      });
      let action = {
        type: 'SHOW_HEADER',
        userpic: response.profileObj.imageUrl,
        user_name: response.profileObj.name
      };
      this.props.dispatch(action);
    }
  }

  failResponseGoodle (response) {
    // this.responseGoogle(this.fake_response);
  }

  logout () {
    utils.deleteCookie('s');
    utils.deleteCookie('l');
    utils.deleteCookie('st');
    window.location.reload();
  }

  deleteAccount () {
    window.webix.message({
      text: 'Not implemented yet, sorry.',
      type: 'error',
      expire: 10000,
      id: 'message1'
    })
  }

  render () {
    if (!this.props.show_profile)
      return null;
    let inputStyle = {
      border: '2px solid #E2E4FA',
      height: '42px',
      borderRadius: '2px',
      width: '100%'
    };
    let containerStyle = {
      width: '372px',
      height: '42px',
      marginTop: '4px',
      marginBottom: '20px'
    };
    let goo_log_style = {
      background: 'transparent'
    };
    return (
      <div className='profile'>
        <div className='title'>Profile</div>
        <div className='descr'>Here you can edit your data and replace the password.</div>
        <TextInput text='Your name' value={this.state.user_name} readOnly />
        <TextInput text='Your email' value={this.state.user_email} readOnly />
        <div className='input_descr'>Phone</div>
        <ReactPhoneInput defaultCountry={'ru'} value={this.state.user_phohe} onChange={this.handleChange} containerStyle={containerStyle} inputStyle={ inputStyle } />
        <Button text='Save' onClick={this.send} />
        <br/><br/>
        <GoogleLogout
          clientId="548560152629-c5n96slggeh0uenm3fm1vc6d3ghdo9mi.apps.googleusercontent.com"
          buttonText="Logout"
          tag="div"
          style={goo_log_style}
          onLogoutSuccess={this.logout}
          onFailure={this.onFailure}
        >
        </GoogleLogout>
      </div>
    );
  }
};

const mapStateToProps = state => ({
  show_profile: state.show_profile,
  user_name: state.user_name,
  user_email: state.user_email,
  user_phohe: state.user_phohe
});

export default connect(
  mapStateToProps
)(Profile);
