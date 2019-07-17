const shelljs = require('shelljs');
const argv = require('yargs').argv;
const env = argv.env;

console.log('Copy package*.json')
shelljs.cp('-f', 'package*.json', './dist');

console.log(`Rename /dist/environments/environment${'.'+env}.js to /dist/environments/environment.js`)
shelljs.mv(`dist/environments/environment${'.'+env}.js`, 'dist/environments/environment.js');