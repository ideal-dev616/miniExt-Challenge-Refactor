import { LinkedRecordIdsToAirtableRecords } from 'shared/types/linkedRecordsIdsToPrimaryValues';
import { fetchAirtableRecordsFirstPage } from '../airtable';

type Params = {
    recordIds: string[];
    tableId: string;
    baseId: string;
    userUID: string;
    fieldNamesToFetch: string[];
};

/**
 * Fetches an array of records from a table
 */
export const fetchLinkedRecords = async (
    args: Params
): Promise<LinkedRecordIdsToAirtableRecords> => {
    const records = await fetchAirtableRecordsFirstPage({
        baseId: args.baseId,
        userUID: args.userUID,
        tableId: args.tableId,
        selectOptions: {
            fields: args.fieldNamesToFetch,
            filterByFormula: `FIND(RECORD_ID(), '${args.recordIds.join(' ')}')`,
        },
    });

    return records.reduce((acc, record) => {
        acc[record.id] = record;
        return acc;
    }, {} as LinkedRecordIdsToAirtableRecords);
};
