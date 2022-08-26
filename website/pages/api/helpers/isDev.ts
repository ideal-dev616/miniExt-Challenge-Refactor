export const areWeTestingWithJest = process.env.JEST_WORKER_ID != undefined;

export const isDev =
    process.env.NODE_ENV === 'development' || areWeTestingWithJest;
