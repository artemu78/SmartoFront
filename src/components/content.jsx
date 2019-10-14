import React, { Component } from 'react';
import './../css/content.css';
const PropTypes = require('prop-types');
let Draggable = require('react-draggable');
const { connect } = require('react-redux');

const get_window_size = () => {
  let w = window;
  let e = document.element;
  let b = document.body;
  return {
    x: w.innerWidth || e.clientWidth || b.clientWidth,
    y: w.innerHeight || e.clientHeight || b.clientHeight
  };
};

class Content extends Component {
  constructor () {
    super();
    this.state = {
      selected: 'Real estate'
    };
  }

  display_template (item) {
    this.setState({
      display_item: item
    });
  }

  item_template (item, key = 0) {
    // let style = {backgroundImage: 'url(../img/templates/bg_1.jpg)'};
    return <div className="template" key={key}>
      <div className="name">{item.name}</div>
      <div className="descr">{item.descr}</div>
      <div className="vk"><img alt="" src='img/vk.png' /></div>
      <div className="viber"><img alt="" src='img/viber.png'/></div>
      <div className="tm"><img alt="" src='img/tm.png'/></div>
      <div className="fb"><img alt="" src='img/fb.png'/></div>
      <div className="preview" onClick={e => this.display_template(item)}>Preview</div>
    </div>;
  }

  render () {
    if (!this.props.show_content)
      return null;

    let item_draggable;
    let items = [
      {
        name: 'Сhat-bot for online electronics stores',
        descr: 'helps users to pick up a product',
        bg: 'bg_1.jpg',
        full_descr: 'helps users to pick up a product. helps users to pick up a product. helps users to pick up a product.helps users to pick up a product.helps users to pick up a product. helps users to pick up a product.helps users to pick up a product.helps users to pick up a product. helps users to pick up a product.'
      },
      {
        name: 'Сhat bot for online clothing store',
        descr: 'helps users to pick up a product',
        bg: 'bg_2.jpg',
        full_descr: 'helps users to pick up a product. helps users to pick up a product. helps users to pick up a product.helps users to pick up a product.helps users to pick up a product. helps users to pick up a product.helps users to pick up a product.helps users to pick up a product. helps users to pick up a product.'
      },
      {
        name: 'Сhat-bot for online electronics stores',
        descr: 'helps users to pick up a product',
        bg: 'bg_2.jpg',
        full_descr: 'helps users to pick up a product. helps users to pick up a product. helps users to pick up a product.helps users to pick up a product.helps users to pick up a product. helps users to pick up a product.helps users to pick up a product.helps users to pick up a product. helps users to pick up a product.'
      }
    ].map((item, i) => {
      return this.item_template(item, i);
    });

    if (this.state.display_item) {
      let window_size = get_window_size();
      let x_pos = (window_size.x / 2) - 178;
      let y_pos = ((window_size.y / 2) > 265) ? (window_size.y / 2) - 265 : 0;
      let drag_pos = { x: x_pos, y: y_pos };
      console.log(drag_pos)
      let item = this.state.display_item;
      item_draggable = <Draggable >
        <div className = "template_full">
          <i className="material-icons x_btn" onClick={
            e => {
              this.setState({ display_item: null });
            }
          }>close</i>
          <div className="name">{item.name}</div>
          <div className="full_descr">{item.full_descr}</div>
          <div className="workto" >
            <span>Work to: </span>
            <img alt="" src="./img/social/fb_23_23.png" />
            <img alt="" src="img/social/tm_23_23.png"/>
          </div>
          <div class="templ_buttons">
            <div>Use template</div>
            <div>Testing</div>
          </div>
        </div>
      </Draggable>
    } else
      item_draggable = null;

    return (
      <div className="container">
        {items}
        {item_draggable}
      </div>
    );
  }
};

Content.propTypes = {
  show_content: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  show_content: state.show_content
});

const mapDispatchToProps = dispatch => ({
  fake: id => dispatch((id) => { return {} })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Content);

Content.propTypes = {
  show_content: PropTypes.bool.isRequired
}
