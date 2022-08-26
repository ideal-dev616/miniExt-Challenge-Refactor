/**
 * Use this to iterate over the keys of an enum that is a string literal.
 */
export const enumKeys = <O extends object, K extends keyof O = keyof O>(
    obj: O
): K[] => Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
