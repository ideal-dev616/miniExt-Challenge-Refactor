import { ExtensionFieldValue } from '../../generated/extension-versions/current/ExtensionConfig';
import { AnyMiniExtFieldWithConfig } from 'shared/generated/extension-versions/current/MiniExtFieldConfig';

export type ExtensionSettingsState = {
    [fieldId: string]: ExtensionFieldValue;
};

export type FieldNamesToMiniExtConfig = {
    [fieldName: string]: AnyMiniExtFieldWithConfig;
};
