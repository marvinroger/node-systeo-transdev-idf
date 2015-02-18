var isNode = function() {
  var node = false;
  if (typeof window === 'undefined') {
    node = true;
  }
  
  return node;
};

module.exports = {
  isNode: isNode
};