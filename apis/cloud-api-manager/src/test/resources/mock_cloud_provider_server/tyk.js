const { tykApiResponseData, tykDeleteApiResponse, tykUpdateApiResponseData,
    tykCreateApiResponseData, tykCreateApiRequestObject, tykUpdateApiRequestObject,
    tykApiSearchResponseData } = require("../sample_api_payload");

const { tykFindPolicyByNameResponseData, retrievePolicyByIdResponseData,
    createPolicyRequestObject, createPolicyResponseData, updatePolicyByIdRequestObject,
    updatePolicyByIdResponseData, deletePolicyByIdResponseData
} = require("../sample_policy_payloads");

/**
 * 
 * @param {number} desiredPort 
 * @param {object} routeDisableConfig Config object allowing certain routes to be disabled on server creation
 * @param {boolean} [routeDisableConfig.disableApiSearch=false] Disables api search route
 * @param {boolean} [routeDisableConfig.disableApiCrudOps=false] Disables api CRUD operation routes 
 * @param {boolean} [routeDisableConfig.disablePolicySearch=false] Disables policy search route
 * @param {boolean} [routeDisableConfig.disablePolicyCrudOps=false] Disables policy CRUD operation routes
 */
function startServerAndReturn(desiredPort, {
    disableApiSearch = false,
    disableApiCrudOps = false,
    disablePolicySearch = false,
    disablePolicyCrudOps = false
} = {}) {
    const express = require('express');
    const app = express();

    app.use(function (req, res, next) {
        if (/(.+)/.test(req.headers.authorization)) {
            next();
        } else {
            res.status(401).send('API call unauthorised call');
        }
    })

    if (!disableApiSearch) {
        app.get('/api/apis/search', function (req, res) {
            res.send(tykApiSearchResponseData);
        });
    }
    if (!disableApiCrudOps) {
        app.all(/\/api\/apis\/([A-z]?[0-9]?)+$/, function (req, res) {
            res.send(tykCreateApiResponseData);
        });
    }
    if (!disablePolicySearch) {
        app.get('/api/portal/policies/search', function (req, res) {
            res.send(tykFindPolicyByNameResponseData);
        });
    }
    if (!disablePolicyCrudOps) {
        app.all(/api\/portal\/policies\/([A-z]?[0-9]?)+$/, function (req, res) {
            res.send(updatePolicyByIdResponseData);
        });
    }

    /* Default to 400 series error for unknown routes */
    app.all(/\/(.+)$/, function (req, res) {
        res.status(404).send("not found");
    });

    app.listen(desiredPort, function () {
        console.log(`Mock tyk provider listening on port ${desiredPort}!`);
    });

    return app;
}

module.exports.tyk = startServerAndReturn;