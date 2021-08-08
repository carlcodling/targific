import * as document from "document";

import * as simpleActivity from "./simple/activity";
import * as simpleClock from "./simple/clock";
import * as simpleHRM from "./simple/hrm";
import * as simpleBattery from "./simple/battery";
import * as simpleSettings from "./simple/device-settings";

// clock elements
const uiTime = document.getElementById("time");
const uiSecs = document.getElementById("secs");
const uiDate = document.getElementById("date");
const uiHR = document.getElementById("hr");

const imgHeart = document.getElementById("heart");

// container elements for stat progress display
const containerCalories = document.getElementById("calories");
const containerSteps = document.getElementById("steps");
const containerDistance = document.getElementById("distance");
const containerAZ = document.getElementById("activeMinutes");
const containerFloors = document.getElementById("floors");
// text elements for stat progress display
const txtCalorieCount = document.getElementById("calorieCount");
const txtStepsCount = document.getElementById("stepsCount");
const txtDistance = document.getElementById("distanceCount");
const txtActiveZone = document.getElementById("activeZoneCount");
const txtFloors = document.getElementById("floorsCount");
// visual elements for stat progress display
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

// battery elements
const uiBattery = document.getElementById("battery");
const batlev = document.getElementById("batlev");
const batcharge = document.getElementById("batcharge");
const batlevindicator = document.getElementById("batlevindicator");

// handles for current display status
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
    setFillByClass("statItem", data.colorCalories, containerCalories);
    txtCalorieCount.style.fill = data.colorCalories;
  }
  if (data.colorSteps) {
    setFillByClass("statItem", data.colorSteps, containerSteps);
    txtStepsCount.style.fill = data.colorSteps;
  }
  if (data.colorDistance) {
    setFillByClass("statItem", data.colorDistance, containerDistance);
    txtDistance.style.fill = data.colorDistance;
  }
  if (data.colorAZ) {
    setFillByClass("statItem", data.colorAZ, containerAZ);
    txtActiveZone.style.fill = data.colorAZ;
  }
  if (data.colorFloors) {
    setFillByClass("statItem", data.colorFloors, containerFloors);
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
  setFillByClass("battery", batColor);
}
if(simpleSettings.get("displayBattery")){
  simpleBattery.initialize("seconds", batteryCallback);
}

/* ------- ACTIVITY --------- */
function activityCallback(data) {

  // apply styles the statistic arcs and associated elements
  styleArc(
    txtCalorieCount,
    data.calories,
    arc1,
    circ1
  )
  styleArc(
    txtStepsCount,
    data.steps,
    arc2,
    circ2
  )
  styleArc(
    txtDistance,
    data.distance,
    arc3,
    circ3
  )
  styleArc(
    txtActiveZone,
    data.activeMinutes,
    arc4,
    circ4
  )
  styleArc(
    txtFloors,
    data.elevationGain,
    arc5,
    circ5
  )
  function styleArc(txtElem, data, arcElem, circElem){
    txtElem.text = `${data.pretty}`;
    var pcnt = (100/data.goal)*data.raw;
    if(pcnt>100) pcnt = 100;
    arcElem.sweepAngle = Math.round(pcnt*2.7);
    circElem.style.opacity = pcnt*0.01;
  }
}
simpleActivity.initialize("seconds", activityCallback);

/* ------- Helpers --------- */
function setVisibiltyByClass(className, v){
  var x = document.getElementsByClassName(className);
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].style.visibility = v;
  }
}
function setFillByClass(className, v, container=document){
  var x = container.getElementsByClassName(className);
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].style.fill = v;
  }
}
