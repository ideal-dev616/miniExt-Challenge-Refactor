import { AirtableField, FieldNamesToFields } from 'shared/airtable/types';
import { FieldNamesToMiniExtConfig } from 'shared/extensions/settings/field';
import { AnyMiniExtFieldWithConfig } from 'shared/generated/extension-versions/current/MiniExtFieldConfig';

export const getFieldNamesToAirtableField = (airtableFields: AirtableField[]) =>
    airtableFields.reduce((acc, curr) => {
        acc[curr.name] = curr;
        return acc;
    }, {} as FieldNamesToFields);

export const getFieldsIdsToFieldsConfigs = (
    fields: AnyMiniExtFieldWithConfig[]
) =>
    fields.reduce((acc, curr) => {
        if (curr.idOrName.type !== 'id') {
            throw new Error(
                'Invalid idOrName type in getFieldsIdsToFieldsConfigs'
            );
        }
        acc[curr.idOrName.id] = curr;
        return acc;
    }, {} as FieldNamesToMiniExtConfig);

export const getFieldsNamesToFieldsConfigs = (
    fields: AnyMiniExtFieldWithConfig[]
) =>
    fields.reduce((acc, curr) => {
        if (curr.idOrName.type !== 'name') {
            throw new Error(
                'Invalid idOrName type in getFieldsIdsToFieldsConfigs'
            );
        }
        acc[curr.idOrName.name] = curr;
        return acc;
    }, {} as FieldNamesToMiniExtConfig);
