// this file configures require.js based on enviroment
'use strict';

/* jshint -W117 */
var inBrowser = typeof define == 'function' && typeof define.amd == 'object';
/* jshint -W117 */

var _extend = function(a, b) {
  for (var prop in b) {
    var supplied = b[prop];
    if (typeof supplied === 'object') {
      a[prop] == a[prop] || {};
      _extend(a[prop], supplied);
    } else {
      a[prop] = b[prop];
    }
  }
};


var requireConfig = {
  optimize: 'none',
  generateSourceMaps: false,
  optimizeCss: 'none',
  useStrict: true,
  include: ['modernizr.js-init'],
  fileExclusionRegExp: /^(.git|node_modules|modulizr|media|test)$/,
  wrap: {
    start: '\n;(function(window, document, undefined){',
    end: '})(window, document);'
  },
  onBuildWrite: function(id, path, contents) {
    if (this.optimize === 'uglify2') {
      // strip out documentation comments
      contents = contents.replace(/\/\*\![\s\S]*\!\*\//m, '');
    }

    if ((/define\(.*?\{/).test(contents)) {
      // remove AMD ceremony for use without require.js or almond.js
      contents = contents.replace(/define\(.*?\{/, '');

      contents = contents.replace(/\}\);\s*?$/, '');

      if (!contents.match(/Modernizr\.add(Async)?Test\(/)) {
        // remove last return statement and trailing })
        contents = contents.replace(/return.*[^return]*$/, '');
      }
    } else if ((/require\([^\{]*?\{/).test(contents)) {
      contents = contents.replace(/require[^\{]+\{/, '');
      contents = contents.replace(/\}\);\s*$/, '');
    }

    contents = contents.replace(/return addTest;/, '');

    return contents;
  }
};

function build(generate, generateBanner, pkg) {
  return function build(config, cb) {
    config = config || {};
    cb = cb || function noop() {};
    var banner;

    requireConfig.rawText = {
      'modernizr-init': generate(config)
    };

    if (config.minify) {
      banner = generateBanner('compact', config);
      requireConfig.optimize = 'uglify2';
      requireConfig.uglify2 = {
        mangle: {
          except: ['Modernizr']
        },
        beautify: {
          ascii_only: true
        }
      };
    } else {
      banner = generateBanner('full', config);
      requireConfig.optimize = 'none';
    }

    requireConfig.out = function(output) {
      output = banner + output;

      // Remove `define('modernizr.js-init' ...)` and `define('modernizr.js-build' ...)`
      output = output.replace(/(,\s*)?define\("modernizr-(init|build)",\s*function\(\)\{\};?\)/g, '');
      output = output.replace(/__VERSION__/g, pkg.version);

      // Hack the prefix into place. Anything is way too big for something so small.
      if (config && config.classPrefix) {
        output = output.replace(/(classPrefix'?\s?:\s?)['""']{2}(,)/, '$1"' + config.classPrefix.replace(/"/g, '\\"') + '"$2');
      }

      cb(output);

    };

    requirejs.optimize(requireConfig);
  };
}

if (inBrowser) {
  var suppliedConfig = self._modernizrConfig;
  var metadataUrl = 'i/js/metadata.json';
  var packageUrl = 'i/js/modernizr.js-git/package.json';
  requireConfig.baseUrl = '/i/js/modernizr.js-git/src';
  requireConfig.paths = {
    text: '/i/js/requirejs-plugins/lib/text',
    lib: '/i/js/modernizr.js-git/lib',
    json: '/i/js/requirejs-plugins/src/json',
    lodash: '/i/js/lodash',
    test: '/i/js/modernizr.js-git/feature-detects'
  };

  if (suppliedConfig) {
    metadataUrl = suppliedConfig.metadataUrl || metadataUrl;
    packageUrl = suppliedConfig.packageUrl || packageUrl;
    _extend(requireConfig, suppliedConfig);
  }

  if (self._modernizrMetadata) {
    requirejs.define('metadata', [], function() {return self._modernizrMetadata;});
  } else {
    requirejs.define('metadata', ['json!' + metadataUrl], function(pkg) {return pkg;});
  }
  requirejs.define('package', ['json!' + packageUrl], function(pkg) {return pkg;});
} else {
  var requirejs = require('requirejs');
  var metadata = require('./metadata')();
  var pkg = require('../package.json');

  requirejs.define('metadata', [], function() {return metadata;});
  requirejs.define('package', function() {return pkg;});

  requireConfig.baseUrl = __dirname + '/../src';
  requireConfig.paths = {
    lodash: __dirname + '/../node_modules/lodash/index',
    test: __dirname + '/../feature-detects',
    lib: __dirname
  };
}

requirejs.config(requireConfig);

if (inBrowser) {
  define('build', ['generate', 'lib/generate-banner', 'package'], build);
} else {
  var generateBanner = requirejs(__dirname + '/generate-banner.js');
  var generate = requirejs('generate');
  var pkg = requirejs('package');
  var _build = build;
  module.exports = function build() {
    return _build(generate, generateBanner, pkg).apply(undefined, arguments);
  };
}
