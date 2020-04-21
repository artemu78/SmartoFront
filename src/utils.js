let E = {};

E.setCookie = function (cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
};

E.getCookie = function (cname) {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);

    if (c.indexOf(name) === 0) {
      let c_value = c.substring(name.length, c.length);
      return decodeURIComponent(c_value);
    }
  }
  return '';
};

/**
 * Delete a cookie and reload the page when the delete cookie button is clicked
 */
E.deleteCookie = function (cname) {
  var d = new Date(); // Create an date object
  d.setTime(d.getTime() - 1000 * 60 * 60 * 24); // Set the time to the past. 1000 milliseonds = 1 second
  var expires = 'expires=' + d.toGMTString(); // Compose the expirartion date
  window.document.cookie = cname + '=; ' + expires; // Set the cookie with name and the expiration date
};

E.sendRequest = function (request_str, callback, url, method = 'POST') {
  if (typeof request_str === 'object') request_str = JSON.stringify(request_str);
  var xhr = new window.XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    let response_obj;
    try {
      response_obj = JSON.parse(xhr.responseText);
    } catch (e) {
      console.log(xhr.responseText, e.message);
      return;
    }
    if (xhr.status === 200 && response_obj.res !== 'ok')
      window.alert('Something went wrong.  ' + response_obj.error);
    else if (xhr.status !== 200) window.alert('Request failed.  Returned status of ' + xhr.status);
    else if (callback) callback(response_obj);
  };
  xhr.send(request_str);
};

E.saveSessionBot = function (bot) {
  let _index = bot._id;
  let bots_str = window.sessionStorage.getItem('bots');
  let bots = JSON.parse(bots_str);
  bots[_index] = bot;
  window.sessionStorage.setItem('bots', JSON.stringify(bots));
};

module.exports = E;
