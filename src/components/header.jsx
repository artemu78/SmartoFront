import browserHistory from 'root/history';
const React = require('react');
const { connect } = require('react-redux');
require('./../css/header.css');
const pckg = require('./../../package.json');
// const logo = require('./../img/logo.png');

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: 'My bots'
    };
  }

  item_template(item, i) {
    let add = item.name === this.state.selected ? ' selected' : 'selectable';
    let css_class = 'item ' + add;
    let obj = (
      <div
        className={css_class}
        key={i}
        onClick={(e) => {
          browserHistory.push('/' + item.location);
          // this.props.dispatch({ type: item.action });
          this.setState({ selected: item.name });
        }}
      >
        {item.name}
      </div>
    );
    return obj;
  }

  user_item_template(item) {
    let add2 = this.state.selected === 'profile' ? ' selected' : 'selectable';
    let profile_class = 'user_logo ' + add2;
    let userpic = this.props.userpic ? (
      <img alt='' className='user_pic' src={this.props.userpic} />
    ) : null;

    return (
      <div
        className={profile_class}
        onClick={() => {
          browserHistory.push('/profile');
          this.setState({ selected: 'profile' });
          // this.props.dispatch({ type: 'SHOW_PROFILE' });
        }}
      >
        {userpic}
        <div alt='' className='user_name'>
          {item.name}
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.show_header) return null;

    // let first_item = 'All templates';
    const header_items = [
      { name: 'My bots', action: 'SHOW_MYBOTS', location: '' },
      // {name: 'Plan', action: 'SHOW_PLAN'},
      // {name: 'Service', action: 'SHOW_SERVICE'},
      { name: 'Support', action: 'SHOW_SUPPORT', location: 'support' }
    ];
    const user_item = {
      name: this.props.user_name,
      location: '/profile'
    };
    let header_items2 = header_items.map((header_item, i) => {
      return this.item_template(header_item, i);
    });
    // let add = (first_item === this.state.selected) ? ' selected' : 'selectable';
    // let first_item_class = 'all ' + add;

    return (
      <div className='header'>
        <a href='/'>
          <img alt='' src='img/logo.png' className='logo' title={pckg.version} />
        </a>

        <div className='items'>{header_items2}</div>
        {this.user_item_template(user_item)}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user_name: state.user_name,
  userpic: state.userpic,
  show_header: state.header
});
export default connect(mapStateToProps)(Header);
