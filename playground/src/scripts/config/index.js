import debug from '../debug';
import mockRequests from '../mockRequests';

export const config = {
    onerror: (error) => mockRequests.replay() || debug('[onerror]', error.message, error.stack),
    onintercept: (request) => debug('[onintercept]', request.url),
    onunintercept: (request) => debug('[onunintercept]', request.url),
    onsuccess: (request) => debug('[onsuccess]', request.url),
    onfailure: (request, error) => mockRequests.replay() || debug('[onfailure]', request.url, error.message),
    filter: ({ path }) => path !== '/pxignore',
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
            suffix: 'Still having issues? Contact support at support@example.com'
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
