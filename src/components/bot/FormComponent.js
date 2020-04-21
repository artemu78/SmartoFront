import React from 'react';
import { post } from 'axios'; /* @ ajax transport engine  npm install axios */
import logo from './fileUpload.svg';
import './App.css';

const url = 'http://localhost/parser_db/img/index.php'; /* @ path to server for send data  */

/*

BUTTON

*/
const Button = (props) => {
  return <button onClick={props.callback} className="btn">Отправить</button>
  );
};

const NumberList = (props) => {
  let items = props.items;
  const listItems = items.map((item, index) => <li key={index}>{item.fileName}</li>);
  return <ul className="inputrow">{ listItems }</ul>
};

class ReactFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state =  { file: null, progres: null, percent: 0 };
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  _upload() {
    if (!this.props.limit(this.props.inputName)) {
        alert('максимальное кол-во файлов 10');
        return;
    }
    this.fileUpload(this.state.file).then((response) =>  {
      console.log(response);
        this.setState({ progres: null  });
      this.props.onFileLoaded(response.data.newName, response.data.fileName, this.props.inputName);
    });
  }

  onChange(e) {
    this.setState({ file: e.target.files[0], progres: true  }, () => {
        this._upload();
    });
  }

    fileUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('files', this.props.inputName);
    const config = {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          var percentComplete = progressEvent.loaded / progressEvent.total;
          percentComplete = parseInt(percentComplete * 100);
          this.setState({ percent: percentComplete + '%' });
         
}
      },
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    return post(url, formData, config)
  }

    render() {
    return (
        <React.Fragment>
        <span className="inputrow">
                {this.state.progres ? <p className='textloader'>{this.state.percent}</p> : null}
          <div className='addFileArea'>
            <input name={this.props.inputName} type="file" onChange={this.onChange} className="fileupload" />
                    <img src={logo} className='App-logo' alt='logo' />
                    <div> Click or Drag </div>
                </div>
        </span>
      </React.Fragment>
     );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items:  [], value: '' };
    this.onFileLoad = this.onFileLoad.bind(this);
    this.onSend = this.onSend.bind(this);
    this.limit = this.limit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
    onFileLoad(newName, file, id) {
    this.setState({ items: [...this.state.items, { 'areaName': id, 'fileName': file, 'newFileName': newName } ] }, () => console.log('this.state'));
    }

    limit(areaId) {
    let items = this.state.items;
    var maxitems = true;
    if (items.length > 0) {
      let limit = 3;

	
let counter = 0;
      items.forEach((item, i, items) => {
        if (areaId == item.areaName) counter++;
        if (counter >= limit) maxitems = false;
      });
    }
    return maxitems;
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  onSend() {
    let config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };

	
let data = new FormData();
    data.append('fileList', JSON.stringify(this.state.items));
    data.append('text', this.state.value);
    post(url, data, config).then((response) => {
          this.setState({ items: [] });
      })
      .catch(function (error) {
      alert(error);
      });
  }

    render() {
    return (
      <React.Fragment>
        <textarea className="inputrow" value={this.state.value} onChange={this.handleChange} />
        <ReactFileUpload inputName="form1" onFileLoaded={this.onFileLoad} limit={this.limit}/>
        <ReactFileUpload inputName="form2" onFileLoaded={this.onFileLoad} limit={this.limit}/>
        <NumberList items={this.state.items} />
        <Button callback={this.onSend} />
      </React.Fragment>
     );
    }
}

export default App;
