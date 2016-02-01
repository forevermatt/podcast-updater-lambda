/**
 * AWS Module: Action: Modularized Code
 */

// Bring in the required libraries.
var asyncLib = require('../../../lib/async-lib.js');
var podcastUpdater = require('podcast-updater');
var s3Functions = require('../../../lib/s3-functions.js');
var utilities = require('../../../lib/utilities.js');

// Export For Lambda Handler
module.exports.run = function(event, context, mainCallback) {
  var podcastId = event;

  if ( ! utilities.isPodcastIdValid(podcastId)) {
    var error = new Error('Invalid podcast ID: "' + podcastId + '"');
    console.error(error);
    return mainCallback(error, null);
  } else {
    console.log('Podcast ID:', podcastId);
  }

  var config;
  var xmlFileName;

  /* Call the listed functions, passing the result of each one on to the next
   * one. We use apply to pass a parameter to the first function (see
   * "https://github.com/caolan/async/issues/14" for details).  */
  asyncLib.waterfall(
    [
      asyncLib.apply(
        s3Functions.getFileFromS3,
        {
          Bucket: process.env.PODCASTS_BUCKET,
          Key: process.env.PODCASTS_FOLDER + '/' + podcastId + '/config.json'
        }
      ),
      function(configJson, callback) {
        config = JSON.parse(configJson);
        xmlFileName = config.target || 'feed.xml';
        return callback(null, config);
      },
      podcastUpdater.generatePodcastXml,
      // function(err, xml) {
      //   console.log(process.env.PODCASTS_BUCKET);
      //   console.log(process.env.PODCASTS_FOLDER + '/' + podcastId + '/' + xmlFileName);
      // },
      function(xml, callback) {
        s3Functions.putFileToS3(
          process.env.PODCASTS_BUCKET,
          process.env.PODCASTS_FOLDER + '/' + podcastId + '/' + xmlFileName,
          xml,
          callback
        );
      }
    ],
    function(error, data) {
      if (error) {
        console.error(error);
        return mainCallback(error, data);
      }
      console.log(data);
      return mainCallback(null, data);
    }
  );
};
