const pinoDebug = require('pino-debug')
const logger = require('pino')({level: process.env.LEVEL || 'info'}, process.stderr);

const nameSpaces = [
  'cloud-api-manager:services:tyk_dashboard.service',
];

let debugMap = {
  '*': 'trace' // other items as tracelogs by default
};

nameSpaces.forEach(eachNameSpace => {
  debugMap[`${eachNameSpace}:info`] = "info";
  debugMap[`${eachNameSpace}:error`] = "debug";
});

pinoDebug(logger, {
  auto: true, // default
  map: debugMap
});

