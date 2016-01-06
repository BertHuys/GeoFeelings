/*!
{
  "name": "CSS Stylable Scrollbars",
  "property": "cssscrollbar",
  "tags": ["css"],
  "builderAliases": ["css_scrollbars"]
}
!*/
define(['Modernizr', 'testStyles', 'prefixes'], function(Modernizr, testStyles, prefixes) {
  testStyles('#modernizr.js{overflow: scroll; width: 40px; height: 40px; }#' + prefixes
    .join('scrollbar{width:0px}' + ' #modernizr.js::')
    .split('#')
    .slice(1)
    .join('#') + 'scrollbar{width:0px}',
  function(node) {
    Modernizr.addTest('cssscrollbar', node.scrollWidth == 40);
  });
});
