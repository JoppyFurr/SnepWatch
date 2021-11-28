/*
 * SnepWatch - Companion
 * JoppyFurr 2021
 *
 * Based on https://github.com/Fitbit/sdk-moment
 */
import { me as companion } from "companion";
import * as messaging from "messaging";
import { settingsStorage } from "settings";


/*
 * Send a key-value pair to the watch.
 */
function send_value (key, value)
{
    if (value)
    {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN)
        {
            let data = { key: key, value: JSON.parse (value) };
            messaging.peerSocket.send(data)
        }
        else
        {
            /* Exactly what magic triggers the connection - I'm not sure. */
            console.log("No peerSocket connection")
        }
    }
}


/*
 * Setting-changed callback.
 */
function setting_changed (event)
{
    if (event.oldValue !== event.newValue) {
        send_value (event.key, event.newValue);
    }
}

settingsStorage.addEventListener("change", setting_changed)

/* Special case of the setting changing before the companion was running. */
if (companion.launchReasons.settingsChanged)
{
    send_value ("fill_colour", settingsStorage.getItem ("fill_colour"))
    send_value ("outline_colour", settingsStorage.getItem ("outline_colour"))
}

messaging.peerSocket.addEventListener("open", (event) => {
    console.log ("peerSocket connection is open.")
})
