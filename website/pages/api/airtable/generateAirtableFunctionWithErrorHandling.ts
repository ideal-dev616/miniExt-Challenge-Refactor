type CommonArgs = {
    baseId: string;
    userUID: string;
};

export const generatetAirtableFunctionWithErrorHandling = <I, O>(
    fn: (args: I) => Promise<O>
): ((args: I & CommonArgs) => Promise<O>) => {
    const withErrorHandling = async (args: I & CommonArgs) => {
        try {
            return await fn(args);
        } catch (error) {
            throw error;
        }
    };

    return withErrorHandling;
};
