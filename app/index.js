import clock from "clock";
import * as document from "document";
import { preferences, units } from "user-settings";
import * as util from "../common/utils";

import * as simpleActivity from "./simple/activity";
import * as simpleClock from "./simple/clock";
import * as simpleHRM from "./simple/hrm";
import * as simpleBattery from "./simple/battery";
import * as simpleSettings from "./simple/device-settings";

//import { HeartRateSensor } from "heart-rate";

import { me as appbit } from "appbit";
import { goals } from "user-activity";
import { today } from "user-activity";

// Get a handle on the <text> element
const uiTime = document.getElementById("time");
const uiSecs = document.getElementById("secs");
const uiDate = document.getElementById("date");
const uiHR = document.getElementById("hr");
const uiBattery = document.getElementById("battery");

const imgHeart = document.getElementById("heart");

const txtCalorieCount = document.getElementById("calorieCount");
const txtStepsCount = document.getElementById("stepsCount");
const txtDistance = document.getElementById("distanceCount");
const txtActiveZone = document.getElementById("activeZoneCount");
const txtFloors = document.getElementById("floorsCount");

const arc1 = document.getElementById("arc1");
const arc2 = document.getElementById("arc2");
const arc3 = document.getElementById("arc3");
const arc4 = document.getElementById("arc4");
const arc5 = document.getElementById("arc5");

const circ1 = document.getElementById("circ1");
const circ2 = document.getElementById("circ2");
const circ3 = document.getElementById("circ3");
const circ4 = document.getElementById("circ4");
const circ5 = document.getElementById("circ5");

const batlev = document.getElementById("batlev");
const batcharge = document.getElementById("batcharge");
const batlevindicator = document.getElementById("batlevindicator");

let batteryActive = true; 
let dateActive = true; 
let secondsActive = true; 
let heartRateActive = true; 

/* -------- SETTINGS -------- */
function settingsCallback(data) {
  if (!data) {
    return;
  }
  
  // set colours of the stat arcs
  if (data.colorCalories) {
    var container = document.getElementById("calories")
    var x = container.getElementsByClassName("statItem");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.fill = data.colorCalories;
    }
    txtCalorieCount.style.fill = data.colorCalories;
  }
  if (data.colorSteps) {
    var container = document.getElementById("steps")
    var x = container.getElementsByClassName("statItem");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.fill = data.colorSteps;
    }
    txtStepsCount.style.fill = data.colorSteps;
  }
  if (data.colorDistance) {
    var container = document.getElementById("distance")
    var x = container.getElementsByClassName("statItem");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.fill = data.colorDistance;
    }
    txtDistance.style.fill = data.colorDistance;
  }
  if (data.colorAZ) {
    var container = document.getElementById("activeMinutes")
    var x = container.getElementsByClassName("statItem");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.fill = data.colorAZ;
    }
    txtActiveZone.style.fill = data.colorAZ;
  }
  if (data.colorFloors) {
    var container = document.getElementById("floors")
    var x = container.getElementsByClassName("statItem");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.fill = data.colorFloors;
    }
    txtFloors.style.fill = data.colorFloors;
  }  
  
  // show or hide seconds on clock + reset
  if (data.displaySeconds && !secondsActive){
    simpleClock.reset("seconds", clockCallback);
    secondsActive = true;
  }
  else if (!data.displaySeconds && secondsActive){
    simpleClock.reset("minutes", clockCallback);
    uiSecs.text = "";
    secondsActive = false;
  }
  
  // show/start or hide/stop the battery display
  if (data.displayBattery && !batteryActive){
    simpleBattery.initialize("seconds", batteryCallback);
    setVisibiltyByClass("battery", "visible");
    batteryActive = true;
  }
  else if (!data.displayBattery && batteryActive){
    simpleBattery.stop();
    setVisibiltyByClass("battery", "hidden");
    batteryActive = false;
  }
  
  // show/start or hide/stop the heart rate display
  if (data.displayHR && !heartRateActive){
    simpleHRM.initialize(hrmCallback);
    setVisibiltyByClass("hrm", "visible");
    heartRateActive = true;
  }
  else if (!data.displayHR && heartRateActive){
    simpleHRM.exit();
    setVisibiltyByClass("hrm", "hidden");
    heartRateActive = false;
  }
  
}
simpleSettings.initialize(settingsCallback);

