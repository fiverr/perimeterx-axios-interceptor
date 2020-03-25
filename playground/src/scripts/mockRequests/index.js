import moxios from 'moxios';
import PXResponse from '../../../../specHelpers/PXResponse';

const SIMPLE_SUCCESSFUL_REQUEST = '/success';
const SIMPLE_SERVER_ERROR = '/fail';
const SIMPLE_FORBIDDEN = '/forbidden';
const PERIMETERX_BLOCK_AND_EXONERATE = '/pxblock';

/**
 * Endpoint descriptions {text, value}
 * @type {object[]}
 */
export const endpoints = Object.entries({
    SIMPLE_SUCCESSFUL_REQUEST,
    SIMPLE_SERVER_ERROR,
    SIMPLE_FORBIDDEN,
    PERIMETERX_BLOCK_AND_EXONERATE
}).map(
    ([key, value]) => ({
        text: key.replace(/_/g, ' ').toLowerCase(),
        value
    })
);

/**
 * Mock Axios endpoints
 * @param {import('axios').AxiosInstance} axios
 * @returns {void}
 */
export default function mockRequests(axios, appId = PXResponse.defaultAppId) {
    console.debug(`Stubbing requests with app ID ${appId}`);
    moxios.install(axios);

    moxios.stubRequest(SIMPLE_SUCCESSFUL_REQUEST, {
        status: 200,
        response: 'Success'
    });
    moxios.stubRequest(SIMPLE_SERVER_ERROR, {
        status: 500,
        response: 'Server error'
    });
    moxios.stubRequest(SIMPLE_FORBIDDEN, {
        status: 403,
        response: 'Forbidden'
    });
    moxios.stubRequest(PERIMETERX_BLOCK_AND_EXONERATE, new PXResponse({ appId }));
}
