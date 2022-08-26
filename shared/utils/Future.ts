/**
 * Creates a Promise that can be resolved or rejected from outside of the
 * Promise's body. Useful for situations where you'd await till an external event occurs.
 */
class Future<T> {
    private _promise: Promise<T>;
    private _resolve!: (value: T) => void;
    private _reject!: (reason?: any) => void;

    constructor() {
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    get promise() {
        return this._promise;
    }

    resolve(value: T) {
        this._resolve(value);
    }

    reject(reason?: any) {
        this._reject(reason);
    }
}

export default Future;
