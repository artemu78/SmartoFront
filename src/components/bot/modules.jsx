import React, { Component } from 'react';
import MapModule from './modules/map.jsx';
import ContentModule from './modules/content.jsx';
import QuestionModule from './modules/question.jsx';
import ProgrammsModule from './modules/programms.jsx';
import MaterialsModule from './modules/materials.jsx';
import ThemesModule from './modules/themes.jsx';
import SchemeModule from './modules/scheme.jsx';
import QAScreensModule from './modules/qa_screens.jsx';
import css from './../../css/menu.css';

class BotmModules extends Component {
  constructor () {
    super();
    this.state = { selected: 7 };
    this.modules = [];
    let modules = window.sessionStorage.getItem('modules');
    JSON.parse(modules).forEach(item => {
      this.modules[item.id] = item;
    }); ;
  }

  item_template (item, key = 0) {
    let add = (item === this.state.selected) ? css.menu_item_selected : '';
    let css_class = [css.menu_item, add].join(' ');
    let name = this.modules[item].name;
    return <div key={key} className={css_class} onClick={e => {
      this.setState({ selected: item });
    }} >
      <div className={css.menu_item_text}>
        {name}
      </div>
    </div>;
  }

  render () {
    let selected_module;
    switch (this.state.selected) {
      case 2:
        selected_module = <ContentModule bot={this.props.bot} />;
        break;
      case 1:
        selected_module = <MapModule bot={this.props.bot} />;
        break;
      case 3:
        selected_module = <QuestionModule bot={this.props.bot} />;
        break;
      case 4:
        selected_module = <ProgrammsModule bot={this.props.bot} />;
        break;
      case 5:
        selected_module = <MaterialsModule bot={this.props.bot} />;
        break;
      case 6:
        selected_module = <ThemesModule bot={this.props.bot} />;
        break;
      case 7:
        selected_module = <SchemeModule bot={this.props.bot} />;
        break;
      case 11:
        selected_module = <QAScreensModule bot={this.props.bot} />;
        break;
      default:
        selected_module = null;
        break;
    }

    let modules_html = this.props.bot.modules.map((item, i) => {
      if (this.modules[item].visual == 0)
        return null;
      return this.item_template(item, i);
    });
    return (
      <div className="bot_options">
        <div className={css.menu} style={{ 'top': '0px' }}>
          {modules_html}
        </div>
        <div className='modules_content'>
          {selected_module}
        </div>
      </div>);
  }
}

export default BotmModules;
