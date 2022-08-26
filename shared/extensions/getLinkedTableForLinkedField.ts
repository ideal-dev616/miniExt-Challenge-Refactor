import { FieldType } from '@airtable/blocks/models';
import {
    AirtableBase,
    AirtableField,
    AirtableTable,
} from 'shared/airtable/types';

const getLinkedTableIdForField = (args: {
    airtableFieldConfig: AirtableField['config'];
    base: AirtableBase;
}): string | null => {
    if (args.airtableFieldConfig.type === FieldType.MULTIPLE_RECORD_LINKS) {
        return args.airtableFieldConfig.options.linkedTableId;
    } else if (
        args.airtableFieldConfig.type === FieldType.MULTIPLE_LOOKUP_VALUES &&
        args.airtableFieldConfig.options.result?.type ===
            FieldType.MULTIPLE_RECORD_LINKS &&
        args.airtableFieldConfig.options.recordLinkFieldId
    ) {
        const recordLinkFieldId =
            args.airtableFieldConfig.options.recordLinkFieldId;

        const getLinkedTableId = () => {
            for (const table of args.base.tables) {
                for (const field of table.fields) {
                    if (
                        field.config.type === FieldType.MULTIPLE_RECORD_LINKS &&
                        field.id === recordLinkFieldId
                    ) {
                        return field.config.options.linkedTableId;
                    }
                }
            }
            return null;
        };

        return getLinkedTableId();
    }

    return null;
};

/**
 * Returns the linked table for the given field, if it exists. This is used
 * for linked record fields and lookup fields that are linked records.
 */
export const getLinkedTableForLinkedField = (args: {
    airtableFieldConfig: AirtableField['config'];
    base: AirtableBase;
}): AirtableTable | null => {
    const linkedTableId = getLinkedTableIdForField({
        airtableFieldConfig: args.airtableFieldConfig,
        base: args.base,
    });

    const linkedTable = args.base.tables.find(
        (table) => linkedTableId && table.id === linkedTableId
    );

    return linkedTable ?? null;
};
