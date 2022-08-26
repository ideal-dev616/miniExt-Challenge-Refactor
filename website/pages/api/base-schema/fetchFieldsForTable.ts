import { FieldsForTable } from './types';
import { getFieldsWithLinkedRecordsResolved } from './fieldsWithLinkedRecordsResolved';
import { fetchBaseSchema } from '.';

/**
 * Expects that the user is allowed to perform this action.
 */
export const fetchFieldsForTable = async (args: {
    userUID: string;
    baseId: string;
    tableId: string;
    totalRemainingTriesToResolveLookupLinkedRecordFields?: number; // lookup fields that are looking up a linked records field
}): Promise<FieldsForTable> => {
    const totalRemainingTriesToResolveLookupLinkedRecordFields =
        args.totalRemainingTriesToResolveLookupLinkedRecordFields || 0;

    const errorMessage =
        'No fields schema was found for the provided table ID.';

    const base = await fetchBaseSchema();

    const table = base.tables.find((table) => table.id === args.tableId);

    if (!table) {
        throw new Error(
            `${errorMessage} The provided table ID was not found in the base schema.`
        );
    }

    if (totalRemainingTriesToResolveLookupLinkedRecordFields > 0) {
        const fieldsWithLinkedRecordsResolved =
            await getFieldsWithLinkedRecordsResolved({
                fields: table.fields,
                userUID: args.userUID,
                baseId: args.baseId,
                tableId: args.tableId,
                totalRemainingTriesToResolveLookupLinkedRecordFields:
                    totalRemainingTriesToResolveLookupLinkedRecordFields - 1,
            });
        return { fields: fieldsWithLinkedRecordsResolved };
    } else {
        return { fields: table.fields };
    }
};
