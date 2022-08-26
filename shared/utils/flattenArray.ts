export const flattenArray = (arr: any) =>
    arr.reduce(
        (flat: any, toFlatten: any) =>
            flat.concat(
                Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten
            ),
        []
    );
