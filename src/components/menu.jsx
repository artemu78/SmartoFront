import React, { Component } from 'react';
import css from './../css/menu.css';
const { connect } = require('react-redux');

class Menu extends Component {
  constructor() {
    super();
    this.state = {
      selected: 'Real estate'
    };
  }

  item_template(item, key = 0) {
    let add = item.name === this.state.selected ? css.menu_item_selected : '';
    let css_class = [css.menu_item, add].join(' ');
    return (
      <div
        key={key}
        className={css_class}
        onClick={(e) => {
          this.setState({ selected: item.name });
        }}
      >
        <div className={css.menu_item_text}>{item.name}</div>
      </div>
    );
  }

  render() {
    if (!this.props.show_menu) return null;

    let menu_items = [
      'E-commerce',
      'Real estate',
      'Personal service',
      'Finance',
      'Telecom',
      'Travel',
      'Media',
      'Lawyer',
      'Education',
      'Entertainment',
      'Personal assistant',
      'Online services',
      'Corporate assistant'
    ].map((name, i) => {
      return this.item_template({ name: name }, i);
    });

    return <div className={css.menu}>{menu_items}</div>;
  }
}

const mapStateToProps = (state) => ({
  show_menu: state.show_menu
});

export default connect(mapStateToProps)(Menu);
