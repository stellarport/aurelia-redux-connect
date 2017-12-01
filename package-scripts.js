const {series, crossEnv, concurrent, rimraf} = require('nps-utils');

module.exports = {
    scripts: {
        default: 'nps webpack',
        transpile: series(
            rimraf('dist'),
            crossEnv('NODE_ENV=production babel src -d dist')
        ),
        test: {
            default: 'nps test.jest',
            jest: {
                default: crossEnv('BABEL_TARGET=node jest'),
                watch: crossEnv('BABEL_TARGET=node jest --watch')
            }
        }
    }
};
