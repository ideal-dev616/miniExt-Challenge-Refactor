import { getIdFromMiniExtFieldWithConfig } from 'shared/extensions/miniExt-field-configs/id-helpers';
import { ALL_EXT_FIELDS_WITH_CONFIGS_KEYS } from 'shared/extensions/sections';
import { ExtensionSettingsState } from 'shared/extensions/settings/field';
import { Extension } from 'shared/generated/extension-versions/current/extension';
import { ExtensionFieldValue } from 'shared/generated/extension-versions/current/ExtensionConfig';
import { AnyMiniExtFieldWithConfig } from 'shared/generated/extension-versions/current/MiniExtFieldConfig';

import { logError } from '../../../utils/logError';
import {
    AllFieldIdsToFieldNamesInBase,
    FieldIdsToFieldIdsNestedInMiniExtFieldConfigs,
} from 'shared/types/linkedRecordsIdsToPrimaryValues';

export const isFieldId = (value: string) =>
    value && value.length === 17 && value.startsWith('fld');

/**
 * @returns the field name for the given airtable field id, or, its airtable field id if we don't want to convert the id to name.
 * Calling this also adds the extension field name to the airtable fields used by the extension publically.
 */
export const getFieldName = (args: {
    airtableFieldId: string;
    extFieldId: string;
    fieldIdsToFieldsNames: { [fieldId: string]: string };
    doNotConvertNamesButDoRemoveUnfound: boolean;
    airtableFieldNamesUsedByExtensionPublically: Set<string>;
    publicExtensionFieldIds: Set<string>;
    parentFieldIdsIfNestedInMiniExtFieldConfig: string[];
    fieldIdsToNestedFieldIdsInMiniExtFieldConfigs: FieldIdsToFieldIdsNestedInMiniExtFieldConfigs;
}): string | null => {
    const fieldName = args.fieldIdsToFieldsNames[args.airtableFieldId];

    if (!fieldName) {
        return null;
    }

    if (args.publicExtensionFieldIds.has(args.extFieldId)) {
        args.airtableFieldNamesUsedByExtensionPublically.add(fieldName);
    }

    // If the field is nested in a miniExtFieldConfig, then we associate this airtable field ID
    // with the parent field's ID.
    for (const parentFieldId of args.parentFieldIdsIfNestedInMiniExtFieldConfig) {
        const nestedFieldIdsInMiniExtFieldConfigs: string[] =
            args.fieldIdsToNestedFieldIdsInMiniExtFieldConfigs[parentFieldId] ??
            [];

        if (
            !nestedFieldIdsInMiniExtFieldConfigs.includes(args.airtableFieldId)
        ) {
            args.fieldIdsToNestedFieldIdsInMiniExtFieldConfigs[parentFieldId] =
                [...nestedFieldIdsInMiniExtFieldConfigs, args.airtableFieldId];
        }
    }

    if (args.doNotConvertNamesButDoRemoveUnfound) {
        return args.airtableFieldId;
    } else {
        return fieldName;
    }
};

