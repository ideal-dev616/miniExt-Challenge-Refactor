import { AirtableField } from 'shared/airtable/types';

export const getPrimaryFieldInFields = (args: {
    fields: AirtableField[];
}): AirtableField => {
    const primaryField = args.fields.find((field) => field.isPrimaryField);

    if (!primaryField) {
        throw new Error(`Could not find a primary field for the table.`);
    }

    return primaryField;
};
