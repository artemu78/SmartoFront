import React from 'react';
import { post } from 'axios';
import scheme_style from '../../../../css/scheme.css';
const url = './data/scheme.php';
const randomnumber = () => Math.floor(Math.random() * (10000 - 1 + 1)) + 1 + '.' + Math.floor(Math.random() * (10000 - 1 + 1)) + 1;

const setStore = (id, prop, data, store) => {
  for (let key in store)
    if (store[key]._id === id) {
      store[key][prop] = data;
      break;
    }
}

const flatDeep = (arr) => {
  let res = arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatDeep(val)) : acc.concat(val), []);
  return res;
}

const sortButtonsInRow = (buttons_array) => {
  let button_rows_arr = [];
  buttons_array.forEach(button_obj => {
    if (button_rows_arr[button_obj['row']] === undefined)
      button_rows_arr[button_obj['row']] = [];
    button_rows_arr[button_obj['row']].push(button_obj);
  });
  return button_rows_arr;
}

const buttonsMaxRow = (buttons_array) => {
  let max_row = -1;
  buttons_array.forEach(button_obj => {
    max_row = (button_obj.row > max_row) ? button_obj.row : max_row;
  });
  return max_row;
}

const maxId = (buttons_array) => {
  let max_id = 0;
  buttons_array.forEach(button_obj => {
    if (button_obj._id > max_id)
      max_id = button_obj._id;
  });
  return (max_id + 1);
}

class MainScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      flip: false,
      screen: props.obj,
      name: props.obj.name,
      varname: props.obj.varname,
      text: props.obj.text,
      screen_val: props.obj.screen_val,
      screen_var: props.obj.screen_var,
      buttons: props.obj.buttons || [],
      btnName: '',
      btnDest: '',
      btnUrl: '',
      cancel: true,
      showDestinationSreens: false,
      file: null,
      progres: null,
      percent: 0,
      module: props.obj.module,
      files: ((props.obj.media === undefined || props.obj.media === null) ? [] : props.obj.media),
      dlgflw_intent: props.obj.dlgflw_intent,
      next_screen: props.obj.next_screen,
      screenContentDisplayCSS: null
    };
    this.toggleDestinationSelection = this.toggleDestinationSelection.bind(this);
    this.cancelBtnOpts = this.cancelBtnOpts.bind(this);
    this.saveBtn = this.saveBtn.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.onChange = this.onChange.bind(this);
    this.delFile = this.delFile.bind(this);
    this.minimizeScreen = this.minimizeScreen.bind(this);
    this.maximizeScreen = this.maximizeScreen.bind(this);

    if (this.props.store)
      this.state.btnDest = this.props.store[0]._id;
  }

  componentWillReceiveProps () {
    this.setState({
      boxSize: null,
      screenContentDisplayCSS: null
    })
  }

  delFile (i) {
    if (!window.confirm('Delete attach?')) return;
    let files = [...this.state.files];
    files.splice(i, 1);
    setStore(this.props.obj._id, 'media', files, this.props.store);
    this.setState({ files: files });
  }
  onChange (e) {
    this.setState({ file: e.target.files[0], progres: true }, () => {
      this.upload();
    });
  }
  upload () {
    if (this.state.files >= 10) {
      this.setState({ progres: null });
      window.alert('File uploads limit reached');
      return;
    }
    this.fileUpload(this.state.file).then((response) => {
      let files = [...this.state.files];
      files.push(response.data);
      this.setState({ progres: null });
      setStore(this.props.obj._id, 'media', files, this.props.store);
      this.setState({ files: files });
    })
  }

  fileUpload (file) {
    const formData = new window.FormData();
    formData.append('file', file);
    formData.append('oper', 'sendfile');
    formData.append('b', this.props.bot.id);
    formData.append('parent', this.props.inputName);
    const config = {
      onUploadProgress: progressEvent => {
        if (progressEvent.lengthComputable) {
          var percentComplete = progressEvent.loaded / progressEvent.total;
          percentComplete = parseInt(percentComplete * 100, 10);
          this.setState({ percent: percentComplete + '%' });
        }
      },
      headers: { 'content-type': 'multipart/form-data' }
    }
    let post_resuls = post(url, formData, config);
    return post_resuls;
  }

  handleInput (e) {
    let value = e.target.value;
    let name = e.target.name;
    let stateVar = {};
    stateVar[name] = value;
    this.setState(stateVar,
      () => {
        setStore(this.props.obj._id, name, value, this.props.store);
      });
  }

  cancelBtnOpts () {
    this.setState({ showDestinationSreens: false, btnName: '', btnDest: '', btnUrl: '', cancel: !this.state.cancel });
  }

  saveBtn () {
    if (this.state.btnName.length <= 0)
      return window.alert('Button name is required. Please set button name');

    let buttons = this.state.buttons;
    let new_button = {
      _id: this.state._btnId || maxId(buttons),
      row: this.state.btnRow,
      index: this.state.btnIndex,
      text: this.state.btnName,
      url: this.state.btnUrl,
      dest: this.state.btnDest,
      payload: this.state.btnPayload
    };

    if (this.state.btnSaveMode === 'newRow')
      buttons.push(new_button);
    else if (this.state.btnSaveMode === 'newSibling') {
      let rows = sortButtonsInRow(buttons);
      rows[new_button.row].splice(new_button.index, 0, new_button);
      buttons = flatDeep(rows);
    } else if (this.state.btnSaveMode === 'edit')
      buttons = buttons.map(button_obj => (button_obj._id !== new_button._id) ? button_obj : new_button);

    this.setState({ buttons: buttons },
      () => {
        setStore(this.props.obj._id, 'buttons', buttons, this.props.store);
        this.cancelBtnOpts();
      });
  }

  addButtonRight (row, index) {
    this.setState({
      _btnId: maxId(this.state.buttons),
      cancel: !this.state.cancel,
      btnName: '',
      btnUrl: '',
      btnDest: '',
      btnRow: row,
      btnIndex: index,
      btnPayload: '',
      btnSaveMode: 'newSibling'
    });
  }

  addButtonNewRow () {
    let max_row = buttonsMaxRow(this.state.buttons);
    this.setState({
      _btnId: maxId(this.state.buttons),
      cancel: !this.state.cancel,
      btnName: '',
      btnUrl: '',
      btnDest: '',
      btnRow: max_row + 1,
      btnIndex: 0,
      btnPayload: '',
      btnSaveMode: 'newRow'
    });
  }

  editButton (button_object) {
    this.setState({
      _btnId: (button_object && button_object._id) || null,
      cancel: !this.state.cancel,
      btnName: (button_object && button_object.text) || '',
      btnUrl: (button_object && button_object.url) || '',
      btnDest: (button_object && button_object.dest) || '',
      btnRow: (button_object && button_object.row),
      btnIndex: (button_object && button_object.index),
      btnPayload: (button_object && button_object.payload) || '',
      btnSaveMode: 'edit'
    });
  }

  toggleDestinationSelection () {
    this.setState({ showDestinationSreens: !this.state.showDestinationSreens });
  }
  delButton (id) {
    let buttons = [...this.state.buttons];
    let btn = buttons.filter((item) => item._id !== id);
    this.setState({ buttons: btn }, () => { setStore(this.props.obj._id, 'buttons', btn, this.props.store); });
  }

  ButtonsList () {
    let buttons_rows_original = sortButtonsInRow(this.state.buttons);
    const buttons_rows_html = buttons_rows_original.map((buttons_row, row_index) => {
      let buttons_elements = buttons_row.map((button_obj, button_index) => {
        let bgColorClass, title;
        if (button_obj.dest || button_obj.url) {
          bgColorClass = scheme_style.backgroundOrange;
          title = (button_obj.dest ? 'Screen ' + button_obj.dest : 'URL ' + button_obj.url);
        } else {
          bgColorClass = scheme_style.backgroundGray;
          title = 'Button doesn`t display! Define destination or URL';
        }
        let buttonClass = [scheme_style.btn_front, bgColorClass].join(' ');
        return (
          <div key={randomnumber() + '.' + 1} className={scheme_style.link} title = {title}>
            <div key={randomnumber() + '.' + 2} className={buttonClass}>{ button_obj.text || '[EMPTY]'}</div>
            <div key={randomnumber() + '.' + 3} className={scheme_style.btn_back}>
              <span key={randomnumber()} className="add-button btn material-icons" title='Add new button'
                onClick={() => { this.addButtonRight(row_index, button_index + 1) } }>add_box</span>
              <span key={randomnumber()} className="edit-button btn material-icons" title='Edit button'
                onClick={() => { this.editButton(button_obj) } }>edit</span>
              <span key={randomnumber()} className="delete-button btn material-icons" title='Delete button'
                onClick={() => { this.delButton(button_obj._id) } }>delete_forever</span>
            </div>
          </div>
        )
      });
      return <li key={randomnumber()} className={scheme_style.scr_button_layout}>{ buttons_elements }</li>
    });
    return buttons_rows_html;
  }

  ScreensAsSelectOptions () {
    let screens = this.props.store.map(item => <option key={randomnumber()} value={ item._id }>{item.name}</option>);
    screens.unshift(<option key={randomnumber()} value=''>[no destination]</option>)
    return screens;
  }

  fileListCount () {
    return (Array.isArray(this.state.files) && this.state.files.length) || 0;
  }

  fileList () {
    let files = [];
    if (Array.isArray(this.state.files))
      files = this.state.files.map((item, i) => {
        let mediaUrl = `/data/upload/${this.props.bot.id}/${item.newName}`;
        return (
          <li className="fileLine" key={i}>
            <a href={mediaUrl} target="_blank">{item.fileName}</a>
            <span key={randomnumber()} className="delete-file" onClick={() => { this.delFile(i) } }>X</span>
          </li>
        );
      });

    return files;
  }

  moduleOption (value, text, key) {
    return <option value={value} key={key}>{text}</option>;
  }

  modulesList () {
    let firstObject = this.moduleOption('', '<choose module>', 0);
    let result = [];
    if (Array.isArray(this.props.bot.modules)) {
      let modulesArrayStore = JSON.parse(window.sessionStorage.getItem('modules'));
      let modulesObj = {};
      modulesArrayStore.forEach(item => {
        modulesObj[item.id] = item.name;
      });
      let modulesArray = this.props.bot.modules.map((item, i) => {
        return this.moduleOption(item, modulesObj[item], (i + 1));
      });
      result = [firstObject].concat(modulesArray);
    }
    return result;
  }

  minimizeScreen () {
    this.setState({
      boxSize: {
        width: '160px',
        height: '35px'
      },
      screenContentDisplayCSS: 'none'
    });
  }

  maximizeScreen () {
    this.setState({
      boxSize: {
        width: '300px',
        height: '465px'
      },
      screenContentDisplayCSS: 'block'
    });
  }

  render () {
    let { boxSize, screenContentDisplayCSS, flip } = this.state;
    let main = (this.props.obj.parent === 0);
    let fileListCount = this.fileListCount();

    return (
      <React.Fragment>
        <div className={ 'flip-container' + (flip ? ' hover' : '') } style={boxSize} ref={ref => { this.flipContainer = ref; }}>
          <div className="flipper">
            <div className="front" style={boxSize}>
              <div className={scheme_style.screen_control_buttons}>
                <div className={scheme_style.screen_name} title={this.state.text}>{this.state.name}</div>
                <div>
                  <button className='material-icons' title='Minimize screen' onClick={this.minimizeScreen}>minimize</button>
                  <button className='material-icons' title='Maximize screen' onClick={this.maximizeScreen}>web_asset</button>
                  <button className='material-icons' title='Delete screen' onClick={ () => { this.props.deleteScreen(this.props.obj) } } disabled={main}>clear</button>
                </div>
              </div>
              <span className={scheme_style.wholeScreenButTitle} style={{ display: screenContentDisplayCSS }}>
                <input className="inputrow" value={this.state.name} onChange={ this.handleInput } name="name" placeholder="screen name" title={this.state.text} />
                <textarea spellCheck={false} className="inputrow" value={this.state.text} onChange={ this.handleInput } placeholder="Screen content in bot" name="text" />
                <div className="fields_container">
                  <input className="bot-screen-input child_field" value={this.state.screen_var} type="text" onChange={ this.handleInput } name="screen_var" placeholder="Variable" title="Set user variable"/>
                  <div>&nbsp;=&nbsp;</div>
                  <input className="bot-screen-input child_field" value={this.state.screen_val} type="text" onChange={ this.handleInput } name="screen_val" placeholder="Value" title="To this value"/>
                </div>

                <div className="fields_container">
                  <input className="bot-screen-input child_field" value={this.state.varname} type="text" onChange={ this.handleInput } name="varname" placeholder="text input in variable" title="All user input gets in this variable" />
                  <select className="bot-screen-input child_field" value={this.state.module} onChange={ this.handleInput } name="module" title="Show this module instead of screen content">
                    {this.modulesList()}
                  </select>
                </div>
                <div className="fields_container">
                  <input className="bot-screen-input child_field" type="text" value={this.state.dlgflw_intent} onChange={ this.handleInput } name="dlgflw_intent" placeholder="Dialogflow intent" title="Display this screen as intent response"/>
                  <input className="bot-screen-input child_field" type="text" value={this.state.next_screen} onChange={ this.handleInput } name="next_screen" placeholder="Next screen name" title="Display next screen immediately"/>
                </div>
                <div className="buttons">
                  <ul className="buttons_row">
                    { this.ButtonsList() }
                  </ul>
                  <button className={scheme_style.add_button_row} onClick={ () => { this.addButtonNewRow() } }>+</button>
                  { (!this.state.cancel)
                    ? <React.Fragment>
                      <div className={scheme_style.AddButton}>
                        <input placeholder="Button name" className={scheme_style.btnName} value={this.state.btnName} onChange={ this.handleInput } type="text" name="btnName"/>
                        <button className={scheme_style.done_screen_files} onClick={ this.toggleDestinationSelection }>Destination</button>
                        {(this.state.showDestinationSreens)
                          ? <select size="5" onChange={ this.handleInput } value={this.state.btnDest} className={scheme_style.button_data} name="btnDest">
                            { this.ScreensAsSelectOptions() }
                          </select>
                          : null}

                        <input placeholder="URL" value={this.state.btnUrl} name="btnUrl" onChange={ this.handleInput } className={scheme_style.btnName} type="text"/>
                        <input placeholder="Button payload" value={this.state.btnPayload} name="btnPayload" onChange={ this.handleInput } className={scheme_style.btnName} type="text"/>
                        <div className="fields_container">
                          <input className="bot-screen-input child_field" type="text" value={this.state.btnRow} onChange={ this.handleInput } name="btnRow" placeholder="Row" title="0-based row position"/>
                          <input className="bot-screen-input child_field" type="text" value={this.state.btnIndex} onChange={ this.handleInput } name="btnIndex" placeholder="Index" title="0-based position in row"/>
                        </div>
                        <div>
                          <button className={scheme_style.AddButtonSave} onClick={ this.saveBtn }>save</button>
                          <button className={scheme_style.AddButtonSave + ' ' + scheme_style.AddButtonCancel} onClick={ this.cancelBtnOpts }>cancel</button>
                        </div>
                      </div>
                    </React.Fragment>
                    : null}
                </div>
                <div className="screen-options">
                  <div className="bot-screen-buttons-container">
                    <button className="screen-button" onClick={ () => { this.setState({ flip: !flip }); } }><span style={{ fontSize: '17px' }} className='material-icons'>attach_file</span> add files ({fileListCount})</button>
                  </div>
                  <button title='Let your bot tell something more' className="add-child-screen btn" onClick={ () => { this.props.addScreen(this.props.obj) } }>add child screen</button>
                </div>
              </span>
            </div>

            <div className="back">
              <span className="inputrow">
                { (this.state.progres) ? <p className="textloader">{this.state.percent}</p> : null }
                <div className="addFileArea">
                  <input name={this.props.obj._id} type="file" onChange={this.onChange} className="fileupload" />
                  <img src="./img/templates/fileUpload.svg" className="App-logo" alt="logo" />
                  <div> Click or Drag </div>
                </div>
              </span>
              <div className="files-list">
                <ul className="inputrow">{ this.fileList() }</ul>
              </div>
              <button className={scheme_style.done_screen_files} onClick={ () => { this.setState({ flip: !flip }); } }>done</button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MainScreen;
