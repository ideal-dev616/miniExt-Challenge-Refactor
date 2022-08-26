import {
    FieldIdsToAirtableFields,
    LinkedRecordIdsToAirtableRecords,
    LinkedTableIdsToPrimaryFields,
} from '../../types/linkedRecordsIdsToPrimaryValues';

export type TableIdsToRecordsIdsToFetch = {
    [tableId: string]: {
        recordIds: string[];
        linkedRecordFieldIdsInMainTable: string[];
    };
};

export type FetchInitialLinkedRecordsInput = {
    linkedTableIdsToRecordIds: TableIdsToRecordsIdsToFetch;
};

export type FetchInitialLinkedRecordsOutput = {
    linkedRecordIdsToAirtableRecords: LinkedRecordIdsToAirtableRecords;
    linkedTableIdsToPrimaryFields: LinkedTableIdsToPrimaryFields;
    linkedTableFieldIdsToAirtableFields: FieldIdsToAirtableFields;
};
