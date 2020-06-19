// jshint esversion:6
const { describe, it } = require("mocha");
const nock = require('nock');
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

const { tykApiResponseData, tykDeleteApiResponse, tykUpdateApiResponseData,
    tykCreateApiResponseData, tykCreateApiRequestObject, tykUpdateApiRequestObject,
    tykApiSearchResponseData } = require("../resources/sample_api_payload");

const { tykFindPolicyByNameResponseData, retrievePolicyByIdResponseData,
    createPolicyRequestObject, createPolicyResponseData, updatePolicyByIdRequestObject,
    updatePolicyByIdResponseData, deletePolicyByIdResponseData
 } = require("../resources/sample_policy_payloads");

const { TykDashboardService } =  require("../../main/services/tyk_dashboard");

const AUTHORISATION_HEADER_NAME = 'authorization';

describe("TykDashboardService", function() {
    const baseUrl = 'https://admin.cloud.tyk.io';
    const authorisationToken = 'hush';
    const tykDashboardService = new TykDashboardService(authorisationToken, baseUrl);

    describe("Api Operations", function() {
        it('successful .findApiByName should return apiDataResponse{}', function() {
            const scope = nock(baseUrl).get("/api/apis/search")
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .query({q: 'myApiName'})
                .reply(200, tykApiSearchResponseData,
                {
                    "Content-Type": "application/json"
                });
            const apiDataResponse = tykDashboardService.findApiByName('myApiName');
            return Promise.all([
                expect(apiDataResponse).to.eventually.deep.equal(tykApiSearchResponseData)
            ]);
            
        });
        it('unsuccessful .findApiByName should return rejected promise', function() {
            const apiNameToSearchFor = 'myApiName';
            const scope = nock(baseUrl).get("/api/apis/search")
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .query({q: apiNameToSearchFor})
                .reply(400, "some generic error");
            const apiDataResponse = tykDashboardService.findApiByName('myApiName');
            return Promise.all([
                expect(apiDataResponse).to.eventually.be.rejected
            ]);
            
        });

        it('.findApiByName should return a rejected promise if name is null or empty', function() {
            return Promise.all([
                expect((() => tykDashboardService.findApiByName(''))()).to.eventually.be.rejectedWith(
                    ".findApiByName must have a name to search for which is currently null or empty"),
                expect((() => tykDashboardService.findApiByName(null))()).to.eventually.be.rejectedWith(
                    ".findApiByName must have a name to search for which is currently null or empty"),
                expect((() => tykDashboardService.findApiByName(undefined))()).to.eventually.be.rejectedWith(
                    ".findApiByName must have a name to search for which is currently null or empty"),                 
            ]);
            
        });
    
        it('successful .findApiBySystemId should return apiDataResponse{}', function() {
            const mockDataResponse = tykApiResponseData;
            const scope = nock(baseUrl).get(/\/api\/apis\/([A-z]?[0-9]?)+$/)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(200, mockDataResponse,
                {
                    "Content-Type": "application/json"
                });
            const apiDataResponse = tykDashboardService.findApiBySystemId('myApiId');
            return Promise.all([
                expect(apiDataResponse).to.eventually.deep.equal(mockDataResponse)
            ]);
            
        });
        it('unsuccessful .findApiBySystemId should return rejected promise', function() {
            const scope = nock(baseUrl).get(/\/api\/apis\/([A-z]?[0-9]?)+$/)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(400, "some generic error");
            const apiDataResponse = tykDashboardService.findApiBySystemId('myUnknownApiId');
            return Promise.all([
                expect(apiDataResponse).to.eventually.be.rejected
            ]);
            
        });
    
        it('successful .deleteApiBySystemId should return deleteResponse with OK status', function() {
            const mockDataResponse = tykDeleteApiResponse;
            const scope = nock(baseUrl).delete(/\/api\/apis\/([A-z]?[0-9]?)+$/)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(204, mockDataResponse,
                {
                    "Content-Type": "application/json"
                });
            const apiDeleteResponse = tykDashboardService.deleteApiBySystemId('myApiId');
            return Promise.all([
                expect(apiDeleteResponse).to.eventually.have.property("status").equal("ok")
            ]);
            
        });
        it('unsuccessful .deleteApiBySystemId should return rejected promise', function() {
            const scope = nock(baseUrl).delete(/\/api\/apis\/([A-z]?[0-9]?)+$/)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(400, "some generic error");
            const apiDataResponse = tykDashboardService.deleteApiBySystemId('myUnknownApiId');
            return Promise.all([
                expect(apiDataResponse).to.eventually.be.rejected
            ]);
            
        });
        it('successful .updateApiBySystemId should return updateResponse with OK status', function() {
            const mockDataResponse = tykUpdateApiResponseData;
            const scope = nock(baseUrl).put(/\/api\/apis\/([A-z]?[0-9]?)+$/, tykUpdateApiRequestObject)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(204, mockDataResponse,
                {
                    "Content-Type": "application/json"
                });
            const apiDeleteResponse = tykDashboardService.updateApiBySystemId('myApiId', tykUpdateApiRequestObject);
            return Promise.all([
                expect(apiDeleteResponse).to.eventually.have.property("status").equal("ok")
            ]);
            
        });
        it('unsuccessful .updateApiBySystemId should return rejected promise', function() {
            const scope = nock(baseUrl).put(/\/api\/apis\/([A-z]?[0-9]?)+$/, tykUpdateApiRequestObject)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(400, "some generic error");
            const apiDataResponse = tykDashboardService.updateApiBySystemId('myUnknownApiId', tykUpdateApiRequestObject);
            return Promise.all([
                expect(apiDataResponse).to.eventually.be.rejected
            ]);
            
        });
    
        it('successful .createApi should return createResponse with OK status', function() {
            const mockDataResponse = tykCreateApiResponseData;
            const scope = nock(baseUrl).post(/\/api\/apis$/, tykCreateApiRequestObject)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(201, mockDataResponse,
                {
                    "Content-Type": "application/json"
                });
            const apiCreateResponse = tykDashboardService.createApi(tykCreateApiRequestObject);
            return Promise.all([
                expect(apiCreateResponse).to.eventually.have.property("status").equal("ok")
            ]);
            
        });
        it('unsuccessful .createApi should return rejected promise', function() {
            const scope = nock(baseUrl).post(/\/api\/apis$/, tykCreateApiRequestObject)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(400, "some generic error");
            const apiDataResponse = tykDashboardService.createApi(tykCreateApiRequestObject);
            return Promise.all([
                expect(apiDataResponse).to.eventually.be.rejectedWith(/some generic error/)
            ]);
            
        });
    });

    describe("Policy Operations", function() {
        it('successful .findPolicyByName should return policyDataResponse{}', function() {
            const mockDataResponse = tykFindPolicyByNameResponseData;
            const policyNameToSearchFor = 'myPolicyName';
            const scope = nock(baseUrl).get("/api/portal/policies/search")
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .query({q: policyNameToSearchFor})
                .reply(200, mockDataResponse,
                {
                    "Content-Type": "application/json"
                });
            const apiDataResponse = tykDashboardService.findPolicyByName(policyNameToSearchFor);
            return Promise.all([
                expect(apiDataResponse).to.eventually.deep.equal(mockDataResponse)
            ]);
            
        });
        it('unsuccessful .findPolicyByName should return rejected promise', function() {
            const policyNameToSearchFor = 'myPolicyName';
            const scope = nock(baseUrl).get("/api/portal/policies/search")
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .query({q: policyNameToSearchFor})
                .reply(400, "some generic error");
            const apiDataResponse = tykDashboardService.findPolicyByName(policyNameToSearchFor);
            return Promise.all([
                expect(apiDataResponse).to.eventually.be.rejected
            ]);
            
        });

        it('.findPolicyByName should return a rejected promise if name is null or empty', function() {
            return Promise.all([
                expect((() => tykDashboardService.findPolicyByName(''))()).to.eventually.be.rejectedWith(
                    ".findPolicyByName must have a name to search for which is currently null or empty"),
                expect((() => tykDashboardService.findPolicyByName(null))()).to.eventually.be.rejectedWith(
                    ".findPolicyByName must have a name to search for which is currently null or empty"),
                expect((() => tykDashboardService.findPolicyByName(undefined))()).to.eventually.be.rejectedWith(
                    ".findPolicyByName must have a name to search for which is currently null or empty"),                 
            ]);
            
        });

        it('successful .findPolicyById should return policyDataResponse{}', function() {
            const mockDataResponse = retrievePolicyByIdResponseData;
            const policyNameToSearchFor = 'myPolicyId';
            const scope = nock(baseUrl).get(/api\/portal\/policies\/([A-z]?[0-9]?)+$/)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(200, mockDataResponse,
                {
                    "Content-Type": "application/json"
                });
            const apiDataResponse = tykDashboardService.findPolicyById(policyNameToSearchFor);
            return Promise.all([
                expect(apiDataResponse).to.eventually.deep.equal(mockDataResponse)
            ]);
            
        });
        it('unsuccessful .findPolicyById should return rejected promise', function() {
            const policyNameToSearchFor = 'myPolicyId';
            const scope = nock(baseUrl).get(/api\/portal\/policies\/([A-z]?[0-9]?)+$/)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(400, "some generic error");
            const apiDataResponse = tykDashboardService.findPolicyById(policyNameToSearchFor);
            return Promise.all([
                expect(apiDataResponse).to.eventually.be.rejected
            ]);
            
        });

        it('successful .createPolicy should return policyDataResponse{}', function() {
            const mockDataResponse = createPolicyResponseData;
            const policyNameToSearchFor = 'myPolicyId';
            const scope = nock(baseUrl).post(/api\/portal\/policies\/+$/)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(200, mockDataResponse,
                {
                    "Content-Type": "application/json"
                });
            const apiDataResponse = tykDashboardService.createPolicy(createPolicyRequestObject);
            return Promise.all([
                expect(apiDataResponse).to.eventually.have.property("status").equal("ok")
            ]);
            
        });
        it('unsuccessful .createPolicy should return rejected promise', function() {
            const scope = nock(baseUrl).post(/api\/portal\/policies\/+$/)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(400, "some generic error");
            const apiDataResponse = tykDashboardService.createPolicy(createPolicyRequestObject);
            return Promise.all([
                expect(apiDataResponse).to.eventually.be.rejected
            ]);
            
        });

        it('successful .updatePolicyById should return policyDataResponse{}', function() {
            const mockDataResponse = updatePolicyByIdResponseData;
            const policyIdToUpdate = 'myPolicyId';
            const scope = nock(baseUrl).put(/api\/portal\/policies\/([A-z]?[0-9]?)+$/, 
                updatePolicyByIdRequestObject)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(204, mockDataResponse,
                {
                    "Content-Type": "application/json"
                });
            const apiDataResponse = tykDashboardService.updatePolicyById(policyIdToUpdate, 
                updatePolicyByIdRequestObject);
            return Promise.all([
                expect(apiDataResponse).to.eventually.have.property("status").equal("ok")
            ]);
            
        });
        it('unsuccessful .updatePolicyById should return rejected promise', function() {
            const policyIdToUpdate = 'myPolicyId';
            const scope = nock(baseUrl).put(/api\/portal\/policies\/([A-z]?[0-9]?)+$/, 
                updatePolicyByIdRequestObject)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(400, "some generic error");
            const apiDataResponse = tykDashboardService.updatePolicyById(policyIdToUpdate, 
                updatePolicyByIdRequestObject);
            return Promise.all([
                expect(apiDataResponse).to.eventually.be.rejected
            ]);
            
        });

        it('successful .deletePolicyById should return policyDataResponse{}', function() {
            const mockDataResponse = deletePolicyByIdResponseData;
            const policyIdToUpdate = 'myPolicyId';
            const scope = nock(baseUrl).delete(/api\/portal\/policies\/([A-z]?[0-9]?)+$/)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(204, mockDataResponse,
                {
                    "Content-Type": "application/json"
                });
            const apiDataResponse = tykDashboardService.deletePolicyById(policyIdToUpdate);
            return Promise.all([
                expect(apiDataResponse).to.eventually.have.property("status").equal("ok")
            ]);
            
        });
        it('unsuccessful .deletePolicyById should return rejected promise', function() {
            const policyIdToUpdate = 'myPolicyId';
            const scope = nock(baseUrl).delete(/api\/portal\/policies\/([A-z]?[0-9]?)+$/)
                .matchHeader(AUTHORISATION_HEADER_NAME, authorisationToken)
                .reply(400, "some generic error");
            const apiDataResponse = tykDashboardService.deletePolicyById(policyIdToUpdate);
            return Promise.all([
                expect(apiDataResponse).to.eventually.be.rejected
            ]);
        });
    });
});
