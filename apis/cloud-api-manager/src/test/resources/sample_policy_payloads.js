const tykFindPolicyByNameResponseData = {
    "Data": [
        {
            "_id": "56b9fed54e86e40001000002",
            "access_rights": {
                "35447b1469df4e846894b1e87372f6d7": {
                    "allowed_urls": [
                        {
                            "methods": [
                                "GET"
                            ],
                            "url": "/some_resources"
                        },
                        {
                            "methods": [
                                "POST"
                            ],
                            "url": "/some_resource/(.*)"
                        }
                    ],
                    "apiid": "35447b1269df4e846894b7e87312f6d7",
                    "apiname": "My API",
                    "versions": [
                        "Default"
                    ]
                }
            },
            "active": true,
            "date_created": "0001-01-01T00:00:00Z",
            "hmac_enabled": false,
            "is_inactive": false,
            "key_expires_in": 0,
            "name": "My Policy",
            "org_id": "5629ca78eebd180001000001",
            "per": 1,
            "quota_max": -1,
            "quota_renewal_rate": 60,
            "rate": 1000,
            "tags": []
        }
    ],
    "Pages": 0
};

const retrievePolicyByIdResponseData = {
    "_id": "56b9fed54e86e40001000002",
    "access_rights": {
        "35447b1469df4e846894b1e87372f6d7": {
            "allowed_urls": [
                {
                    "methods": [
                        "GET",
                    ],
                    "url": "/some_resources"
                },
                {
                    "methods": [
                        "POST"
                    ],
                    "url": "/some_resource/(.*)"
                },
            ],
            "apiid": "35447b1269df4e846894b7e87312f6d7",
            "apiname": "My API",
            "versions": [
                "Default"
            ]
        }
    },
    "active": true,
    "date_created": "0001-01-01T00:00:00Z",
    "hmac_enabled": false,
    "is_inactive": false,
    "key_expires_in": 0,
    "name": "My Policy",
    "org_id": "5629ca78eebd180001000001",
    "per": 1,
    "quota_max": -1,
    "quota_renewal_rate": 60,
    "rate": 1000,
    "tags": []
};

const createPolicyRequestObject = {
    "last_updated": "0001-01-01T00:00:00Z",
    "rate": 1000,
    "per": 60,
    "quota_max": -1,
    "quota_renews": 1481546970,
    "quota_remaining": 0,
    "quota_renewal_rate": 60,
    "access_rights": {
        "35447b1469df4e846894b1e87372f6d7": {
            "apiid": "35447b1469df4e846894b1e87372f6d7",
            "api_name": "My API",
            "versions": ["Default"]
        }
    },
    "name": "My Policy",
    "active": true
};

const createPolicyResponseData = {
    "Status": "OK",
    "Message": "56b9fed54e86e40001000002",
    "Meta": "null"
};

const updatePolicyByIdRequestObject = {
    "_id": "56b9fed54e86e40001000002",
    "id": "",
    "org_id": "589b4be9dbd34702ee2ed8c5",
    "rate": 1000,
    "per": 60,
    "quota_max": -1,
    "quota_renewal_rate": 60,
    "access_rights": {
        "35447b1469df4e846894b1e87372f6d7": {
            "apiid": "35447b1469df4e846894b1e87372f6d7",
            "api_name": "My API",
            "versions": ["Default"],
            "allowed_urls": []
        }
    },
    "hmac_enabled": false,
    "active": true,
    "name": "My Updated Policy",
    "is_inactive": false,
    "date_created": "0001-01-01T00:00:00Z",
    "tags": [],
    "key_expires_in": 0,
    "partitions": {
        "quota": false,
        "rate_limit": false,
        "acl": false
    },
    "last_updated": "0001-01-01T00:00:00Z"
};

const updatePolicyByIdResponseData = {
    "Status": "OK",
    "Message": "Data updated",
    "Meta": ""
};

const deletePolicyByIdResponseData = {
    "Status": "OK",
    "Message": "Data deleted",
    "Meta": null
  };  

module.exports.tykFindPolicyByNameResponseData = tykFindPolicyByNameResponseData;
module.exports.retrievePolicyByIdResponseData = retrievePolicyByIdResponseData;
module.exports.createPolicyRequestObject = createPolicyRequestObject;
module.exports.createPolicyResponseData = createPolicyResponseData;
module.exports.updatePolicyByIdRequestObject = updatePolicyByIdRequestObject;
module.exports.updatePolicyByIdResponseData = updatePolicyByIdResponseData;
module.exports.deletePolicyByIdResponseData = deletePolicyByIdResponseData;
