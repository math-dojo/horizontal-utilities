// jshint esversion:6
/**
 * The following payloads can be found here:
 * https://tyk.io/docs/tyk-apis/tyk-dashboard-api/api-definitions/#sample-response-1
 */
const tykApiResponseData = {
    api_model: {},
    api_definition: {
        id: "54b53e47eba6db5c70000002",
        name: "Nitrous Test",
        api_id: "39d2c98be05c424371c600bd8b3e2242",
        org_id: "54b53d3aeba6db5c35000002",
        use_keyless: false,
        use_oauth2: false,
        oauth_meta: {
            allowed_access_types: [],
            allowed_authorize_types: ["token"],
            auth_login_redirect: "",
        },
        auth: {
            auth_header_name: "authorization",
        },
        use_basic_auth: false,
        notifications: {
            shared_secret: "",
            oauth_on_keychange_url: "",
        },
        enable_signature_checking: false,
        definition: {
            location: "header",
            key: "",
        },
        version_data: {
            not_versioned: true,
            versions: {
                Default: {
                    name: "Default",
                    expires: "",
                    paths: {
                        ignored: [],
                        white_list: [],
                        black_list: [],
                    },
                    use_extended_paths: false,
                    extended_paths: {
                        ignored: [],
                        white_list: [],
                        black_list: [],
                    },
                },
            },
        },
        proxy: {
            listen_path: "/39d2c98be05c424371c600bd8b3e2242/",
            target_url: "http://tyk.io",
            strip_listen_path: true,
        },
        custom_middleware: {
            pre: null,
            post: null,
        },
        session_lifetime: 0,
        active: true,
        auth_provider: {
            name: "",
            storage_engine: "",
            meta: null,
        },
        session_provider: {
            name: "",
            storage_engine: "",
            meta: null,
        },
        event_handlers: {
            events: {},
        },
        enable_batch_request_support: false,
        enable_ip_whitelisting: false,
        allowed_ips: [],
        expire_analytics_after: 0,
    },
    hook_references: [],
};

const tykDeleteApiResponseData = {
    Status: "OK",
    Message: "API deleted",
    Meta: null,
};
const tykUpdateApiResponseData = {
    Status: "OK",
    Message: "Api updated",
    Meta: "",
};
const tykCreateApiResponseData = {
    Status: "OK",
    Message: "API created",
    Meta: "54c24242eba6db1c9a000002",
};

const tykCreateApiRequestObject = {
    "api_definition": {
        "name": "Test",
        "auth": {
            "auth_header_name": "authorization"
        },
        "definition": {
            "location": "header",
            "key": ""
        },
        "proxy": {
            "target_url": "http://httpbin.org/"
        },
        "version_data": {
            "use_extended_paths": true,
            "not_versioned": true,
            "versions": {
                "Default": {
                    "expires": "",
                    "name": "Default",
                    "paths": {
                        "ignored": [],
                        "white_list": [],
                        "black_list": []
                    },
                    "extended_paths": {
                        "ignored": [
                            {
                                "path": "/test-path/",
                                "method_actions": {
                                    "GET": {
                                        "action": "no_action",
                                        "code": 200,
                                        "data": "",
                                        "headers": {}
                                    }
                                }
                            },
                            {
                                "path": "/test-path/reply",
                                "method_actions": {
                                    "GET": {
                                        "action": "reply",
                                        "code": 200,
                                        "data": "{\"foo\":\"bar\"}",
                                        "headers": {
                                            "x-test": "test"
                                        }
                                    }
                                }
                            }
                        ],
                        "white_list": [],
                        "black_list": []
                    },
                    "use_extended_paths": true
                }
            }
        },
        "use_oauth2": false,
        "oauth_meta": {
            "auth_login_redirect": "",
            "allowed_access_types": [],
            "allowed_authorize_types": [
                "token"
            ]
        },
        "notifications": {
            "shared_secret": "",
            "oauth_on_keychange_url": ""
        },
        "enable_ip_whitelisting": true,
        "allowed_ips": [
            "127.0.0.1"
        ],
        "use_keyless": false,
        "enable_signature_checking": false,
        "use_basic_auth": false,
        "active": true,
        "enable_batch_request_support": true
    },
    "hook_references": [
        {
            "event_name": "QuotaExceeded",
            "hook": {
                "api_model": {},
                "id": "54be6c0beba6db07a6000002",
                "org_id": "54b53d3aeba6db5c35000002",
                "name": "Test Post",
                "method": "POST",
                "target_path": "http://httpbin.org/post",
                "template_path": "",
                "header_map": {
                    "x-tyk-test": "123456"
                },
                "event_timeout": 0
            },
            "event_timeout": 60
        }
    ]
};

