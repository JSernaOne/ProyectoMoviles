
document.addEventListener("deviceready", onDeviceReady, true);
function onDeviceReady() {
    console.log(navigator.vibrate);}

navigator.vibrate(3000); // 3000 is ignored



var exec = require('cordova/exec');




/**
 * Provides access to the vibration mechanism on the device.
 */

module.exports = {

    /**
     * Vibrates the device for a given amount of time or for a given pattern or immediately cancels any ongoing vibrations (depending on the parameter).
     *
     * @param {Integer} param       The number of milliseconds to vibrate (if 0, cancels vibration)
     *
     *
     * @param {Array of Integer} param    Pattern with which to vibrate the device.
     *                                      Pass in an array of integers that
     *                                      are the durations for which to
     *                                      turn on or off the vibrator in
     *                                      milliseconds. The FIRST value
     *                                      indicates the
     *                                      number of milliseconds for which
     *                                      to keep the vibrator ON before
     *                                      turning it off. The NEXT value indicates the
     *                                      number of milliseconds for which
     *                                      to keep the vibrator OFF before
     *                                      turning it on. Subsequent values
     *                                      alternate between durations in
     *                                      milliseconds to turn the vibrator
     *                                      off or to turn the vibrator on.
     *                                      (if empty, cancels vibration)
     */
    vibrate: function (param) {
        /* Aligning with w3c spec */

        // vibrate
        if ((typeof param === 'number') && param !== 0) {
            exec(null, null, 'Vibration', 'vibrate', [param]);

        // vibrate with array ( i.e. vibrate([3000]) )
        } else if ((typeof param === 'object') && param.length === 1) {
            // cancel if vibrate([0])
            if (param[0] === 0) {
                exec(null, null, 'Vibration', 'cancelVibration', []);

            // else vibrate
            } else {
                exec(null, null, 'Vibration', 'vibrate', [param[0]]);
            }

        // vibrate with a pattern
        } else if ((typeof param === 'object') && param.length > 1) {
            var repeat = -1; // no repeat
            exec(null, null, 'Vibration', 'vibrateWithPattern', [param, repeat]);

        // cancel vibration (param = 0 or [])
        } else { exec(null, null, 'Vibration', 'cancelVibration', []); }

        return true;
    }
};