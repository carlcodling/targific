import { battery } from "power";
import { charger } from "power";
import clock from "clock";

let batteryCallback;

export function initialize(callback) {
  clock.granularity = "seconds";
  clock.addEventListener("tick", tickHandler);
  batteryCallback = callback;
}

export function stop() {
  clock.removeEventListener("tick", tickHandler);
}

function tickHandler(evt) {
  batteryCallback(batteryData());
}

let batteryData = () => {
  return {
    level: battery.chargeLevel,
    connected: charger.connected
  };
}
