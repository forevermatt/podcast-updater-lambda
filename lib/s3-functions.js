/* Copied/adapted from "https://bitbucket.org/silintl/jaws-cornerstone-insite-middleware/" */

// Enable retrieving objects from S3.
var aws = require('aws-sdk');
var s3 = new aws.S3({ apiVersion: '2006-03-01' });

module.exports.deleteFileFromS3 = function(bucket, key, callback) {
  var params = {
    Bucket: bucket,
    Key: key
  };
  s3.deleteObject(params, function(err, data) {
    if (err) {
      var errorMessage = 'Error deleting object "' + key + '" from bucket ' +
        '"' + params.Bucket + '".';
      console.error(errorMessage);
      console.error(err);
      return callback(new Error(errorMessage), null);
    } else {
      console.log('(S3) Deleted "' + bucket + '/' + key + '".');
      return callback(null, true);
    }
  });
};

module.exports.getS3ParamsFromEvent = function(event, callback) {
  var bucket = event.Records[0].s3.bucket.name;
  var key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  var params = {
    Bucket: bucket,
    Key: key
  };
  callback(null, params);
};

module.exports.getFileFromS3 = function(params, callback) {
  s3.getObject(params, function(err, data) {
    if (err) {
      var errorMessage = 'Error getting object "' + params.Key + '" from ' +
        'bucket "' + params.Bucket + '". Make sure they exist and that your ' +
        'bucket is in the same region as this function.';
      console.error(errorMessage);
      console.error(err);
      return callback(new Error(errorMessage), null);
    } else {
      console.log('(S3) Retrieved "' + params.Bucket + '/' + params.Key + '".');
      return callback(null, data.Body.toString());
    }
  });
};

module.exports.putFileToS3WithAclAndContentType = function(
  bucket,
  key,
  acl,
  contentType,
  data,
  callback
) {
  var params = {
    Bucket: bucket,
    Key: key,
    Body: data,
    ACL: acl,
    ContentType: contentType
  };
  s3.putObject(params, function(err, data) {
    if (err) {
      var errorMessage = 'Error putting object "' + key + '" to bucket ' +
        '"' + params.Bucket + '" with ACL "' + acl + '".';
      console.error(errorMessage);
      console.error(err);
      return callback(new Error(errorMessage), null);
    } else {
      console.log(
        '(S3) Uploaded to "' + bucket + '/' + key + '" with ACL "' + acl + '".'
      );
      return callback(null, true);
    }
  });
};
