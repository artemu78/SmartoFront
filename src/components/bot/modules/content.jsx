import React, { Component } from 'react';
const utils = require('./../../../utils.js');

class ContentModule extends Component {
  constructor(props) {
    super(props);

    let login = utils.getCookie('l');
    let bot_id = this.props.bot.id;
    let login_url = encodeURI(login);
    let bot_id_url = encodeURI(bot_id);
    this.lang = 'ru_RU';
    this.base_url = `data/settings.php?l=${login_url}&b=${bot_id_url}&lang=`;
    this.url = this.base_url + this.lang;
    this._options = [
      { id: 'btn', value: 'Button' },
      { id: 'say', value: 'Phrase' },
      { id: 'set', value: 'Setting' }
    ];
  }
  // ReactDOM.findDOMNode(this.refs.root)
  custom_checkbox(obj, common, value) {
    if (value === 1) return "<div class='webix_table_checkbox checked'> да </div>";
    else return "<div class='webix_table_checkbox notchecked'> нет </div>";
  }
  oneForAll(value, filter, obj) {
    if (this.equals(obj.name, filter)) return true;
    if (this.equals(obj.value, filter)) return true;
    if (this.equals(obj.branch, filter)) return true;
    if (this.equals(obj.type, filter)) return true;
    return false;
  }

  equals(a, b) {
    if (a == null) return false;
    a = a.toString().toLowerCase();
    return a.indexOf(b) !== -1;
  }

  componentDidMount() {
    this.ui = window.webix.ui({
      container: this.refs.root,
      rows: [
        {
          view: 'combo',
          id: 'field_t',
          label: 'Language',
          value: this.lang,
          options: [
            { id: 'en_EN', value: 'English' },
            { id: 'ru_RU', value: 'Russian' }
          ],
          on: {
            onChange: (new_val) => {
              window.webix('mainTable').clearAll();
              window.webix('mainTable').load(this.base_url + new_val);
            }
          }
        },
        {
          id: 'mainTable',
          view: 'datatable',
          columns: [
            {
              id: 'name',
              width: 170,
              sort: 'string',
              header: [
                'Code',
                {
                  // eslint-disable-line
                  content: 'textFilter',
                  placeholder: 'Type here to filter the grid',
                  compare: this.oneForAll,
                  colspan: 4
                }
              ]
            },
            { id: 'value', header: 'Text', editor: 'popup', width: 300, sort: 'string' },
            {
              id: 'type',
              header: 'Type',
              width: 100,
              sort: 'string',
              options: this._options,
              editor: 'select'
            },
            { id: 'branch', header: 'Branch', editor: 'text', width: 100, sort: 'string' },
            {
              id: 'active',
              header: 'Active',
              width: 100,
              sort: 'string',
              template: this.custom_checkbox,
              editor: 'inline-checkbox'
            }
          ],
          width: 800,
          autoheight: true,
          autoConfig: true,
          editable: true,
          checkboxRefresh: true,
          editaction: 'dblclick',
          url: this.url,
          save: this.url,
          resizeColumn: true
        },
        {
          margin: 5,
          cols: [
            {
              view: 'button',
              label: 'Excel',
              width: 95,
              click: function () {
                window.webix.toExcel(window.webix('mainTable'));
              }
            },
            {
              view: 'button',
              label: 'PDF',
              width: 95,
              click: function () {
                window.webix.toPDF(window.webix('mainTable'));
              }
            }
          ]
        }
      ]
    });
  }

  componentWillUnmount() {
    this.ui.destructor();
    this.ui = null;
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div id='root_root' ref='root'></div>;
  }
}

export default ContentModule;
