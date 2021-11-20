/*
 * SnepWatch
 * JoppyFurr 2021
 */
import clock from "clock"
import document from "document"

import { me as appbit } from "appbit"
import { BodyPresenceSensor } from "body-presence"
import { display } from "display"
import { HeartRateSensor } from "heart-rate"
import { battery } from "power"
import { today } from "user-activity"
import { user } from "user-profile"

let gui_battery = document.getElementById ("battery")
let gui_time    = document.getElementById ("time")
let gui_steps   = document.getElementById ("steps")
let gui_heart   = document.getElementById ("heart")
let gui_zone    = document.getElementById ("zone")

let have_activity = false

let have_heart_rate = false
let heart_rate_monitor = null
let body_presence_sensor = null
let body_present = false
let current_heart_rate = 0
let current_zone = "--"


function snepwatch_tick (event)
{
    let hh = event.date.getHours ()
    let mm = event.date.getMinutes ()
    let ss = event.date.getSeconds ()
    
    /* Zero-pad */
    hh = ((hh < 10) ? "0" : "") + hh
    mm = ((mm < 10) ? "0" : "") + mm
    ss = ((ss < 10) ? "0" : "") + ss
        
    gui_time.text = hh + ":" + mm + ":" + ss
  
    gui_battery.text = "" + battery.chargeLevel + "%"

    if (have_activity)
    {
        /* TODO: comma-separators */
        gui_steps.text = "" + today.adjusted.steps
    }
  
    if (have_heart_rate)
    {
        if (body_present && current_heart_rate != 0)
        {
            gui_heart.text = "" + current_heart_rate
            gui_zone.text = "" + current_zone
        }
        else
        {
            gui_heart.text = "--"
            gui_zone.text = "--"
        }
    }
}

if (appbit.permissions.granted ("access_activity"))
{
    have_activity = true
}

if (appbit.permissions.granted ("access_heart_rate") && appbit.permissions.granted ("access_user_profile"))
{
    have_heart_rate = true
    heart_rate_monitor = new HeartRateSensor ()
  
    /* Heart Rate Monitor */
    heart_rate_monitor.addEventListener ("reading", () => {
        current_heart_rate = heart_rate_monitor.heartRate
        current_zone = user.heartRateZone (current_heart_rate)
    })
    heart_rate_monitor.start ()

    /* Display Monitor - Disable heart rate sensor while display is off. */
    display.addEventListener ("change", () => {
        display.on ? heart_rate_monitor.start () : heart_rate_monitor.stop ()
    })
  
    /* Presence Sensor - Disable heart rate display while not being worn. */
    body_presence_sensor = new BodyPresenceSensor ()
    body_presence_sensor.addEventListener ("reading", () => {
        body_present = body_presence_sensor.present;
        if (body_present == false)
        {
            current_heart_rate = 0
        }
    })
    body_presence_sensor.start ()
}

clock.granularity = "seconds"
clock.addEventListener ("tick", snepwatch_tick)
