import React, { Component } from 'react';
import MapModule from './modules/map.jsx';
import ContentModule from './modules/content.jsx';
import QuestionModule from './modules/question.jsx';
import ProgrammsModule from './modules/programms.jsx';
import MaterialsModule from './modules/materials.jsx';
import ThemesModule from './modules/themes.jsx';
import SchemeModule from './modules/scheme.jsx';
import QAScreensModule from './modules/qa_screens.jsx';
import Events from './modules/events.jsx';
import css from 'root/css/menu.css';
// import AccountTreeIcon from '@material-ui/icons/AccountTree';

const icons = {
  'About': 'info',
  'Scheme': 'device_hub',
  'Events': 'dns'
};

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
        <i className="material-icons">{icons[name]}</i>&nbsp;
        {name}
      </div>
    </div>;
  }

  render () {
    const { bot } = this.props;
    let selected_module;
    switch (this.state.selected) {
      case 2:
        selected_module = <ContentModule bot={bot} />;
        break;
      case 1:
        selected_module = <MapModule bot={bot} />;
        break;
      case 3:
        selected_module = <QuestionModule bot={bot} />;
        break;
      case 4:
        selected_module = <ProgrammsModule bot={bot} />;
        break;
      case 5:
        selected_module = <MaterialsModule bot={bot} />;
        break;
      case 6:
        selected_module = <ThemesModule bot={bot} />;
        break;
      case 7:
        selected_module = <SchemeModule bot={bot} />;
        break;
      case 11:
        selected_module = <QAScreensModule bot={bot} />;
        break;
      case 14:
        selected_module = <Events bot={bot} />;
        break;
      default:
        selected_module = null;
        break;
    }

    let modules_html = bot.modules.filter(item => this.modules[item].visual != 0).map((item, i) => {
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