/* --------- CLOCK ---------- */
function clockCallback(data) {
  uiTime.text = data.time;
  let showSeconds = simpleSettings.get("displaySeconds");
  if(showSeconds !== null && showSeconds){
    uiSecs.text = data.seconds;
  }
  else{
    uiSecs.text = "";
  }
  let showDate = simpleSettings.get("dateFormat");
  if(showDate !== null && showDate.value != 0){
    uiDate.text = data.date;
  }
  else{
    uiDate.text = "";
  }
}
let granularity = "minutes";
if(simpleSettings.get("displaySeconds")) granularity = "seconds";
simpleClock.initialize(granularity, clockCallback);

/* -------- HRM ------------- */
function hrmCallback(data) {
  uiHR.text = `${data.bpm}`;
  if (data.zone === "out-of-range") {
    imgHeart.style.fill = "#cccccc";
  } else {
    imgHeart.style.fill = "#d32f2f";
  }
}
if(simpleSettings.get("displayHR")){
  simpleHRM.initialize(hrmCallback);
}


/* -------- BATTERY ------------- */
function batteryCallback(data) {
  batlev.text =`${data.level}%`;
  if(data.connected){
    batcharge.style.opacity = 1;
    batlevindicator.width = 0
  }
  else{
    batcharge.style.opacity = 0;
    batlevindicator.width = Math.round(data.level*0.31)
  }
  let batColor;
  if(data.level > 50){
    batColor = "#cccccc";
  }
  else if(data.level <=50 && data.level >25){
    batColor = "#ffeb3b";
  }
  else if(data.level <=25 && data.level >10){
    batColor = "#ff9800";
  }
  else if(data.level <=10){
    batColor = "#f44336";
  }
  var x = document.getElementsByClassName("battery");
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].style.fill = batColor;
  }
}
if(simpleSettings.get("displayBattery")){
  simpleBattery.initialize("seconds", batteryCallback);
}

/* ------- ACTIVITY --------- */
function activityCallback(data) {
  
  // calories
  txtCalorieCount.text = `${data.calories.pretty}`;
  var pcnt = (100/data.calories.goal)*data.calories.raw;
  if(pcnt>100) pcnt = 100;
  arc1.sweepAngle = Math.round(pcnt*2.7);
  circ1.style.opacity = pcnt*0.01;
  
  // distance
  txtDistance.text = `${data.distance.pretty}`;
  var pcnt = (100/data.distance.goal)*data.distance.raw;
  if(pcnt>100) pcnt = 100;
  arc3.sweepAngle = Math.round(pcnt*2.7);
  circ3.style.opacity = pcnt*0.01;
  
  // steps
  txtStepsCount.text = `${data.steps.pretty}`;
  var pcnt = (100/data.steps.goal)*data.steps.raw;
  if(pcnt>100) pcnt = 100;
  arc2.sweepAngle = Math.round(pcnt*2.7);
  circ2.style.opacity = pcnt*0.01;
    
  // floors
  txtFloors.text = `${data.elevationGain.pretty}`;
  var pcnt = (100/data.elevationGain.goal)*data.elevationGain.raw;
  if(pcnt>100) pcnt = 100;
  arc5.sweepAngle = Math.round(pcnt*2.7);
  circ5.style.opacity = pcnt*0.01;
    
  // active zone
  txtActiveZone.text = `${data.activeMinutes.pretty}`;
  var pcnt = (100/data.activeMinutes.goal)*data.activeMinutes.raw;
  if(pcnt>100) pcnt = 100;
  arc4.sweepAngle = Math.round(pcnt*2.7);
  circ4.style.opacity = pcnt*0.01;
  
  
}
simpleActivity.initialize("seconds", activityCallback);


function setVisibiltyByClass(className, v){
  var x = document.getElementsByClassName(className);
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].style.visibility = v;
  }
}
