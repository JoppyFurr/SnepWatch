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

let gui_battery_0 = document.getElementById ("battery_0")
let gui_battery_1 = document.getElementById ("battery_1")
let gui_battery_2 = document.getElementById ("battery_2")
let gui_battery_3 = document.getElementById ("battery_3")
let gui_battery = [ gui_battery_0, gui_battery_1, gui_battery_2, gui_battery_3 ]

let gui_date_0  = document.getElementById ("date_0")
let gui_date_1  = document.getElementById ("date_1")
let gui_date_2  = document.getElementById ("date_2")
let gui_date_3  = document.getElementById ("date_3")
let gui_date_4  = document.getElementById ("date_4")
let gui_date_5  = document.getElementById ("date_5")
let gui_date_6  = document.getElementById ("date_6")
let gui_date_7  = document.getElementById ("date_7")
let gui_date_8  = document.getElementById ("date_8")
let gui_date_9  = document.getElementById ("date_9")
let gui_date_10 = document.getElementById ("date_10")
let gui_date = [ gui_date_0, gui_date_1, gui_date_2, gui_date_3, gui_date_4,
                 gui_date_5, gui_date_6, gui_date_7, gui_date_8, gui_date_9, gui_date_10 ]

let gui_time      = document.getElementById ("time")

let gui_steps_0 = document.getElementById ("steps_0")
let gui_steps_1 = document.getElementById ("steps_1")
let gui_steps_2 = document.getElementById ("steps_2")
let gui_steps_3 = document.getElementById ("steps_3")
let gui_steps_4 = document.getElementById ("steps_4")
let gui_steps_5 = document.getElementById ("steps_5")
let gui_steps_6 = document.getElementById ("steps_6")
let gui_steps = [ gui_steps_0, gui_steps_1, gui_steps_2,
                  gui_steps_3, gui_steps_4, gui_steps_5, gui_steps_6 ]

let gui_heart_0 = document.getElementById ("heart_0")
let gui_heart_1 = document.getElementById ("heart_1")
let gui_heart_2 = document.getElementById ("heart_2")
let gui_heart = [ gui_heart_0, gui_heart_1, gui_heart_2 ]

let gui_zone_0 = document.getElementById ("zone_0")
let gui_zone_1 = document.getElementById ("zone_1")
let gui_zone_2 = document.getElementById ("zone_2")
let gui_zone_3 = document.getElementById ("zone_3")
let gui_zone_4 = document.getElementById ("zone_4")
let gui_zone_5 = document.getElementById ("zone_5")
let gui_zone_6 = document.getElementById ("zone_6")
let gui_zone_7 = document.getElementById ("zone_7")
let gui_zone = [ gui_zone_0, gui_zone_1, gui_zone_2, gui_zone_3,
                 gui_zone_4, gui_zone_5, gui_zone_6, gui_zone_7 ]

let have_activity = false

let have_heart_rate = false
let heart_rate_monitor = null
let body_presence_sensor = null
let body_present = false
let current_heart_rate = 0
let current_zone = ""

/* TODO: Only replace images if they've changed */
/* TODO: Configurable colours */

function draw_text (target, font, string, colour="fb-white")
{
    for (let i = 0; i < target.length; i++)
    {
        let c = string.charAt (i)
        if (c == ' ' || c == '')
        {
            target [i].image = font + "/blank.png"
        }
        else
        {
            target [i].image = font + "/" + string.charCodeAt (i) + ".png"
            target [i].style.fill = colour
        }
    }
}

let days = [ "Sun ", "Mon ", "Tue ", "Wed ", "Thu ", "Fri ", "Sat " ]
let months = [ " Jan", " Feb", " Mar", " Apr", " May", " June", " July", " Aug", " Snep", " Oct", " Nov", " Dec"]

function snepwatch_tick (event)
{
    /* Battery level */
    let battery_text = ((battery.chargeLevel < 10) ? "0" : "") + battery.chargeLevel + "%"
    draw_text (gui_battery, "Terminus_12", battery_text, battery.chargeLevel <= 15 ? "fb-pink" : "fb-lavender")

    /* Date */
    let day = days [ event.date.getDay () ]
    let dd = event.date.getDate ()
    dd = ((dd < 10) ? "0" : "") + dd
    let month = months [ event.date.getMonth () ]

    let date_text = day + dd + month
    if (date_text.length < 11)
    {
        date_text = " " + date_text
    }
    draw_text (gui_date, "Terminus_14", date_text);

    /* Time */
    let hh = event.date.getHours ()
    let mm = event.date.getMinutes ()
    let ss = event.date.getSeconds ()
    hh = ((hh < 10) ? "0" : "") + hh
    mm = ((mm < 10) ? "0" : "") + mm
    ss = ((ss < 10) ? "0" : "") + ss
        
    gui_time.text = hh + ":" + mm + ":" + ss

    /* Steps */
    if (have_activity)
    {
        let steps_string = "" + today.adjusted.steps

        if (today.adjusted.steps >= 1000)
        {
            steps_string = steps_string.slice (0, -3) + "," + steps_string.slice (-3)
        }

        draw_text (gui_steps, "Terminus_14", steps_string)
    }
  
    /* Heart Rate */
    if (have_heart_rate)
    {
        if (body_present && current_heart_rate != 0)
        {
            draw_text (gui_heart, "Terminus_14", "" + current_heart_rate)

            switch (current_zone)
            {
                case "fat-burn":
                    draw_text (gui_zone,  "Terminus_14", "Fat-burn", "fb-lavender")
                    break;
                case "cardio":
                    draw_text (gui_zone,  "Terminus_14", "  Cardio", "fb-peach")
                    break;
                case "peak":
                    draw_text (gui_zone,  "Terminus_14", "    Peak", "fb-white")
                    break;
                default:
                    draw_text (gui_zone,  "Terminus_14", "")
                    break;
            }
        }
        else
        {
            draw_text (gui_heart, "Terminus_14", "--")
            draw_text (gui_zone,  "Terminus_14", "")
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
