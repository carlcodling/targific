/*
  A simple clock which renders the current time and date in a digital format.
  Callback should be used to update your UI.
*/
import clock from "clock";
import { preferences } from "user-settings";

import { days, months, monthsShort } from "./locales/en.js";
import * as util from "../../common/utils";

import * as simpleSettings from "./device-settings";

let clockCallback;

export function initialize(granularity, callback) {
  clock.granularity = granularity;
  clockCallback = callback;
  clock.addEventListener("tick", tickHandler);
}

export function reset(granularity, callback){
  clock.removeEventListener("tick", tickHandler);
  initialize(granularity, callback)
}

function tickHandler(evt) {
  let today = evt.date;

  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.monoDigits(util.zeroPad(hours));
  }
  let mins = util.monoDigits(util.zeroPad(today.getMinutes()));

  let secs = util.monoDigits(util.zeroPad(today.getSeconds()));

  let timeString = `${hours}:${mins}`;

  let dateString = "";
  let df = parseInt(simpleSettings.get("dateFormat"));
  
  if(df !== null && df != 0){
    let dayName = days[today.getDay()];
    let month = util.zeroPad(today.getMonth() + 1);
    let monthName = months[today.getMonth()];
    let monthNameShort = monthsShort[today.getMonth()];
    let dayNumber = util.zeroPad(today.getDate());
    switch(df) {
      case 1:
        dateString = `${dayNumber} ${monthNameShort}`;
        break;
      case 2:
        dateString = `${dayNumber} ${monthName}`;
        break;
      case 3:
        dateString = `${dayName} ${monthName} ${dayNumber}`;
        break;
    }
  }

  // switch(dateFormat) {
  //   case "shortDate":
  //     dateString = `${dayNumber} ${monthNameShort}`;
  //     break;
  //   case "mediumDate":
  //     dateString = `${dayNumber} ${monthName}`;
  //     break;
  //   case "longDate":
  //     dateString = `${dayName} ${monthName} ${dayNumber}`;
  //     break;
  // }
  clockCallback({time: timeString, seconds: secs, date: dateString});
}
