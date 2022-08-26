import { AirtableField, AirtableRecord } from '../airtable/types';

/**
 * A map of record IDs to primary values. We don't check the tableId because Airtable records have unique
 * ids for every base.
 */
export type LinkedRecordsIdsToPrimaryValues = {
    [recordId: string]: string;
};

export type LinkedRecordIdsToAirtableRecords = {
    [recordId: string]: AirtableRecord;
};

export type LinkedTableIdsToPrimaryFields = {
    [tableId: string]: AirtableField;
};

export type AllFieldIdsToFieldNamesInBase = {
    [fieldId: string]: string;
};

/**
 * Maps field IDs to the field IDs that are nested inside of each of those
 * fields' miniExt configs.
 */
export type FieldIdsToFieldIdsNestedInMiniExtFieldConfigs = {
    [fieldId: string]: string[];
};

export type FieldIdsToAirtableFields = {
    [fieldId: string]: AirtableField;
};
