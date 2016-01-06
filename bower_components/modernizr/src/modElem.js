define(['Modernizr', 'createElement'], function(Modernizr, createElement) {
  /**
   * Create our "modernizr.js" element that we do most feature tests on.
   *
   * @access private
   */

  var modElem = {
    elem : createElement('modernizr.js')
  };

  // Clean up this element
  Modernizr._q.push(function() {
    delete modElem.elem;
  });

  return modElem;
});
