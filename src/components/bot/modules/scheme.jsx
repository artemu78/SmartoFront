import React from 'react';
import { post } from 'axios';
import MainComp from './Scheme/maincomp';
import scheme_style from 'root/css/scheme.css';
const { connect } = require('react-redux');
const utils = require('root/utils');
const url = './data/scheme.php';

class DivSRef extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disable: false,
      save: 'Save',
      bot_screens_big: true
    };
    this.saveBtnClick = this.saveBtnClick.bind(this);
    this.botScreenSize = this.botScreenSize.bind(this);
    this.tryScheme = this.tryScheme.bind(this);
  }

  componentDidMount() {
    this.myRef = this.refs.cont;
  }

  tryScheme() {
    window.open('testchat.php?token=' + this.props.bot.widget);
  }

  saveBtnClick() {
    const bot_id = this.props.bot.id;
    let dataSave = this.props.schemes[bot_id];
    this.setState({ disable: true });
    let config = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000
    };

    let formData = new window.FormData();
    formData.append('oper', 'screens');
    formData.append('b', bot_id);
    formData.append('l', utils.getCookie('l'));
    formData.append('screens', JSON.stringify(dataSave));
    this.setState({ save: 'Save in process ...' });
    this.sendSchemeData(formData, config);
  }

  sendSchemeData(formData, config) {
    post(url, formData, config)
      .then((response) => {
        this.setState({ save: 'Saved successful' }, () => {
          setTimeout(() => {
            this.setState({ save: 'Save', disable: false });
          }, 500);
        });
      })
      .catch((error) => {
        this.setState({ save: 'Save' });
        window.alert(error);
      });
  }

  goUp(e) {
    this.myRef.scrollLeft = this.myRef.scrollLeft + 100;
    e.preventDefault();
  }
  goDown(e) {
    this.myRef.scrollLeft = this.myRef.scrollLeft - 100;
    e.preventDefault();
  }
  wheel(e) {
    e.deltaY < 0 ? this.goDown(e) : this.goUp(e);
    e.preventDefault();
  }

  botScreenSize() {
    this.setState({ bot_screens_big: !this.state.bot_screens_big });
  }

  render() {
    let screen_size_button = this.state.bot_screens_big ? 'fullscreen_exit' : 'fullscreen';
    let screen_size_button_title = this.state.bot_screens_big
      ? 'Minimize scheme screens'
      : 'Enlarge scheme screens';
    let save_button = [scheme_style.done_screen_files, scheme_style.fixed].join(' ');
    let screen_size_button_class = [scheme_style.bot_screens_button, 'material-icons'].join(' ');
    let bot_screens_class = this.state.bot_screens_big ? 'bot_screens_big' : 'bot_screens_small';
    return (
      <React.Fragment>
        <div
          className='panel'
          style={{ backgroundImage: "url('./img/templates/mouse.svg')" }}
          onWheel={this.wheel.bind(this)}
          ref={(input) => {
            this.textInput = input;
          }}
        >
          <button
            title={screen_size_button_title}
            className={screen_size_button_class}
            onClick={this.botScreenSize}
          >
            {screen_size_button}
          </button>
          <button
            title='Test scheme in new window'
            className={screen_size_button_class}
            onClick={this.tryScheme}
          >
            open_in_new
          </button>
          <button
            title='Save scheme'
            className={save_button}
            onClick={this.saveBtnClick}
            disabled={this.state.disable}
          >
            {this.state.save}
          </button>
        </div>
        <div
          id='scroller-parent'
          ref='cont'
          style={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
            position: 'relative'
          }}
        >
          <div id='area' className={bot_screens_class}>
            <MainComp bot={this.props.bot} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  show_mybots: state.show_mybots,
  bot: state.bot,
  schemes: state.schemes
});

export default connect(mapStateToProps)(DivSRef);
