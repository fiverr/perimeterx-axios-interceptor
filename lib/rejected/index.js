const isPXResponse = require('../isPXResponse');
const openModal = require('../openModal');

/**
 * Handle status codes that falls outside the range of 2xx
 * @param error AxiosError thrown by non 2xx responses
 * @returns Promise.reject<error>
 */
module.exports = async function rejected(error) {
    try {
        const { response = {} } = error;
        const { data, status } = response;

        if (status !== 403 || !isPXResponse(data)) {
            throw error;
        }

        const filtered = await this.filter({
            appId: data.appId,
            path: error.config.url
        });
        if (!filtered) {
            throw error;
        }

        // TODO: Trigger challenge here
        await openModal(data);

        // Go back to start, collect 200
        return this.axios(error.config);
    } catch (_) {
        this.onerror && this.onerror(_);

        throw error;
    }
};