export const convertFieldIdsToFieldNamesForValue = async (args: {
    extFieldId: string;
    fieldIdsToFieldsNames: { [fieldId: string]: string };
    value: ExtensionFieldValue;
    doNotConvertNamesButDoRemoveUnfound: boolean;
    baseId: string;
    userUID: string;
    airtableFieldsUsedByExtensionPublically: Set<string>;
    publicExtensionFieldIds: Set<string>;
    fieldIdsToNestedFieldIdsInMiniExtFieldConfigs: FieldIdsToFieldIdsNestedInMiniExtFieldConfigs;
    parentFieldIdsIfNestedInMiniExtFieldConfig: string[];
}): Promise<ExtensionFieldValue> => {
    if (args.value == null) {
        return args.value;
    } else if (Array.isArray(args.value)) {
        if (args.value.length === 0) {
            return args.value;
        }
        if (args.value.some((x: any) => typeof x === 'string')) {
            const resultWithPossibleNulls: (string | null)[] = args.value // We're checking that some is string. It's fine
                .map((value) => {
                    if (typeof value === 'string' && isFieldId(value)) {
                        return getFieldName({
                            airtableFieldId: value,
                            extFieldId: args.extFieldId,
                            publicExtensionFieldIds:
                                args.publicExtensionFieldIds,
                            fieldIdsToFieldsNames: args.fieldIdsToFieldsNames,
                            doNotConvertNamesButDoRemoveUnfound:
                                args.doNotConvertNamesButDoRemoveUnfound,
                            airtableFieldNamesUsedByExtensionPublically:
                                args.airtableFieldsUsedByExtensionPublically,
                            parentFieldIdsIfNestedInMiniExtFieldConfig:
                                args.parentFieldIdsIfNestedInMiniExtFieldConfig,
                            fieldIdsToNestedFieldIdsInMiniExtFieldConfigs:
                                args.fieldIdsToNestedFieldIdsInMiniExtFieldConfigs,
                        });
                    } else {
                        return value as string;
                    }
                });
            const result = resultWithPossibleNulls.filter(Boolean) as string[];
            return result;
        } else {
            if (
                ALL_EXT_FIELDS_WITH_CONFIGS_KEYS.some(
                    (x) => x === args.extFieldId
                )
            ) {
                const fieldsToReturn: AnyMiniExtFieldWithConfig[] = [];

                for (const fieldWithConfigForExtension of args.value) {
                    const fieldWithConfigForExtensionCast =
                        fieldWithConfigForExtension as AnyMiniExtFieldWithConfig;

                    const airtableFieldId = getIdFromMiniExtFieldWithConfig(
                        fieldWithConfigForExtensionCast
                    );

                    const name = getFieldName({
                        airtableFieldId,
                        extFieldId: args.extFieldId,
                        publicExtensionFieldIds: args.publicExtensionFieldIds,
                        fieldIdsToFieldsNames: args.fieldIdsToFieldsNames,
                        doNotConvertNamesButDoRemoveUnfound:
                            args.doNotConvertNamesButDoRemoveUnfound,
                        airtableFieldNamesUsedByExtensionPublically:
                            args.airtableFieldsUsedByExtensionPublically,
                        fieldIdsToNestedFieldIdsInMiniExtFieldConfigs:
                            args.fieldIdsToNestedFieldIdsInMiniExtFieldConfigs,
                        // We do not concat the parent field id here because this is for the field
                        // itself, not the nested fields within this field's config.
                        parentFieldIdsIfNestedInMiniExtFieldConfig:
                            args.parentFieldIdsIfNestedInMiniExtFieldConfig,
                    });

                    if (name) {
                        fieldsToReturn.push({
                            idOrName: {
                                type: 'name',
                                name: name,
                            },
                        });
                    } else {
                        // This happens if a field is saved in firestore but has been removed from Airtable, we simply do not add those fields.
                    }
                }
                return fieldsToReturn;
            } else if (
                args.extFieldId === 'prefillEditingRecordsFieldsAndValues'
            ) {
                // No need to convert anything here.
                return args.value;
            } else {
                logError({
                    error: new Error(
                        `Unknown extFieldId in convertFieldIdsToFieldNamesForValue: '${args.extFieldId}'`
                    ),
                    extensionId: null,
                });
                return args.value;
            }
        }
    } else if (typeof args.value === 'string') {
        if (isFieldId(args.value)) {
            return getFieldName({
                airtableFieldId: args.value,
                extFieldId: args.extFieldId,
                publicExtensionFieldIds: args.publicExtensionFieldIds,
                fieldIdsToFieldsNames: args.fieldIdsToFieldsNames,
                doNotConvertNamesButDoRemoveUnfound:
                    args.doNotConvertNamesButDoRemoveUnfound,
                airtableFieldNamesUsedByExtensionPublically:
                    args.airtableFieldsUsedByExtensionPublically,
                fieldIdsToNestedFieldIdsInMiniExtFieldConfigs:
                    args.fieldIdsToNestedFieldIdsInMiniExtFieldConfigs,
                parentFieldIdsIfNestedInMiniExtFieldConfig:
                    args.parentFieldIdsIfNestedInMiniExtFieldConfig,
            });
        } else {
            return args.value;
        }
    } else if (typeof args.value === 'boolean') {
        return args.value;
    } else if (typeof args.value === 'number') {
        return args.value;
    } else if (typeof args.value === 'object') {
        throw new Error(
            `Unsupported type '${typeof args.value}' for '${args.extFieldId}'`
        );
    } else {
        console.log(
            `Unsupported type '${typeof args.value}' for '${args.extFieldId}'`
        );
        throw new Error(
            `Unsupported type '${typeof args.value}' for '${args.extFieldId}'`
        );
    }
};

