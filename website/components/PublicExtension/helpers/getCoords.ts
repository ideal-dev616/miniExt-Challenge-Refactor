import { logError } from '../../../utils/logError';

export const getCoords = async (): Promise<{
    long?: number;
    lat?: number;
}> => {
    try {
        const pos = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    // If not set the function will continue to run until the location is available
                    timeout: 3000,
                });
            }
        );
        return {
            long: pos.coords.longitude,
            lat: pos.coords.latitude,
        };
    } catch (error) {
        logError({ extensionId: null, error });
        return {};
    }
};
