/**
 * Converts undefined to nulls in an object.
 * e.g. {name?: string, title: string} => {name: string | null, title: string}
 */
export type DeepOptionalToNullable<T> = T extends (...args: any[]) => any
    ? T
    : T extends any[]
    ? _DeepNonNullableArray<T[number]>
    : T extends object
    ? _DeepNonNullableObject<T>
    : T;

interface _DeepNonNullableArray<T>
    extends Array<DeepOptionalToNullable<NonNullable<T>>> {}

type _DeepNonNullableObject<O> = {
    [K in keyof O]-?: DeepOptionalToNullable<
        undefined extends O[K] ? NonNullable<O[K]> | null : O[K]
    >;
};
