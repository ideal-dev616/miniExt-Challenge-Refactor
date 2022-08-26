import { AirtableField, AirtableRecord } from '../../airtable/types';
import {
    FieldIdsToAirtableFields,
    LinkedRecordIdsToAirtableRecords,
    LinkedTableIdsToPrimaryFields,
} from '../../types/linkedRecordsIdsToPrimaryValues';

export type FetchRecordsForLinkedRecordsSelectorInput = {
    linkedRecordFieldName: string;
    searchTerm: string;
    offset: string | null;
};

export type FetchRecordsForLinkedRecordsSelectorOutput = {
    records: AirtableRecord[];
    offset: string | null;
    primaryFieldInLinkedTable: AirtableField;
    linkedTableFieldIdsToAirtableFields: FieldIdsToAirtableFields;
    // Primary fields of records in additionalRecordIdsToAirtableRecords
    additionalTableIdsToPrimaryFields: LinkedTableIdsToPrimaryFields;
    // Airtable records needed to resolve linked records in the result.
    additionalRecordIdsToAirtableRecords: LinkedRecordIdsToAirtableRecords;
};
