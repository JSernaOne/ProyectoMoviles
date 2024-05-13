cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/src/browser/DeviceProxy.js",
        "id": "cordova-plugin-device.DeviceProxy",
        "pluginId": "cordova-plugin-device",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-vibration/src/browser/Vibration.js",
        "id": "cordova-plugin-vibration.Vibration",
        "pluginId": "cordova-plugin-vibration",
        "merges": [
            "navigator"
        ]
    },
    {
        "file": "plugins/cordova-plugin-vibration/www/vibration.js",
        "id": "cordova-plugin-vibration.notification",
        "pluginId": "cordova-plugin-vibration",
        "merges": [
            "navigator"
        ]
    },
    {
        "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
        "id": "cordova-sqlite-storage.SQLitePlugin",
        "pluginId": "cordova-sqlite-storage",
        "clobbers": [
            "SQLitePlugin"
        ]
    },
    {
        "file": "plugins/cordova-sqlite-storage/node_modules/cordova-sqlite-storage-dependencies/sql-asm-memory-growth.js",
        "id": "cordova-sqlite-storage.sql",
        "pluginId": "cordova-sqlite-storage",
        "runs": true
    },
    {
        "file": "plugins/cordova-sqlite-storage/src/browser/SQLiteProxy.js",
        "id": "cordova-sqlite-storage.SQLiteProxy",
        "pluginId": "cordova-sqlite-storage",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-device": "2.1.0",
    "cordova-plugin-geolocation": "5.0.0",
    "cordova-plugin-vibration": "3.1.1",
    "cordova-sqlite-storage": "6.1.0"
}
// BOTTOM OF METADATA
});