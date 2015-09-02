/**
 * Main JavaScript for handling Chromecast interactions.
 */

var applicationID = '10B2AF08';
var namespace = 'urn:x-cast:de.michaelkuerbis.kiosk';
var session = null;

if (!chrome.cast || !chrome.cast.isAvailable) {
  setTimeout(initializeCastApi, 1000);
}

function initializeCastApi() {
  var sessionRequest = new chrome.cast.SessionRequest(applicationID);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
    sessionListener,
    receiverListener);

  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
};

function onInitSuccess() {
  console.log('onInitSuccess');
}

function onError(message) {
  console.log('onError: ' + JSON.stringify(message));
}

function onSuccess(message) {
  console.log('onSuccess: ' + JSON.stringify(message));

  if (message['type'] == 'load') {
    //$('#kill').prop('disabled', false);
    //$('#post-note').show();
  }
}

function onStopAppSuccess() {
  console.log('onStopAppSuccess');

  //$('#kill').prop('disabled', true);
  //$('#post-note').hide();
}

function sessionListener(e) {
  console.log('New session ID: ' + e.sessionId);
  session = e;
  session.addUpdateListener(sessionUpdateListener);
}

function sessionUpdateListener(isAlive) {
  console.log((isAlive ? 'Session Updated' : 'Session Removed') + ': ' + session.sessionId);
  if (!isAlive) {
    session = null;
  }
};

function receiverListener(e) {
  if (e !== 'available') {
    //TODO Nachricht
    alert('No Chromecast receivers available');
  }
  console.log(e);
}

function sendMessage(message) {
    chrome.cast.requestSession(function(e) {
      session = e;
      sessionListener(e);
      session.sendMessage(namespace, message, onSuccess.bind(this, message), onError);
    }, onError);
}

function stopApp() {
  session.stop(onStopAppSuccess, onError);
}

function connect() {
  console.log('connect()');
  sendMessage({
    type: 'load',
    url: $('#url').val(),
    refresh: $('#refresh').val(),
  });
}

//$('#kill').on('click', stopApp);
