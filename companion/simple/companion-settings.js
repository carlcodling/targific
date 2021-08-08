import * as messaging from "messaging";
import { settingsStorage } from "settings";

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
  settingsStorage.setItem('colorCalories', "#e91e63");
  settingsStorage.setItem('colorSteps', "#536dfe");
  settingsStorage.setItem('colorDistance', "#cddc39");
  settingsStorage.setItem('colorAZ', "#00796b");
  settingsStorage.setItem('colorFloors', "#9c27b0");
  settingsStorage.setItem('dateFormat', "3");
  settingsStorage.setItem('displaySeconds', "true");
  settingsStorage.setItem('displayHR', "true");
  settingsStorage.setItem('displayBattery', "true");
  settingsStorage.setItem('df', "{\"selected\":[2]}");
}