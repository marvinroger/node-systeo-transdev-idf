var handle = function(err, res) {
  var error = { message: '' };

  if (err) {
    return new Error('Network error: ' + err.message);
  } else if (res.statusCode != 200) {
    return new Error('Server error: code ' + res.statusCode);
  }
  
  return null;
};

module.exports = {
  handle: handle
};