import React, { Component } from 'react';
import Header from './components/header.jsx';
import Menu from './components/menu.jsx';
import Content from './components/content.jsx';
import Profile from './components/profile.jsx';
import MyBots from './components/mybots.jsx';
import RegSplash from './components/regsplash.jsx';
import Bot from './components/bot_content.jsx';
import Support from './components/support.jsx';
import Plan from './components/plan.jsx';
import Service from './components/service.jsx';
import history from './history';
import { BrowserRouter, Switch, Route, Router } from 'react-router-dom';
const App = function App() {
  let style = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };
  // this.set_favicon();
  add_external_css('https://fonts.googleapis.com/icon?family=Material+Icons');
  console.log('render app.js');
  return (
    <Router history={history}>
      <div style={style}>
        <RegSplash />
        <div className='root_row1'>
          <Header />
        </div>
        <div className='root_row2'>
          <Switch>
            <Route exact path='/'>
              <MyBots />
              <Menu />
              <Content />
              <Bot />
              <Plan />
              <Service />
            </Route>
            <Route path='/support'>
              <Support />
            </Route>
            <Route path='/profile'>
              <Profile />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

function add_external_css(url) {
  var element = document.createElement('link');
  element.setAttribute('rel', 'stylesheet');
  element.setAttribute('type', 'text/css');
  element.setAttribute('href', url);
  document.getElementsByTagName('head')[0].appendChild(element);
}

export default App;
