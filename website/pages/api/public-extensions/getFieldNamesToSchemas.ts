import { AirtableField, FieldNamesToFields } from 'shared/airtable/types';
import { AnyMiniExtFieldWithConfig } from 'shared/generated/extension-versions/current/MiniExtFieldConfig';
import { ExtFieldsWithConfigKey } from 'shared/extensions/sections';
import { FieldNamesToMiniExtConfig } from 'shared/extensions/settings/field';

export const getFieldNamesToSchemas = (args: {
    airtableFieldsUsedPublically: AirtableField[];
    fieldNamesToMiniExtFieldConfigs: FieldNamesToMiniExtConfig;
    extFieldsWithConfigKey: ExtFieldsWithConfigKey;
}) => {
    const {
        airtableFieldsUsedPublically: fieldsUsedPublically,
        fieldNamesToMiniExtFieldConfigs: fieldNamesToFieldConfigs,
    } = args;

    const fieldNamesToSchemas: FieldNamesToFields = {};

    // Align field configs to Airtable fields
    // User may have updated field configs without saving the form
    // with the app open.
    for (const field of fieldsUsedPublically) {
        const config: AnyMiniExtFieldWithConfig | null =
            fieldNamesToFieldConfigs[field.name];

        if (!config) {
            continue;
        }

        fieldNamesToSchemas[field.name] = field;
    }

    return fieldNamesToSchemas;
};
