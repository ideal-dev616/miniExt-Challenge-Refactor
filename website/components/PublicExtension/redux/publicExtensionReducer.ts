import {
    AirtableField,
    AirtableValue,
} from 'shared/airtable/types';
import {
    ExtensionScreen,
    FormErrors,
    FormRecord,
} from 'shared/api/types/loadExtension';

import {
    FieldIdsToAirtableFields,
    LinkedRecordIdsToAirtableRecords,
    LinkedRecordsIdsToPrimaryValues,
    LinkedTableIdsToPrimaryFields,
} from 'shared/types/linkedRecordsIdsToPrimaryValues';
import { Mutable } from 'shared/types/Mutable';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getReadableStringForAirtableValue } from '../../../airtable/getReadableStringForAirtableValue';
import { makeNeedToSyncBaseErrorMessage } from '../../../utils/makeNeedToSyncBaseErrorMessage';
import { PublicExtensionState, ScreenState } from './types';
import { TableIdsToRecordsIdsToFetch } from 'shared/api/types/fetchAllLinkedRecordPrimaryValues';

const extensionNotLoadedError = (variableName: string) =>
    `Could not update ${variableName} because the extension is not loaded.`;

export const invalidScreenError = (
    invalidScreen: ExtensionScreen | undefined
) => `Invalid call. This is not meant to be used on ${invalidScreen} screen.`;

const initialState: PublicExtensionState = {
    sessionIdsToScreenStates: {},
    linkedRecordIdsToPrimaryValues: {
        type: 'notLoaded',
    },
    linkedRecordIdsToAirtableRecords: {
        type: 'notLoaded',
    },
    linkedTableFieldIdsToAirtableFields: { type: 'notLoaded' },
};

const getScreenStateInStateForExtensionId = (args: {
    state: PublicExtensionState;
    extensionSessionId: string;
}): ScreenState | undefined => {
    const screenState =
        args.state.sessionIdsToScreenStates[args.extensionSessionId];
    return screenState;
};

