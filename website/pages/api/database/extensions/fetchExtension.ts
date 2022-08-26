import {
    AnyExtensionVersion,
    currentExtensionsVersionIndex,
    Extension,
} from 'shared/generated/extension-versions/current/extension';

import { convertFieldIdsToFieldNamesForExt } from '../../base-schema/fieldName-helpers';
import { fetchAllFieldIdsToFieldNamesInBase } from './fetchAllFieldIdsToFieldNamesInBase';
import {
    AllFieldIdsToFieldNamesInBase,
    FieldIdsToFieldIdsNestedInMiniExtFieldConfigs,
} from 'shared/types/linkedRecordsIdsToPrimaryValues';
import { ExtensionType } from 'shared/extensions/sections';

type Result = {
    extension: Extension;
    /**
     * These are not just all the fields in the form. These
     * are all the fields on the form + fields used for things like form title, cover img, etc.
     * defined in the extensions's state
     */
    airtableFieldsUsedByExtensionPublically: string[];
    allFieldIdsToFieldNamesInBase: AllFieldIdsToFieldNamesInBase;
    fieldIdsToNestedFieldIdsInMiniExtFieldConfigs: FieldIdsToFieldIdsNestedInMiniExtFieldConfigs;
};

const makeExtension = (): Extension => ({
    type: ExtensionType.FORM,
    version: 3,
    id: '123',
    name: 'name',
    userUID: 'userUID',
    baseId: 'appbVvNerqsCChIH1',
    state: {
        tableId: 'tblWKJgDuc7j8JTBD',
        formFields: [
            {
                idOrName: {
                    type: 'id',
                    id: 'fld1FIhIm8alVGOwE',
                },
            },
            {
                idOrName: {
                    type: 'id',
                    id: 'fldBkouHIRcYyBqBH',
                },
            },
        ],
    },
});

/**
 * Avoid using this directly. Use fetchExtension instead.
 */
const fetchCachedExtension = async (): Promise<Result> => {
    const execute = async (
        extension: AnyExtensionVersion | undefined
    ): Promise<Result> => {
        if (!extension) {
            throw new Error('Could not find extension.');
        } else if (extension.version > currentExtensionsVersionIndex) {
            throw new Error(
                'The requested extension is using a newer version than the website.'
            );
        } else if (extension.version === currentExtensionsVersionIndex) {
            const allFieldIdsToFieldNamesInBase =
                await fetchAllFieldIdsToFieldNamesInBase();

            const conversionResult = await convertFieldIdsToFieldNamesForExt({
                extension,
                allFieldIdsToFieldNamesInBase,
            });

            extension.state = conversionResult.stateWithFieldsAsNames;

            console.log(
                `Fetched extension data with ID '${extension.id}' for user with ID '${extension.userUID}'`
            );

            return {
                extension,
                airtableFieldsUsedByExtensionPublically: Array.from(
                    conversionResult.airtableFieldsUsedByExtensionPublically
                ),
                allFieldIdsToFieldNamesInBase,
                fieldIdsToNestedFieldIdsInMiniExtFieldConfigs:
                    conversionResult.fieldIdsToNestedFieldIdsInMiniExtFieldConfigs,
            };
        } else {
            throw new Error(
                'The requested extension is using an older version than the website.'
            );
        }
    };

    return await execute(makeExtension());
};

export const fetchExtension = async (): Promise<{
    type: 'loaded';
    extension: Extension;
    airtableFieldsUsedByExtensionPublically: Set<string>;
    allFieldIdsToFieldNamesInBase: AllFieldIdsToFieldNamesInBase;
    fieldIdsToNestedFieldIdsInMiniExtFieldConfigs: FieldIdsToFieldIdsNestedInMiniExtFieldConfigs;
}> => {
    const {
        extension,
        airtableFieldsUsedByExtensionPublically,
        allFieldIdsToFieldNamesInBase,
        fieldIdsToNestedFieldIdsInMiniExtFieldConfigs,
    } = await fetchCachedExtension();

    return {
        type: 'loaded',
        extension,
        airtableFieldsUsedByExtensionPublically: new Set(
            airtableFieldsUsedByExtensionPublically
        ),
        allFieldIdsToFieldNamesInBase,
        fieldIdsToNestedFieldIdsInMiniExtFieldConfigs,
    };
};

export const fetchExtensionAndVerifyPassword = async (): Promise<Result> => {
    const result = await fetchExtension();

    return {
        extension: result.extension,
        airtableFieldsUsedByExtensionPublically: Array.from(
            result.airtableFieldsUsedByExtensionPublically
        ),
        allFieldIdsToFieldNamesInBase: result.allFieldIdsToFieldNamesInBase,
        fieldIdsToNestedFieldIdsInMiniExtFieldConfigs:
            result.fieldIdsToNestedFieldIdsInMiniExtFieldConfigs,
    };
};
