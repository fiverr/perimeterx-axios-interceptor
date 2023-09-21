import { info } from '../debug';
import mockRequests from '../mockRequests';

export const config = {
    onerror: (error) => mockRequests.replay() || info('[onerror]', error.message, ':', error.stack),
    onintercept: (request) => info('[onintercept]', request.url),
    onignore: (request) => info('[onignore]', request.url),
    onsuccess: (request) => info('[onsuccess]', request.url),
    onfailure: (request, error) => mockRequests.replay() || info('[onfailure]', request.url, ':', error.message),
    filter: ({ path, ignore }) => ignore !== true && path !== '/pxignore',
    modalConfig: {}
};

/**
 * Mutate the config object to use custom values in modal
 * @param {boolean} boolean
 * @returns {object} modalConfig
 */
export function useCustomModal(boolean) {
    config.modalConfig =
    boolean
        ? {
            className: 'my-challenge-popup',
            title: 'Are you human?',
            subtitle: 'Please complete the challenge',
            quickfixes: [
                '1. Disable adblocker',
                '2. Enable Javascript'
            ],
            suffix: 'Still having issues? Contact support at support@example.com',
            allowClose: false
        }
        : {}
    ;
}

/**
 * Mutate the config object to toggle simulate mode
 * @param {boolean} boolean
 * @returns {object} modalConfig
 */
export const simulate = (simulate) => Object.assign(config, { simulate });
