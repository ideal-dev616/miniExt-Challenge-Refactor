import { TableIdsToRecordsIdsToFetch } from 'shared/api/types/fetchAllLinkedRecordPrimaryValues';
import { AirtableField, AirtableFieldSet } from 'shared/airtable/types';
import { TableIdsToRecordsToFetch } from './types';
import { FieldType } from '@airtable/blocks/models';

export const getLinkedTableIdsToRecordIds = (args: {
    recordsFields: ReadonlyArray<AirtableFieldSet>;
    fields: ReadonlyArray<AirtableField>;
    airtableFieldsUsedByExtensionPublically: Set<string>;
}): TableIdsToRecordsIdsToFetch => {
    const tableIdsToRecordsToFetch = args.fields.reduce(
        (obj: TableIdsToRecordsToFetch, field: AirtableField) => {
            if (args.airtableFieldsUsedByExtensionPublically.has(field.name)) {
                let linkedTableId: string | null = null;

                if (field.config.type === FieldType.MULTIPLE_RECORD_LINKS) {
                    linkedTableId = field.config.options.linkedTableId;
                } else if (
                    field.config.type === FieldType.MULTIPLE_LOOKUP_VALUES &&
                    field.config.options.isValid &&
                    field.config.options.result.type ===
                        FieldType.MULTIPLE_RECORD_LINKS
                ) {
                    linkedTableId =
                        field.config.options.result.options.linkedTableId;
                }

                if (linkedTableId) {
                    if (obj[linkedTableId]) {
                        obj[linkedTableId].linkedRecordFieldsInMainTable.push(
                            field
                        );
                    } else {
                        obj[linkedTableId] = {
                            linkedRecordFieldsInMainTable: [field],
                            recordIds: new Set(),
                        };
                    }
                }
            }
            return obj;
        },
        {}
    );

    for (const recordFields of args.recordsFields) {
        for (const tableId of Object.keys(tableIdsToRecordsToFetch)) {
            const fields =
                tableIdsToRecordsToFetch[tableId].linkedRecordFieldsInMainTable;
            for (const field of fields) {
                const recordIds = recordFields[field.name];

                if (Array.isArray(recordIds)) {
                    for (const recordId of recordIds) {
                        tableIdsToRecordsToFetch[tableId].recordIds.add(
                            recordId
                        );
                    }
                }
            }
        }
    }

    return Object.keys(tableIdsToRecordsToFetch).reduce(
        (obj: TableIdsToRecordsIdsToFetch, tableId: string) => {
            const current = tableIdsToRecordsToFetch[tableId];

            obj[tableId] = {
                recordIds: Array.from(current.recordIds),
                linkedRecordFieldIdsInMainTable:
                    current.linkedRecordFieldsInMainTable.map(
                        (field) => field.id
                    ),
            };
            return obj;
        },
        {}
    );
};
