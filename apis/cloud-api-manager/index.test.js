const logger = new (require("./src/main/logging/custom_logger"))("cloud-api-manager-test:index");
// jshint esversion:6
const { describe, it } = require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const exec = util.promisify(require('child_process').exec);
const path = require('path');

const { tyk } = require('./src/test/resources/mock_cloud_provider_server/tyk');

describe("Index: CLI End-to-end Tests", function () {
    it("should exit with code 0 successfully run", function () {
        const successServer = tyk(0);

        const successServerAddress = `http://localhost:${successServer.address().port}`;

        const executionPromise = setupExecution({
            pathToAsset: path.resolve(process.cwd(), 'src/test/resources/sample_api_request_payload.json'),
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

    it("should exit with code 1 if unsuccessfully run", function () {
        const successServer = tyk(0, { disablePolicyCrudOps: true });

        const successServerAddress = `http://localhost:${successServer.address().port}`;

        const executionPromise = setupExecution({
            pathToAsset: path.resolve(process.cwd(), 'src/test/resources/sample_policy_request_payload.json'),
            assetType: 'policy',
            operation: 'update',
            baseUrlForProvider: successServerAddress
        })

        return Promise.all([
            expect(executionPromise).eventually.to.be.rejectedWith(/update operation failed because: (.*) 404/)
        ])
            .finally(() => {
                logger.info(`now closing the server at ${successServerAddress}`);
                successServer.close(function () {
                    logger.info(`now closed server at ${successServerAddress}`);
                });
            });
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

    process.env['CLOUD_APIMGT_AUTHORISATION'] = "blabla";
    /* The cloud-api-manager program by default does not log to the console so
        this needs to be selectively enabled via the DEBUG environment parameter 
        used to show the logs. */
    process.env['DEBUG'] = "cloud-api-manager*";

    const execConfig = {
        cwd: path.parse(process.cwd()).dir,
        windowsHide: true,
        env: process.env
    };

    return exec('which node')
        .then(({ stdout, stderr }) => {
            const nodeRegeEx = /\/(.+)\/node$/;
            const searchResult = nodeRegeEx.exec(stdout.trim());
            const nodeLocation = searchResult ? searchResult[0] : null;

            if (nodeLocation) {
                logger.info(`node executable found: ${stdout}`);
                return Promise.resolve(nodeLocation);
            }
            logger.error(`node could not be found because: ${stderr}`);
            return Promise.reject(new Error(`node could not be found because: ${stderr}`))

        })
        .then(nodeExecutableLocation =>
            execFile(nodeExecutableLocation, args, execConfig))
        .then(({ stderr, stdout }) => {
            logger.info(`successful execution`);
            logger.info(`stdout was: ${stdout}`);
            logger.info(`stderr was: ${stderr}`);

            return Promise.resolve({ stderr, stdout });
        })
        .catch((err) => {
            logger.error(`unsuccessful execution because: ${err.message}`);
            logger.error(`stdout was: ${err.stdout}`);
            logger.error(`stderr was: ${err.stderr}`);

            if (err.stderr) {
                return Promise.reject(new Error(`${err.stderr}`));
            }
            return Promise.reject(err);
        });
}
