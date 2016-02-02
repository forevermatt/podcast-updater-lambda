/*
 * A collection of SYNCHRONOUS functions that are purely deterministic,
 * depending only on their input (rather than calling out somewhere to get
 * additional data to process).
 */


module.exports.isPodcastIdValid = function(id) {
  validIdRegEx = /^[-a-z0-9]{1,}$/;
  return validIdRegEx.test(id);
};
