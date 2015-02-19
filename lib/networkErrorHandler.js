var handle = function(err, res) {
  var error = { message: '' };

  if (err) {
    return err;
  } else if (res.statusCode != 200) {
    return new ServerError('Error code ' + res.statusCode);
  }
  
  return null;
};

module.exports = {
  handle: handle
};