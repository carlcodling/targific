import * as messaging from "messaging";
import { settingsStorage } from "settings";

import {defaultSettings} from "../../common/defaults"

// send settings to device when peerSocket opens
messaging.peerSocket.onopen = () => {
  restoreSettings();
};

export function initialize() {
  //settingsStorage.clear();
  if(settingsStorage.length < 1){ // is this the first run
    console.log("SETUP DEFAULTS")
    setup();
  }
  settingsStorage.addEventListener("change", evt => {
    if (evt.oldValue !== evt.newValue) {
      sendValue(evt.key, evt.newValue);
    }
  });
}

function sendValue(key, val) {
  let data = {
    key: key,
    value: JSON.parse(val)
  }
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}

function setup(){
  let defaults = defaultSettings;
  for (const key in defaults) {
    settingsStorage.setItem(key, JSON.stringify(defaults[key]));
  }
}

function restoreSettings(){
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key) {
      let v = settingsStorage.getItem(key);
      sendValue(key, v);
    }
  }
}
