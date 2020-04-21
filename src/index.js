import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';
const utils = require('./utils.js');

let initial = {
  show_menu: false,
  show_content: false,
  header: false,
  show_profile: false,
  show_mybots: false,
  show_plan: false,
  show_service: false,
  show_regsplash: true
};
if (utils.getCookie('st') === 'g' || window.location.hostname === 'localhost') {
  let user_name = utils.getCookie('nm') || 'Unknown user';
  let user_email = utils.getCookie('eml') || 'Unknown email';
  let userpic = utils.getCookie('pic') || 'img/users/unknown-user.png';
  initial = {
    show_menu: false,
    show_content: false,
    header: true,
    show_profile: false,
    show_mybots: true,
    show_plan: false,
    show_service: false,
    show_regsplash: false,
    user_name,
    user_email,
    userpic
  };
}
window.sessionStorage.clear();
const store = createStore(rootReducer, initial);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
// registerServiceWorker();
