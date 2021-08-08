import * as messaging from "messaging";
import { settingsStorage } from "settings";

import {defaultSettings} from "../../common/defaults"

export function initialize() {
  //settingsStorage.clear();
  console.log("SETTINGS "+settingsStorage.getItem("df"))
  if(settingsStorage.getItem("df") == null){ // is this the first run
    setup();
  }
  settingsStorage.addEventListener("change", evt => {
    if (evt.oldValue !== evt.newValue) {
      sendValue(evt.key, evt.newValue);
    }
  });
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
}

function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}

function setup(){
  let defaults = defaultSettings();

  for (const key in defaults) {
    settingsStorage.setItem(key, defaults[key]);
  }
}
