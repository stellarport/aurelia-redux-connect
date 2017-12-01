// this file will be used by default by babel@7 once it is released
module.exports = {
  "plugins": [
    "transform-decorators-legacy",
    "transform-class-properties",
    "transform-object-rest-spread",
    "transform-es2015-shorthand-properties",
    "transform-es2015-computed-properties"
  ],
  "presets": [
    [
      "env", {
        "targets": process.env.BABEL_TARGET === 'node' ? {
          "node": 'current'
        } : {
          "browsers": [
            "last 2 versions",
            "not ie <= 11"
          ],
          "uglify": false,
        },
        "loose": true,
        "modules": 'commonjs',
        "useBuiltIns": true
      }
    ]
  ]
};
