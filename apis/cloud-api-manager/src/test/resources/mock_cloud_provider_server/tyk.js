const { tykApiResponseData, tykDeleteApiResponse, tykUpdateApiResponseData,
    tykCreateApiResponseData, tykCreateApiRequestObject, tykUpdateApiRequestObject,
    tykApiSearchResponseData } = require("../sample_api_payload");

const { tykFindPolicyByNameResponseData, retrievePolicyByIdResponseData,
    createPolicyRequestObject, createPolicyResponseData, updatePolicyByIdRequestObject,
    updatePolicyByIdResponseData, deletePolicyByIdResponseData
} = require("../sample_policy_payloads");

function startServerAndReturn(desiredPort) {
    const express = require('express');
    const app = express();

    app.use(function (req, res, next) {
        if (/Bearer (.+)/.test(req.headers.authorization)) {
            next();
        } else {
            res.status(401).send('API call unauthorised call');
        }
    })

    app.get('/api/apis/search', function (req, res) {
        res.send(tykApiSearchResponseData);
    });

    app.all(/\/api\/apis\/([A-z]?[0-9]?)+$/, function (req, res) {
        res.send(tykCreateApiResponseData);
    });

    app.get('/api/portal/policies/search', function (req, res) {
        res.send(tykFindPolicyByNameResponseData);
    });

    app.all(/api\/portal\/policies\/([A-z]?[0-9]?)+$/, function (req, res) {
        res.send(updatePolicyByIdResponseData);
    });

    app.listen(desiredPort, function () {
        console.log(`Mock tyk provider listening on port ${desiredPort}!`);
    });

    return app;
}

module.exports.tyk = startServerAndReturn;