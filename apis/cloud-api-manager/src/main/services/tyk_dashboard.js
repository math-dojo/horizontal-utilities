// jshint esversion:6
const axios = require('axios').default;
const logger = new (require('../logging/custom_logger'))("cloud-api-manager:services:tyk_dashboard");

class TykDashboardService {

    /**
     * Creates an instance of the TykDashboardService
     * @param {string} authorization 
     * @param {string} baseUrl 
     */
    constructor(authorization, baseUrl = 'https://admin.cloud.tyk.io') {
        this._httpClientInstance = axios.create({
            baseURL: baseUrl,
            timeout: 1000,
            headers: { 'authorization': authorization },
            validateStatus: function (status) {
                return status >= 200 && status < 300; // default
            }
        });

        this._httpClientInstance.interceptors.request.use(function (config) {
            logger.info(`Now sending request to: ${config.baseURL}${config.url}`);
            return config;
        }, function (error) {
            logger.error(`Error sending request: ${error.message}`);
            return Promise.reject(error);
        });

        // Add a response interceptor
        this._httpClientInstance.interceptors.response.use(function (response) {
            logger.info(`Successful response from ${
                response.request.path}, now extracting the json response for downstream consumers`);
            return response.data;
        }, function (error) {
            logger.error(`Unsuccessful response from ${error.request.path}`);
            logger.error(`Request config was: ${JSON.stringify(error.config)}`);
            return Promise.reject(error);
        });
    }

    /**
     * 
     * @param {string} name 
     */
    findApiByName(name) {
        if(!name) {
            const error = new Error(".findApiByName must have a name to search for which is currently null or empty");
            logger.error(`.findApiByName failed because: ${error.message}`);
            return Promise.reject(error);
        }
        return this._httpClientInstance.get(`/api/apis/search`, {
            params: {
                q: name
            }
        })
        .catch(error => {
            const wrappedError = new Error(`.findApiByName failed because: ${error.message}`);
            logger.error(wrappedError.message);
            return Promise.reject(wrappedError);
        });
    }

    /**
     * 
     * @param {string} systemId 
     */
    findApiBySystemId(systemId) {
        return this._httpClientInstance.get(`/api/apis/${systemId}`)
        .catch(error => {
            const wrappedError = new Error(`.findApiBySystemId failed because: ${error.message}`);
            logger.error(wrappedError.message);
            return Promise.reject(wrappedError);
        });
    }

    /**
     * 
     * @param {string} systemId 
     */
    deleteApiBySystemId(systemId) {
        return this._httpClientInstance.delete(`/api/apis/${systemId}`)
            .then(dataResponse => {
                return {
                    status: dataResponse["Status"].toLowerCase()
                }
            })
            .catch(error => {
                const wrappedError = new Error(`.deleteApiBySystemId failed because: ${error.message}`);
                logger.error(wrappedError.message);
                return Promise.reject(wrappedError);
            });
    }

    /**
     * 
     * @param {object} apiDefinition 
     */
    createApi(apiDefinition) {
        return this._httpClientInstance.post(`/api/apis`, apiDefinition)
        .then(dataResponse => {
            return {
                status: dataResponse["Status"].toLowerCase()
            }
        })
        .catch(error => {
            const errorReasonToShow = error.response.data ? error.response.data : error.message;
            const wrappedError = new Error(`.createApi failed because: ${errorReasonToShow}`);
            logger.error(wrappedError.message);
            return Promise.reject(wrappedError);
        });
    }

    /**
     * 
     * @param {string} systemId 
     * @param {object} apiDefinition 
     */
    updateApiBySystemId(systemId, apiDefinition) {
        return this._httpClientInstance.put(`/api/apis/${systemId}`, apiDefinition)
        .then(dataResponse => {
            return {
                status: dataResponse["Status"].toLowerCase()
            }
        })
        .catch(error => {
            const wrappedError = new Error(`.updateApiBySystemId failed because: ${error.message}`);
            logger.error(wrappedError.message);
            return Promise.reject(wrappedError);
        });
    }

    /**
     * 
     * @param {string} name 
     */
    findPolicyByName(name) {
        if(!name) {
            const error = new Error(".findPolicyByName must have a name to search for which is currently null or empty");
            logger.error(`.findPolicyByName failed because: ${error.message}`);
            return Promise.reject(error);
        }
        return this._httpClientInstance.get(`/api/portal/policies/search`, {
            params: {
                q: name
            }
        })
        .catch(error => {
            const wrappedError = new Error(`.findPolicyByName failed because: ${error.message}`);
            logger.error(wrappedError.message);
            return Promise.reject(wrappedError);
        });
    }

    /**
     * 
     * @param {string} policySystemId 
     */
    findPolicyById(policySystemId) {
        return this._httpClientInstance.get(`/api/portal/policies/${policySystemId}`)
        .catch(error => {
            const wrappedError = new Error(`.findPolicyById failed because: ${error.message}`);
            logger.error(wrappedError.message);
            return Promise.reject(wrappedError);
        });
    }

    /**
     * 
     * @param {object} policyDefinition 
     */
    createPolicy(policyDefinition) {
        return this._httpClientInstance.post(`/api/portal/policies/`, policyDefinition)
        .then(dataResponse => {
            return {
                status: dataResponse["Status"].toLowerCase()
            }
        })
        .catch(error => {
            const wrappedError = new Error(`.createPolicy failed because: ${error.message}`);
            logger.error(wrappedError.message);
            return Promise.reject(wrappedError);
        });
    }

    /**
     * 
     * @param {string} policySystemId 
     * @param {object} policyDefinition 
     */
    updatePolicyById(policySystemId, policyDefinition) {
        return this._httpClientInstance.put(`/api/portal/policies/${policySystemId}`, policyDefinition)
        .then(dataResponse => {
            return {
                status: dataResponse["Status"].toLowerCase()
            }
        })
        .catch(error => {
            const wrappedError = new Error(`.updatePolicyById failed because: ${error.message}`);
            logger.error(wrappedError.message);
            return Promise.reject(wrappedError);
        });
    }

    /**
     * 
     * @param {string} policySystemId
     */
    deletePolicyById(policySystemId) {
        return this._httpClientInstance.delete(`/api/portal/policies/${policySystemId}`)
        .then(dataResponse => {
            return {
                status: dataResponse["Status"].toLowerCase()
            }
        })
        .catch(error => {
            const wrappedError = new Error(`.deletePolicyById failed because: ${error.message}`);
            logger.error(wrappedError.message);
            return Promise.reject(wrappedError);
        });
    }
}

module.exports.TykDashboardService = TykDashboardService;
