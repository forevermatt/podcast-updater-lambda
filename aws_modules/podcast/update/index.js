/**
 * AWS Module: Action: Modularized Code
 */

// Bring in the required libraries.
//var asyncLib = require('../../lib/async-lib.js');
//var podcastUpdater = require('podcast-updater');
//var s3Functions = require('../../lib/s3-functions.js');

// Export For Lambda Handler
module.exports.run = function(event, context, cb) {
  return cb(null, action(event));
};

// Your Code
var action = function(event) {
  var result = {
    message: 'PodcastUpdaterLambda executed successfully!',
    event: event
  };
  console.log(result);
  return result;
};
