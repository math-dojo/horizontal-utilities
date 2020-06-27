#!/usr/bin/env node
const logger = new (require('./src/main/logging/custom_logger'))("cloud-api-manager:index");

const argv = require('yargs')
    .alias('f', 'filePath')
    .nargs('f', 1)
    .describe('f', 'path to the file to be processed by the cli')
    .normalize('f')
    .alias('o', 'operation')
    .nargs('o', 1)
    .describe('o', 'the operation to perform with the submitted file')
    .choices('o', ['create', 'update', 'delete'])
    .alias('t', 'type')
    .nargs('t', 1)
    .describe('t', 'the type of file being submitted')
    .choices('t', ['api', 'policy'])
    .alias('p', 'provider')
    .nargs('p', 1)
    .describe('p', 'the provider of the cloud api management service')
    .choices('p', ['tyk'])
    .default('p', 'tyk')
    .alias('b', 'baseUrlForProvider')
    .nargs('b', 1)
    .describe('b', ('the base url for the cloud provider. The libraries assume defaults'
        + ' which can be overwritten using this parameter'))
    .env('CLOUD_APIMGT')
    .alias('a', 'authorisation')
    .describe('a', 'the authorisation credential that must be presented on interactions with the cloud provider.'
        + ' It can also be set as an environment parameter: CLOUD_APIMGT_AUTHORISATION.')
    .usage("$0 --filePath ./path-to-file-relative-to-cwd --operation [create|update|delete] --type [api|policy]")
    .demandOption(['f', 'o', 't'], 'Please provide both file, operation and type arguments to work with this tool')
    .epilogue('**warning**: be sure to set the authorisation parameter either via the environment or via the cli.')
    .help()
    .argv;

const { CloudApiManagerController } = require('./src/main/controllers/cloud_api_manager');

function main({ filePath, operation, type, provider, authorisation, baseUrlForProvider }) {
    const controller = new CloudApiManagerController({ provider, authorisation, baseUrlForProvider });
    return controller.execute({ filePath, operation, type })
        .then(result => {
            logger.info(`success: ${operation} for ${type} asset with provider ${provider} at ${baseUrlForProvider} succeeded`);
        })
        .catch(error => {
            logger.error(`failure: ${operation} for ${type} asset with provider ${provider} at ${baseUrlForProvider} failed`);
            process.exitCode = 1;
        });
}