export const publicExtensionSlice = createSlice({
    name: 'publicExtension',
    initialState,
    reducers: {
        setScreenStateForSession: (
            state,
            action: PayloadAction<{
                extensionSessionId: string;
                screenState: ScreenState;
            }>
        ) => {
            state.sessionIdsToScreenStates = {
                ...state.sessionIdsToScreenStates,
                [action.payload.extensionSessionId]: action.payload
                    .screenState as Mutable<ScreenState>,
            };
        },
        updateRecord: (
            state,
            action: PayloadAction<{
                formRecord: FormRecord;
                extensionSessionId: string;
            }>
        ) => {
            const screenState = getScreenStateInStateForExtensionId({
                state,
                extensionSessionId: action.payload.extensionSessionId,
            });

            if (screenState?.extensionScreen === ExtensionScreen.FORM_LOADED) {
                if (screenState.result?.type === 'success') {
                    screenState.result.data.formRecord = action.payload
                        .formRecord as Mutable<FormRecord>;
                } else throw new Error('Record not loaded successfully');
            } else
                throw new Error(
                    invalidScreenError(screenState?.extensionScreen)
                );
        },
        updateRecordValue: (
            state,
            action: PayloadAction<{
                airtableField: AirtableField;
                value: AirtableValue;
                extensionSessionId: string;
            }>
        ) => {
            const screenState = getScreenStateInStateForExtensionId({
                state,
                extensionSessionId: action.payload.extensionSessionId,
            });

            if (screenState?.result && screenState.result.type === 'success') {
                if (
                    screenState.extensionScreen === ExtensionScreen.FORM_LOADED
                ) {
                    const value = action.payload
                        .value as Mutable<AirtableValue>;
                    const fieldName = action.payload.airtableField.name;
                    const maybeLinkedRecordField = Object.values(
                        screenState.result.data.fieldNamesToSchemas
                    ).find(
                        (fieldSchema) =>
                            fieldSchema.name ===
                            action.payload.airtableField.name
                    );

                    if (!maybeLinkedRecordField) {
                        throw new Error(
                            makeNeedToSyncBaseErrorMessage(
                                `Could not find field '${fieldName}' in Airtable.`
                            )
                        );
                    }

                    screenState.result.data.formRecord.data[fieldName] = value;

                    screenState.hasUnsavedChanges = true;

                    return state;
                } else {
                    throw new Error(
                        'Could not update record value because the extension is not loaded.'
                    );
                }
            } else {
                throw new Error(extensionNotLoadedError('record value'));
            }
        },
        updateFormErrors: (
            state,
            action: PayloadAction<{
                formErrors: FormErrors;
                extensionSessionId: string;
            }>
        ) => {
            const screenState = getScreenStateInStateForExtensionId({
                state,
                extensionSessionId: action.payload.extensionSessionId,
            });

            if (screenState?.result && screenState.result.type === 'success') {
                if (
                    screenState.extensionScreen === ExtensionScreen.FORM_LOADED
                ) {
                    screenState.result.data.formErrors =
                        action.payload.formErrors;

                    return state;
                } else {
                    throw new Error(
                        'Could not update form errors because the extension is not loaded.'
                    );
                }
            } else {
                throw new Error(extensionNotLoadedError('record value'));
            }
        },

        updateHasUnsavedChanges: (
            state,
            action: PayloadAction<{
                hasUnsavedChanges: boolean;
                extensionSessionId: string;
            }>
        ) => {
            const screenState = getScreenStateInStateForExtensionId({
                state,
                extensionSessionId: action.payload.extensionSessionId,
            });

            if (screenState?.extensionScreen === ExtensionScreen.FORM_LOADED) {
                screenState.hasUnsavedChanges =
                    action.payload.hasUnsavedChanges;
            } else {
                throw new Error(
                    invalidScreenError(screenState?.extensionScreen)
                );
            }
        },

        addMorePrimaryValuesUsingPrimaryFieldsAndRecords: (
            state,
            action: PayloadAction<{
                linkedRecordIdsToAirtableRecords: LinkedRecordIdsToAirtableRecords;
                linkedTableIdsToRecordIds: TableIdsToRecordsIdsToFetch;
                linkedTableIdsToPrimaryFields: LinkedTableIdsToPrimaryFields;
            }>
        ) => {
            const newLinkedRecordIdsToPrimaryValues =
                state.linkedRecordIdsToPrimaryValues?.type === 'loaded'
                    ? state.linkedRecordIdsToPrimaryValues.data
                    : {};

            const linkedTableIds = Object.keys(
                action.payload.linkedTableIdsToRecordIds
            );

            const linkedTableIdsToRecordIdsSet = linkedTableIds.reduce(
                (acc, tableId) => {
                    acc[tableId] = new Set(
                        action.payload.linkedTableIdsToRecordIds[
                            tableId
                        ].recordIds
                    );
                    return acc;
                },
                {} as { [tableId: string]: Set<string> }
            );

            for (const recordId of Object.keys(
                action.payload.linkedRecordIdsToAirtableRecords
            )) {
                const recordWithLink =
                    action.payload.linkedRecordIdsToAirtableRecords[recordId];

                const linkedTableId = linkedTableIds.find((tableId) =>
                    linkedTableIdsToRecordIdsSet[tableId].has(recordId)
                );

                if (!linkedTableId) {
                    throw new Error(
                        `Could not find linked table id for record id ${recordId}`
                    );
                }

                const primaryField =
                    action.payload.linkedTableIdsToPrimaryFields[linkedTableId];

                newLinkedRecordIdsToPrimaryValues[recordId] =
                    getReadableStringForAirtableValue({
                        value: recordWithLink.fields[primaryField.name],
                        linkedRecordIdsToPrimaryValues:
                            newLinkedRecordIdsToPrimaryValues,
                        airtableFieldConfig: primaryField.config,
                        doNotReturnRecordIdsForLinkedRecords: true,
                    }) || 'Unnamed Record';
            }

            state.linkedRecordIdsToPrimaryValues = {
                type: 'loaded',
                data: newLinkedRecordIdsToPrimaryValues,
            };
        },

        addMoreLinkedRecordIdsToPrimaryValues: (
            state,
            action: PayloadAction<{
                linkedRecordIdsToPrimaryValues: LinkedRecordsIdsToPrimaryValues;
            }>
        ) => {
            const existingLinkedRecordIdsToPrimaryValues =
                state.linkedRecordIdsToPrimaryValues?.type === 'loaded'
                    ? state.linkedRecordIdsToPrimaryValues.data
                    : {};

            state.linkedRecordIdsToPrimaryValues = {
                type: 'loaded',
                data: {
                    ...existingLinkedRecordIdsToPrimaryValues,
                    ...action.payload.linkedRecordIdsToPrimaryValues,
                },
            };
        },

        addMoreLinkedRecordIdsToAirtableRecords: (
            state,
            action: PayloadAction<{
                linkedRecordIdsToAirtableRecords: LinkedRecordIdsToAirtableRecords;
                linkedTableFieldIdsToAirtableFields: FieldIdsToAirtableFields;
            }>
        ) => {
            const existingLinkedRecordIdsToAirtableRecords =
                state.linkedRecordIdsToAirtableRecords.type === 'loaded'
                    ? state.linkedRecordIdsToAirtableRecords.data
                    : {};

            state.linkedRecordIdsToAirtableRecords = {
                type: 'loaded',
                data: {
                    ...existingLinkedRecordIdsToAirtableRecords,
                    ...(action.payload
                        .linkedRecordIdsToAirtableRecords as Mutable<LinkedRecordIdsToAirtableRecords>),
                },
            };

            const existinglinkedTablesFieldsIdsToAirtableFields =
                state.linkedTableFieldIdsToAirtableFields.type === 'loaded'
                    ? state.linkedTableFieldIdsToAirtableFields.data
                    : {};

            state.linkedTableFieldIdsToAirtableFields = {
                type: 'loaded',
                data: {
                    ...existinglinkedTablesFieldsIdsToAirtableFields,
                    ...action.payload.linkedTableFieldIdsToAirtableFields,
                },
            };

            return state;
        },

        linkedRecordIdsToPrimaryValuesFailed: (
            state,
            action: PayloadAction<{
                message: string;
            }>
        ) => {
            if (state.linkedRecordIdsToPrimaryValues?.type === 'loaded') {
                state.linkedRecordIdsToPrimaryValues = {
                    ...state.linkedRecordIdsToPrimaryValues,
                    errorMessage: action.payload.message,
                };
            } else {
                state.linkedRecordIdsToPrimaryValues = {
                    type: 'failed',
                    errorMessage: action.payload.message,
                };
            }
        },
    },
});

export const publicExtensionActions = publicExtensionSlice.actions;

export default publicExtensionSlice.reducer;