const convertFieldIdsToFieldNamesForState = async (args: {
    state: ExtensionSettingsState;
    fieldIdsToFieldsNames: { [fieldId: string]: string };
    doNotConvertNamesButDoRemoveUnfound: boolean;
    userUID: string;
    baseId: string;
    airtableFieldsUsedByExtensionPublically: Set<string>;
    publicExtensionFieldIds: Set<string>;
    fieldIdsToNestedFieldIdsInMiniExtFieldConfigs: FieldIdsToFieldIdsNestedInMiniExtFieldConfigs;
    /**
     * If the state we are converting is a nested field config, then we provide the field ids of
     * the parent fields that this state is nested in.
     */
    parentFieldIdsIfNestedInMiniExtFieldConfig: string[];
}) => {
    for (const key of Object.keys(args.state)) {
        const currentValue = args.state[key];

        if (currentValue) {
            args.state[key] = await convertFieldIdsToFieldNamesForValue({
                extFieldId: key,
                fieldIdsToFieldsNames: args.fieldIdsToFieldsNames,
                value: currentValue,
                doNotConvertNamesButDoRemoveUnfound:
                    args.doNotConvertNamesButDoRemoveUnfound,
                userUID: args.userUID,
                baseId: args.baseId,
                airtableFieldsUsedByExtensionPublically:
                    args.airtableFieldsUsedByExtensionPublically,
                publicExtensionFieldIds: args.publicExtensionFieldIds,
                fieldIdsToNestedFieldIdsInMiniExtFieldConfigs:
                    args.fieldIdsToNestedFieldIdsInMiniExtFieldConfigs,
                parentFieldIdsIfNestedInMiniExtFieldConfig:
                    args.parentFieldIdsIfNestedInMiniExtFieldConfig,
            });
        }
    }
};

export const convertFieldIdsToFieldNamesForExt = async (args: {
    extension: Extension;
    doNotConvertNamesButDoRemoveUnfound?: boolean;
    allFieldIdsToFieldNamesInBase: AllFieldIdsToFieldNamesInBase;
}): Promise<{
    stateWithFieldsAsNames: Extension['state'];
    airtableFieldsUsedByExtensionPublically: Set<string>;
    fieldIdsToNestedFieldIdsInMiniExtFieldConfigs: FieldIdsToFieldIdsNestedInMiniExtFieldConfigs;
}> => {
    const doNotConvertNamesButDoRemoveUnfound =
        args.doNotConvertNamesButDoRemoveUnfound || false;

    const { baseId, userUID, state } = args.extension;

    const publicExtensionFieldIds = new Set(ALL_EXT_FIELDS_WITH_CONFIGS_KEYS);

    const airtableFieldsUsedByExtensionPublically: Set<string> = new Set();

    const fieldIdsToNestedFieldIdsInMiniExtFieldConfigs: FieldIdsToFieldIdsNestedInMiniExtFieldConfigs =
        {};

    await convertFieldIdsToFieldNamesForState({
        state,
        fieldIdsToFieldsNames: args.allFieldIdsToFieldNamesInBase,
        doNotConvertNamesButDoRemoveUnfound,
        userUID,
        baseId,
        airtableFieldsUsedByExtensionPublically,
        publicExtensionFieldIds,
        fieldIdsToNestedFieldIdsInMiniExtFieldConfigs,
        // We pass an empty array here because we are not in a nested field config
        parentFieldIdsIfNestedInMiniExtFieldConfig: [],
    });

    return {
        stateWithFieldsAsNames: state,
        airtableFieldsUsedByExtensionPublically,
        fieldIdsToNestedFieldIdsInMiniExtFieldConfigs,
    };
};