const tykUpdateApiRequestObject = {
    "api_definition": {
        "id": "54c24242eba6db1c9a000002",
        "api_id": "bc2f8cfb7ab241504d9f3574fe407499",
        "name": "Test",
        "auth": {
            "auth_header_name": "authorization"
        },
        "definition": {
            "location": "header",
            "key": ""
        },
        "proxy": {
            "target_url": "http://httpbin.org/"
        },
        "version_data": {
            "use_extended_paths": true,
            "not_versioned": true,
            "versions": {
                "Default": {
                    "expires": "",
                    "name": "Default",
                    "paths": {
                        "ignored": [],
                        "white_list": [],
                        "black_list": []
                    },
                    "extended_paths": {
                        "ignored": [
                            {
                                "path": "/test-path/",
                                "method_actions": {
                                    "GET": {
                                        "action": "no_action",
                                        "code": 200,
                                        "data": "",
                                        "headers": {}
                                    }
                                }
                            },
                            {
                                "path": "/test-path/reply",
                                "method_actions": {
                                    "GET": {
                                        "action": "reply",
                                        "code": 200,
                                        "data": "{\"foo\":\"bar\"}",
                                        "headers": {
                                            "x-test": "test"
                                        }
                                    }
                                }
                            }
                        ],
                        "white_list": [],
                        "black_list": []
                    },
                    "use_extended_paths": true
                }
            }
        },
        "use_oauth2": false,
        "oauth_meta": {
            "auth_login_redirect": "",
            "allowed_access_types": [],
            "allowed_authorize_types": [
                "token"
            ]
        },
        "notifications": {
            "shared_secret": "",
            "oauth_on_keychange_url": ""
        },
        "enable_ip_whitelisting": true,
        "allowed_ips": [
            "127.0.0.1"
        ],
        "use_keyless": false,
        "enable_signature_checking": false,
        "use_basic_auth": false,
        "active": true,
        "enable_batch_request_support": true
    },
    "hook_references": [
        {
            "event_name": "QuotaExceeded",
            "hook": {
                "api_model": {},
                "id": "54be6c0beba6db07a6000002",
                "org_id": "54b53d3aeba6db5c35000002",
                "name": "Test Post",
                "method": "POST",
                "target_path": "http://httpbin.org/post",
                "template_path": "",
                "header_map": {
                    "x-tyk-test": "123456"
                },
                "event_timeout": 0
            },
            "event_timeout": 60
        }
    ]
};

const tykApiSearchResponseData = {
    apis: [
        tykApiResponseData
    ]
};

module.exports.tykApiResponseData = tykApiResponseData;
module.exports.tykDeleteApiResponse = tykDeleteApiResponseData;
module.exports.tykUpdateApiResponseData = tykUpdateApiResponseData;
module.exports.tykCreateApiResponseData = tykCreateApiResponseData;
module.exports.tykCreateApiRequestObject = tykCreateApiRequestObject;
module.exports.tykUpdateApiRequestObject = tykUpdateApiRequestObject;
module.exports.tykApiSearchResponseData = tykApiSearchResponseData;
