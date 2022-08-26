import { FieldType } from '@airtable/blocks/models';
import {
    AirtableField,
    AirtableLinkedRecordField,
    AirtableLookupField,
} from 'shared/airtable/types';
import { fetchFieldsForTable } from './fetchFieldsForTable';

export const getFieldsWithLinkedRecordsResolved = async (args: {
    fields: AirtableField[];
    userUID: string;
    baseId: string;
    tableId: string;
    totalRemainingTriesToResolveLookupLinkedRecordFields: number;
}): Promise<AirtableField[]> => {
    for (const field of args.fields) {
        const config = field.config;
        if (
            config &&
            config.type === FieldType.MULTIPLE_LOOKUP_VALUES &&
            config.options.result &&
            config.options.result.type === FieldType.MULTIPLE_RECORD_LINKS &&
            config.options.recordLinkFieldId &&
            config.options.fieldIdInLinkedTable
        ) {
            const airtableLookupFieldConfig: AirtableLookupField['config'] =
                config;
            const linkedRecordsField = args.fields.find(
                (field) => field.id === config.options.recordLinkFieldId
            );

            if (
                linkedRecordsField &&
                linkedRecordsField.config.type ===
                    FieldType.MULTIPLE_RECORD_LINKS &&
                linkedRecordsField.config.options &&
                linkedRecordsField.config.options.linkedTableId &&
                linkedRecordsField.config.options.linkedTableId !== args.tableId
            ) {
                const linkedTableIdNested =
                    await getLinkedTableIdForLookupOfLinkedRecord({
                        tableId:
                            linkedRecordsField.config.options.linkedTableId,
                        userUID: args.userUID,
                        baseId: args.baseId,
                        fieldIdInLinkedTable:
                            config.options.fieldIdInLinkedTable,
                        totalRemainingTriesToResolveLookupLinkedRecordFields:
                            args.totalRemainingTriesToResolveLookupLinkedRecordFields,
                    });
                if (
                    linkedTableIdNested &&
                    airtableLookupFieldConfig.options &&
                    airtableLookupFieldConfig.options.result &&
                    airtableLookupFieldConfig.options.result.type ===
                        FieldType.MULTIPLE_RECORD_LINKS
                ) {
                    const result: AirtableLinkedRecordField['config'] =
                        airtableLookupFieldConfig.options.result;
                    result.options.linkedTableId = linkedTableIdNested;
                }
            }
        }
    }
    return args.fields;
};

export const getLinkedTableIdForLookupOfLinkedRecord = async (args: {
    fieldIdInLinkedTable: string;
    userUID: string;
    baseId: string;
    tableId: string;
    totalRemainingTriesToResolveLookupLinkedRecordFields: number;
}): Promise<string | null> => {
    const { fields } = await fetchFieldsForTable({
        userUID: args.userUID,
        baseId: args.baseId,
        tableId: args.tableId,
        totalRemainingTriesToResolveLookupLinkedRecordFields:
            args.totalRemainingTriesToResolveLookupLinkedRecordFields - 1,
    });

    const field = fields.find(
        (field) => field.id === args.fieldIdInLinkedTable
    );

    if (
        field &&
        field.config &&
        field.config.type === FieldType.MULTIPLE_RECORD_LINKS
    ) {
        return field.config.options.linkedTableId;
    } else {
        return null;
    }
};
