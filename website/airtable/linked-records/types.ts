import { AirtableField } from 'shared/airtable/types';

export type RecordsToFetch = {
    linkedRecordFieldsInMainTable: AirtableField[];
    recordIds: Set<string>;
};

export type TableIdsToRecordsToFetch = {
    [tableId: string]: RecordsToFetch;
};
