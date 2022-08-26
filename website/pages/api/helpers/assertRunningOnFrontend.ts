export const isOnFrontend = () => typeof window !== 'undefined';

export const assertRunningOnFrontend = (callableName: string) => {
    if (!isOnFrontend()) {
        throw new Error(`You can't call ${callableName} on the backend`);
    }
    return;
};
