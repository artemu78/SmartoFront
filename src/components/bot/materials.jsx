import React, { Component } from 'react';
const { connect } = require('react-redux');
const utils = require('./../../utils.js');

class MapModule extends Component {
	
	constructor(props){
		super(props);
		this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
	}
	
    send(){
        let add = {l: utils.getCookie('l'), b: this.props.bot.id};
        let obj = Object.assign({}, this.state, add);
        let str = JSON.stringify(obj);
        utils.sendRequest(str, this.handleResponse, 'data/save_data.php');
    }
	
    handleResponse(response){
        window.webix.message({
            text:"Company data saved",
            type:"info", 
            expire: 5000,
            id:"message1"
        });
    }
    
    handleChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
	
    render(){
        return (
		<div>
		<div className="text_input">Company nameв<br/><input type="text" name="c_name" value={this.state.c_name}/></div>
		<div className="text_input">About company<br/><textarea name="c_about" value={this.state.c_name} rows="3"></textarea></div>
		<div className="text_input">Phone number<br/><input type="text" name="c_phone" value={this.state.c_phone}/></div>
		<div className="text_input">Site<br/><input type="text" name="c_site" value={this.state.c_site}/></div>
		<div className="text_input">Company location
		</div>
		<div className="button" onClick={()=>{
			//this.send();
			//let state = this.props.getState();
			//this.props.dispatch({ type: 'SHOW_MYBOTS', bo: {} });
			//const store = require('../store/app')
			//let state = store.getState()
			//console.log(state, 'stte');
		}}>Send</div>
		</div>);
    }
}

const mapStateToProps = state => ({
  show_mybots: state.show_mybots,
  bot: state.bot
});

export default connect(
  mapStateToProps
)(MapModule);