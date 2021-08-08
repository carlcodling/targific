/*
  Responsible for loading, applying and saving settings.
  Requires companion/simple/companion-settings.js
  Callback should be used to update your UI.
*/
import { me } from "appbit";
import { me as device } from "device";
import * as fs from "fs";
import * as messaging from "messaging";

const SETTINGS_TYPE = "json";
const SETTINGS_FILE = "settings.json";

let settings, onsettingschange;

export function initialize(callback) {
  settings = loadSettings();
  onsettingschange = callback;
  onsettingschange(settings);
}

export function get(key) {
  if(settings.hasOwnProperty(key)){
    return settings[key];
  }
  else{
    console.log("Invalid settings key");
    return null;
  }
}



// Received message containing settings data
messaging.peerSocket.addEventListener("message", function(evt) {
  settings[evt.data.key] = evt.data.value;
  onsettingschange(settings);
})

// Register for the unload event
me.addEventListener("unload", saveSettings);

// Load settings from filesystem
function loadSettings() {
  if (!fs.existsSync("/private/data/"+SETTINGS_FILE)) {
      let json_data = {
          "colorCalories": "#e91e63",
          "colorSteps": "#536dfe",
          "colorDistance": "#cddc39",
          "colorAZ": "#00796b",
          "colorFloors": "#9c27b0",
          "dateFormat": 2,
          "displaySeconds": "true",
          "displayHR": "true",
          "displayBattery": "true"
        };
      fs.writeFileSync(SETTINGS_FILE, json_data, SETTINGS_TYPE);
    }
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    return {};
  }
}

// Save settings to the filesystem
function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}