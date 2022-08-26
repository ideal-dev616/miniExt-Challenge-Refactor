import { AirtableField } from '../airtable/types';
import { AnyMiniExtFieldWithConfig } from 'shared/generated/extension-versions/current/MiniExtFieldConfig';

/**
 * Opposite of {@link getFieldForConfig}
 * @param configs
 * @param field
 */
export const getConfigForField = (
    configs: AnyMiniExtFieldWithConfig[],
    field: AirtableField
): AnyMiniExtFieldWithConfig | undefined =>
    configs.find((config) => isConfigForField(field, config));

export const isConfigForField = (
    field: AirtableField,
    config: AnyMiniExtFieldWithConfig
) => {
    switch (config.idOrName.type) {
        case 'id':
            return field.id === config.idOrName.id;
        case 'name':
            return field.name === config.idOrName.name;
    }
};
