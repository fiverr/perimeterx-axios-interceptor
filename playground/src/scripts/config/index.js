const debug = (message, ...args) => console.debug(`%c${message}`, [
    'display: inline-block',
    'padding: 2px 4px',
    'border-radius: 3px',
    'background: fuchsia',
    'color: white',
    'text-shadow: 0 1px 0 black, 0 -1px 0 black, 1px 0 0 black, -1px 0 0 black'
].join(';'), ...args);

export const config = {
    onerror: (error) => console.error(error),
    onintercept: (request) => debug('Intercepted', request.url),
    onsuccess: (request) => debug('Success', request.url),
    onfailure: (request, error) => debug('Failure', request.url, error.message),
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
