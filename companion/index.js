/*
 * SnepWatch - Companion
 * JoppyFurr 2021
 *
 * Based on https://github.com/Fitbit/sdk-moment
 */
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
