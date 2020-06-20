// jshint esversion:6
"use-strict";
const { describe, it } = require("mocha");
const sinon = require('sinon');
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

const { tykApiSearchResponseData, tykApiResponseData } = require("../resources/sample_api_payload");
const { tykFindPolicyByNameResponseData, retrievePolicyByIdResponseData
} = require("../resources/sample_policy_payloads");

Object.freeze(tykFindPolicyByNameResponseData);
Object.freeze(tykApiResponseData);
Object.freeze(tykApiSearchResponseData);
Object.freeze(retrievePolicyByIdResponseData);

const { CloudApiManagerController } = require("../../main/controllers/cloud_api_manager");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("CloudApiManagerController", function () {
    describe("Initialisation", function () {
        it("should return a new CloudApiManagerController if successful", function () {
            const returnedController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            expect(returnedController).to.be.instanceOf(CloudApiManagerController);
        });
        it("should throw an error if authorisation is null or empty", function () {
            expect(() => new CloudApiManagerController({ provider: 'tyk', authorisation: '' })).to.throw(
                `authorisation cannot be undefined, null or empty`
            );
            expect(() => new CloudApiManagerController({ provider: 'tyk' })).to.throw(
                `authorisation cannot be undefined, null or empty`
            );
        });
        it("should throw an error if the request provider is null or empty", function () {
            expect(() => new CloudApiManagerController({ authorisation: 'fizz' })).to.throw(
                `the specified provider "undefined" is not configured in this package`
            );
            expect(() => new CloudApiManagerController({ provider: '', authorisation: 'fizz' })).to.throw(
                `the specified provider "" is not configured in this package`
            );
        });
        it("should throw an error if the request provider is unknown", function () {
            const provider = 'kong';
            expect(() => new CloudApiManagerController({ provider: provider, authorisation: 'fizz' })).to.throw(
                `the specified provider "${provider}" is not configured in this package`
            );
        });
    });
    describe(".findAssetIdentifier", function () {
        it("apis: should return an id if the provider search returns one possibility", function () {
            const nameToSearchFor = tykApiSearchResponseData.apis[0].api_definition.name;
            const expectedSystemId = tykApiSearchResponseData.apis[0].api_definition.id;

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            const findApiByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findApiByName");
            findApiByNameProviderStub.returns(Promise.resolve(tykApiSearchResponseData));

            const systemIdPromise = testController.findAssetIdentifier('api', { api_definition: { name: nameToSearchFor } });
            return expect(systemIdPromise).to.eventually.equal(expectedSystemId);
        });
        it("apis: should return an id if the provider search returns multiple possibilities", function () {
            const nameToSearchFor = tykApiResponseData.api_definition.name;
            const expectedSystemId = tykApiResponseData.api_definition.id;
            const multipleResults = {
                apis: [
                    JSON.parse(JSON.stringify(tykApiResponseData)),
                    JSON.parse(JSON.stringify(tykApiResponseData))
                ]
            };
            multipleResults.apis[1].api_definition.name = multipleResults.apis[1].api_definition.name + " a small change";
            multipleResults.apis[1].api_definition.id = "a_different_id";

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            const findApiByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findApiByName");
            findApiByNameProviderStub.returns(Promise.resolve(multipleResults));

            const systemIdPromise = testController.findAssetIdentifier('api', { api_definition: { name: nameToSearchFor } });
            return expect(systemIdPromise).to.eventually.equal(expectedSystemId);

        });
        it("apis: should return a rejected promise nothing was found", function () {
            const nameToSearchFor = tykApiSearchResponseData.apis[0].api_definition.name;

            const returnedResults = { apis: [] };
            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            const findApiByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findApiByName");
            findApiByNameProviderStub.returns(Promise.resolve(returnedResults));

            const systemIdPromise = testController.findAssetIdentifier('api', { api_definition: { name: nameToSearchFor } });
            return expect(systemIdPromise).to.eventually.be.rejectedWith(/the asset with name (.*) does not exist/);
        });
        it("policies: should return an id if the provider search returns one possibility", function () {
            const nameToSearchFor = tykFindPolicyByNameResponseData.Data[0].name;
            const expectedSystemId = tykFindPolicyByNameResponseData.Data[0]._id;

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            const findPolicyByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findPolicyByName");
            findPolicyByNameProviderStub.returns(Promise.resolve(tykFindPolicyByNameResponseData));

            const systemIdPromise = testController.findAssetIdentifier('policy', { name: nameToSearchFor });
            return expect(systemIdPromise).to.eventually.equal(expectedSystemId);
        });
        it("policies: should return an id if the provider search returns multiple possibilities", function () {
            const nameToSearchFor = tykFindPolicyByNameResponseData.Data[0].name;
            const expectedSystemId = tykFindPolicyByNameResponseData.Data[0]._id;
            const multipleResults = {
                Data: [
                    JSON.parse(JSON.stringify(tykFindPolicyByNameResponseData.Data[0])),
                    JSON.parse(JSON.stringify(tykFindPolicyByNameResponseData.Data[0]))
                ]
            };
            multipleResults.Data[1].name = multipleResults.Data[1].name + " a small change";
            multipleResults.Data[1]._id = "a_different_id";

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            const findPolicyByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findPolicyByName");
            findPolicyByNameProviderStub.returns(Promise.resolve(multipleResults));

            const systemIdPromise = testController.findAssetIdentifier('policy', { name: nameToSearchFor });
            return expect(systemIdPromise).to.eventually.equal(expectedSystemId);
        });
        it("policies: should return a rejected promise nothing was found", function () {
            const nameToSearchFor = tykFindPolicyByNameResponseData.Data[0].name;

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            const findPolicyByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findPolicyByName");
            findPolicyByNameProviderStub.returns(Promise.resolve({ Data: [] }));

            const systemIdPromise = testController.findAssetIdentifier('policy', { name: nameToSearchFor });
            return expect(systemIdPromise).to.eventually.be.rejectedWith(/the asset with name (.*) does not exist/);
        });
    });
    describe(".create", function () {
        it("apis: should resolve with {status:ok} if no api with similar name and operation succeeds", function () {
            const { name, auth, definition, version_data, proxy } = tykApiResponseData.api_definition;
            const sample_api_payload = {
                api_definition: { name, auth, definition, version_data, proxy }
            };
            const returnedSearchResults = { apis: [] };

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });

            const findApiByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findApiByName");
            findApiByNameProviderStub.returns(Promise.resolve(returnedSearchResults));

            const createApiProviderStub = sinon.stub(testController.apiServiceProvider, "createApi");
            createApiProviderStub.withArgs(sample_api_payload).returns(Promise.resolve({ status: "ok" }));

            const creationResponsePromise = testController.create('api', Promise.resolve(sample_api_payload));

            return expect(creationResponsePromise).to.eventually.have.property("status").equal("ok");
        });
        it("apis: should reject with error if no api with similar name but operation fails", function () {
            const { name, auth, definition, version_data, proxy } = tykApiResponseData.api_definition;
            const sample_api_payload = {
                api_definition: { name, auth, definition, version_data, proxy }
            };
            const returnedSearchResults = { apis: [] };

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });

            const findApiByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findApiByName");
            findApiByNameProviderStub.returns(Promise.resolve(returnedSearchResults));

            const createApiProviderStub = sinon.stub(testController.apiServiceProvider, "createApi");
            const apiCreateProviderError = new Error(`.createApi failed because: some generic error`);
            createApiProviderStub.withArgs(sample_api_payload)
                .returns(Promise.reject(apiCreateProviderError));

            const creationResponsePromise = testController.create('api', Promise.resolve(sample_api_payload));

            return expect(creationResponsePromise).to.eventually.be.rejectedWith(
                /create operation failed because: (.*) some generic error/);
        });
        it("apis: should reject with error if api with similar name", function () {
            const { name, auth, definition, version_data, proxy } = tykApiResponseData.api_definition;

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            const findApiByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findApiByName");
            findApiByNameProviderStub.returns(Promise.resolve(tykApiSearchResponseData));

            const creationResponsePromise = testController.create('api', Promise.resolve({
                api_definition: { name, auth, definition, version_data, proxy }
            }));

            return expect(creationResponsePromise).to.eventually.be.rejectedWith(
                /create operation failed because: an asset with name (.*) already exists/);
        });
        it("policies: should resolve with {status:ok} if no policy with similar name and operation succeeds", function () {
            const { name, access_rights, active } = tykFindPolicyByNameResponseData.Data[0];
            const policyCreatePayload = {
                name, access_rights, active
            };

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            const findPolicyByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findPolicyByName");
            findPolicyByNameProviderStub.returns(Promise.resolve({ Data: [] }));

            const createPolicyProviderStub = sinon.stub(testController.apiServiceProvider, "createPolicy");
            createPolicyProviderStub.withArgs(policyCreatePayload)
                .returns(Promise.resolve({ status: "ok" }));

            const creationResponsePromise = testController.create('policy', Promise.resolve(policyCreatePayload));

            return expect(creationResponsePromise).to.eventually.have.property("status").equal("ok");
        });
        it("policies: should reject with error if no policy with similar name but operation fails", function () {
            const { name, access_rights, active } = tykFindPolicyByNameResponseData.Data[0];
            const policyCreatePayload = {
                name, access_rights, active
            };

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            const findPolicyByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findPolicyByName");
            findPolicyByNameProviderStub.returns(Promise.resolve({ Data: [] }));

            const createPolicyProviderStub = sinon.stub(testController.apiServiceProvider, "createPolicy");
            const policyCreateProviderError = new Error(`.createPolicy failed because: some generic error`);
            createPolicyProviderStub.withArgs(policyCreatePayload)
                .returns(Promise.reject(policyCreateProviderError));

            const creationResponsePromise = testController.create('policy', Promise.resolve(policyCreatePayload));

            return expect(creationResponsePromise).to.eventually.be.rejectedWith(
                /create operation failed because: (.*) some generic error/);
        });
        it("policies: should reject with error if policy with similar name", function () {
            const { name, access_rights, active } = tykFindPolicyByNameResponseData.Data[0];

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            const findPolicyByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findPolicyByName");
            findPolicyByNameProviderStub.returns(Promise.resolve(tykFindPolicyByNameResponseData));

            const creationResponsePromise = testController.create('policy', Promise.resolve({
                name, access_rights, active
            }));

            return expect(creationResponsePromise).to.eventually.be.rejectedWith(
                /create operation failed because: an asset with name (.*) already exists/);
        });
    });
    describe(".update", function () {
        it("apis: should resolve with {status:ok} if api with similar name and operation succeeds", function () {
            const { name, auth, definition, version_data, proxy } = tykApiSearchResponseData.apis[0].api_definition;
            const sample_api_payload = {
                api_definition: { name, auth, definition, version_data, proxy }
            };
            const returnedSearchResults = tykApiSearchResponseData;

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            const findApiByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findApiByName");
            findApiByNameProviderStub.returns(Promise.resolve(returnedSearchResults));

            const updateAPiBySystemIdProviderStub = sinon.stub(testController.apiServiceProvider, "updateApiBySystemId");
            updateAPiBySystemIdProviderStub.withArgs(sinon.match.string, sample_api_payload)
                .returns(Promise.resolve({ status: "ok" }));

            const updateResponsePromise = testController.update('api', Promise.resolve(sample_api_payload));

            return expect(updateResponsePromise).to.eventually.have.property("status").equal("ok");
        });
        it("apis: should reject with error if api with similar name but operation fails", function () {
            const { name, auth, definition, version_data, proxy } = tykApiSearchResponseData.apis[0].api_definition;
            const sample_api_payload = {
                api_definition: { name, auth, definition, version_data, proxy }
            };
            const returnedSearchResults = tykApiSearchResponseData;

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            const findApiByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findApiByName");
            findApiByNameProviderStub.returns(Promise.resolve(returnedSearchResults));

            const updateAPiBySystemIdProviderStub = sinon.stub(testController.apiServiceProvider, "updateApiBySystemId");
            const errorReason = ".updateApiBySystemId failed because: some generic error";
            const apiUpdateProviderError = new Error(errorReason);
            updateAPiBySystemIdProviderStub.withArgs(sinon.match.string, sample_api_payload)
                .returns(Promise.reject(apiUpdateProviderError));

            const updateResponsePromise = testController.update('api', Promise.resolve(sample_api_payload));

            return expect(updateResponsePromise).to.eventually.be.rejectedWith(
                new RegExp(`update operation failed because: (.*)${errorReason}`));
        });
        it("apis: should reject with error if no api with similar name", function () {
            const { name, auth, definition, version_data, proxy } = tykApiResponseData.api_definition;

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            const findApiByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findApiByName");
            findApiByNameProviderStub.returns(Promise.resolve({ apis: [] }));

            const updateResponsePromise = testController.update('api', Promise.resolve({
                api_definition: { name, auth, definition, version_data, proxy }
            }));

            return expect(updateResponsePromise).to.eventually.be.rejectedWith(
                /update operation failed because: the asset with name (.*) does not exist/);
        });
        it("policies: should resolve with {status:ok} if policy with similar name and operation succeeds");
        it("policies: should reject with error if policy with similar name but operation fails");
        it("policies: should reject with error if no policy with similar name", function () {
            const { name, access_rights, active } = tykFindPolicyByNameResponseData.Data[0];
            const sample_policy_payload = { name, access_rights, active };

            const testController = new CloudApiManagerController({ provider: 'tyk', authorisation: 'fizzbuzz' });
            const findPolicyByNameProviderStub = sinon.stub(testController.apiServiceProvider, "findPolicyByName");
            findPolicyByNameProviderStub.returns(Promise.resolve({ Data: [] }));

            const updateResponsePromise = testController.update('policy', Promise.resolve(sample_policy_payload));

            return expect(updateResponsePromise).to.eventually.be.rejectedWith(
                /update operation failed because: the asset with name (.*) does not exist/);
        });
    });
    describe(".delete", function () {
        it("apis: should resolve with {status:ok} if api with similar name and operation succeeds");
        it("apis: should reject with error if api with similar name but operation fails");
        it("apis: should reject with error if no api with similar name");
        it("policies: should resolve with {status:ok} if policy with similar name and operation succeeds");
        it("policies: should reject with error if policy with similar name but operation fails");
        it("policies: should reject with error if no policy with similar name");
    });
});

