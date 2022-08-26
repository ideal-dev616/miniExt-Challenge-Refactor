export const isRecordId = (recordId: string) => {
    return recordId.startsWith('rec') && recordId.length === 17;
};

export const assertRecordId = (recordId: string) => {
    if (isRecordId(recordId)) {
        // looks good
        return;
    } else {
        throw new Error(`The provided record ID is not valid: "${recordId}"`);
    }
};
