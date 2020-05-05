import moxios from 'moxios';
import { debug } from '../debug';
import PXResponse from '../../../../specHelpers/PXResponse';

const SIMPLE_SUCCESSFUL_REQUEST = '/success';
const SIMPLE_SERVER_ERROR = '/fail';
const SIMPLE_FORBIDDEN = '/forbidden';
const BLOCK_REQUEST_AND_EXONERATE = '/pxblock';
const BLOCK_THRICE = '/pxblock3';
const BLOCK_MULTIPLE_REQUESTS = Array(3).fill(BLOCK_THRICE);
const BLOCK_BUT_IGNORE_THE_BLOCKAGE = '/pxignore';

/**
 * Endpoint descriptions {text, value}
 * @type {object[]}
 */
export const endpoints = Object.entries({
    SIMPLE_SUCCESSFUL_REQUEST,
    SIMPLE_SERVER_ERROR,
    SIMPLE_FORBIDDEN,
    BLOCK_REQUEST_AND_EXONERATE,
    BLOCK_MULTIPLE_REQUESTS,
    BLOCK_BUT_IGNORE_THE_BLOCKAGE
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
export default function mockRequests(axios, appId = '') {
    mockRequests.replay = () => mockRequests(axios, appId);
    debug(`Stub requests with app ID [${appId || 'MISSING APP ID'}]`);

    moxios.uninstall(axios);
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
    moxios.stubRequest(BLOCK_REQUEST_AND_EXONERATE, new PXResponse({ appId }));

    moxios.stubRequest(BLOCK_THRICE, new PXResponse({ appId, failureCount: 3 }));

    moxios.stubRequest(BLOCK_BUT_IGNORE_THE_BLOCKAGE, new PXResponse({ appId }));
}
