cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-sqlite-storage.SQLitePlugin",
      "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
      "pluginId": "cordova-sqlite-storage",
      "clobbers": [
        "SQLitePlugin"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-vibration": "3.1.1",
    "cordova-sqlite-storage": "6.1.0"
  };
});