import { AirtableField, AirtableRecord } from 'shared/airtable/types';
import {
    ExtensionScreen,
    FormLoadedOutput,
    FormRecord,
    Query,
} from 'shared/api/types/loadExtension';
import { ExtFieldsWithConfigKey } from 'shared/extensions/sections';
import { Extension } from 'shared/generated/extension-versions/current/extension';
import { makeNeedToSyncBaseErrorMessage } from '../../../../utils/makeNeedToSyncBaseErrorMessage';
import { fetchAirtableRecordsFirstPage } from '../../airtable';
import { getAirtableSelectOptionsForRecordId } from '../../airtable/select-options-helpers';
import {
    getFieldNamesToAirtableField,
    getFieldsNamesToFieldsConfigs,
} from '../../helpers/field-helpers';

import { getFieldNamesToSchemas } from '../getFieldNamesToSchemas';
import { getNameFromMiniExtFieldWithConfig } from 'shared/extensions/miniExt-field-configs/id-helpers';
import { assertUnreachable } from 'shared/utils/assertUnreachable';

export type DataForLoadingFormForLoadedScreen = {
    extension: Extension;
    recordInfo:
        | {
              type: 'recordId';
              recordId: string;
          }
        | { type: 'record'; record: AirtableRecord }
        | null;
    loggedInUserUID: string | null;
    loggedInUserEmail: string | null;
    searchQuery: Query;
    airtableFields: AirtableField[];
    airtableFieldsUsedByExtensionPublically: Set<string>;
    clientIp: string | undefined;
    userAgent: string | undefined;
};
export const loadFormForLoadedScreen = async (
    data: DataForLoadingFormForLoadedScreen
): Promise<FormLoadedOutput> => {
    const {
        extension,
        airtableFields,
        airtableFieldsUsedByExtensionPublically,
    } = data;

    if (extension.state.formFields.length === 0) {
        throw new Error(
            `Could not find any fields in this ${extension.type}. You can add fields to this ${extension.type} in the miniExtensions Airtable marketplace app.`
        );
    }

    const airtableFieldsUsedByExtensionPublicallyArray = Array.from(
        airtableFieldsUsedByExtensionPublically
    );

    const getAirtableRecord = async (): Promise<AirtableRecord | null> => {
        if (!data.recordInfo) {
            return null;
        }
        switch (data.recordInfo.type) {
            case 'record':
                return data.recordInfo.record;
            case 'recordId': {
                const airtableSelectOptions = data.recordInfo.recordId
                    ? getAirtableSelectOptionsForRecordId({
                          recordId: data.recordInfo.recordId,
                          viewId: null,
                          fieldsToInclude:
                              airtableFieldsUsedByExtensionPublicallyArray,
                      })
                    : null;

                const records = airtableSelectOptions
                    ? await fetchAirtableRecordsFirstPage({
                          userUID: extension.userUID,
                          baseId: extension.baseId,
                          tableId: extension.state.tableId,
                          selectOptions: airtableSelectOptions,
                      })
                    : null;

                const airtableRecord = records ? records[0] : null;

                return airtableRecord;
            }

            default:
                assertUnreachable(data.recordInfo);
        }
    };

    const airtableRecord = await getAirtableRecord();

    const formRecord: FormRecord = airtableRecord
        ? {
              type: 'edit',
              recordId: airtableRecord.id,
              data: {
                  ...airtableRecord.fields,
              },
          }
        : {
              type: 'create',
              data: {},
          };

    const fieldNamesToAirtableFields =
        getFieldNamesToAirtableField(airtableFields);

    const fieldNamesToFieldConfigs = getFieldsNamesToFieldsConfigs(
        extension.state.formFields
    );

    for (const fieldName of Object.keys(formRecord.data)) {
        if (!airtableFieldsUsedByExtensionPublically.has(fieldName)) {
            delete formRecord.data[fieldName];
            continue;
        }

        const field = fieldNamesToAirtableFields[fieldName];

        if (!field)
            throw new Error(
                makeNeedToSyncBaseErrorMessage(
                    'Airtable field not found for form.'
                )
            );
    }

    const fieldsUsedPublically = airtableFields.filter((field) =>
        airtableFieldsUsedByExtensionPublically.has(field.name)
    );
    const fieldNamesToSchemas = getFieldNamesToSchemas({
        airtableFieldsUsedPublically: fieldsUsedPublically,
        fieldNamesToMiniExtFieldConfigs: fieldNamesToFieldConfigs,
        extFieldsWithConfigKey: ExtFieldsWithConfigKey.formFieldsWithConfigsKey,
    });

    return {
        extensionScreen: ExtensionScreen.FORM_LOADED,
        extensionId: extension.id,
        payload: {
            formRecord,
            extensionUserUID: extension.userUID,
            formErrors: {},
            airtableFieldsUsedByExtensionPublically:
                airtableFieldsUsedByExtensionPublicallyArray,
            fieldNamesToSchemas,
            fieldsInForm: extension.state.formFields
                .map<string | null>((miniExtField) =>
                    getNameFromMiniExtFieldWithConfig(miniExtField)
                )
                .filter((name) => name != null) as string[],
            extensionType: extension.type,
        },
    };
};
