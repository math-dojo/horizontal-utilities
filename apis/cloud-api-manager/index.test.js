const logger = new (require("./src/main/logging/custom_logger"))("cloud-api-manager-test:index");
// jshint esversion:6
const { describe, it } = require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const path = require('path');

const { tyk } = require('./src/test/resources/mock_cloud_provider_server/tyk');

describe("Index", function () {
    it("should exit with code 0 successfully run", function () {
        const successServer = tyk(0);

        const successServerAddress = `http://localhost:${successServer.address().port}`;

        const executionPromise = setupExecution({
            pathToAsset: path.resolve(process.cwd(), 'src/test/resources/sample_api_payload.js'),
            assetType: 'api',
            operation: 'create',
            baseUrlForProvider: successServerAddress
        })

        return Promise.all([expect(executionPromise).eventually.to.be.fulfilled])
            .finally(() => {
                logger.info(`now closing the server at ${successServerAddress}`);
                successServer.close(function () {
                    logger.info(`now closed server at ${successServerAddress}`);
                });
            });
    });

    it("should exit with code 1 successfully run", function () {

    });
})

function setupExecution({ pathToAsset, assetType, operation, baseUrlForProvider }) {
    const args = [
        `${path.resolve(process.cwd(), './index.js')}`,
        '--filePath',
        `${pathToAsset}`,
        '--operation',
        `${operation}`,
        '--type',
        `${assetType}`,
        '--provider',
        `tyk`,
        '--baseUrlForProvider',
        `${baseUrlForProvider}`
    ];
    const envVars = {
        "CLOUD_APIMGT_AUTHORISATION": "blabla"
    }
    const execConfig = {
        cwd: path.parse(process.cwd()).dir,
        windowsHide: true,
        env: envVars
    };

    return execFile('node', args, execConfig)
        .then(({ stderr, stdout }) => {
            logger.info(`successful execution`);
            logger.info(`stdout was: ${stdout}`);
            logger.info(`stderr was: ${stderr}`);

            return Promise.resolve({ stderr, stdout });
        })
        .catch((err) => {
            logger.error(`unsuccessful execution`);
            logger.error(`stdout was: ${err.stdout}`);
            logger.error(`stderr was: ${err.stderr}`);

            return Promise.reject(err);
        });
}