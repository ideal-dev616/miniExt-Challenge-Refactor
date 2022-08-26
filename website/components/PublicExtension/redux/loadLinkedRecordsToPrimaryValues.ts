import { AirtableField, AirtableFieldSet } from 'shared/airtable/types';
import { v1APIRoute } from 'shared/api/routes';
import {
    FetchInitialLinkedRecordsInput,
    FetchInitialLinkedRecordsOutput,
} from 'shared/api/types/fetchAllLinkedRecordPrimaryValues';
import { ExtensionScreen } from 'shared/api/types/loadExtension';
import { executeApiRequest } from 'shared/executeApiRequest';

import { createAsyncThunk } from '@reduxjs/toolkit';

import { getLinkedTableIdsToRecordIds } from '../../../airtable/linked-records/primary-values';
import { RootState } from '../../../redux/store';
import { publicExtensionActions } from './publicExtensionReducer';
import { selectScreenState } from './publicExtensionSelectors';

export const loadLinkedRecordsToPrimaryValues = createAsyncThunk(
    'loadLinkedRecordsToPrimaryValues',
    async (
        args: {
            recordsFields: AirtableFieldSet[];
            airtableFieldsUsedByExtensionPublically: Set<string>;
            airtableFields: AirtableField[];
            extensionId: string;
            extensionSessionId: string;
        },
        thunkAPI
    ) => {
        try {
            const state = thunkAPI.getState() as RootState;

            const screenState = selectScreenState({
                extensionSessionId: args.extensionSessionId,
            })(state);

            if (screenState.result?.type !== 'success') {
                throw new Error(
                    'Unable fetch linked records because the extension was not loaded successfully.'
                );
            }
            if (screenState.extensionScreen !== ExtensionScreen.FORM_LOADED) {
                throw new Error('Not meant to be used on this screen.');
            }
            const linkedTableIdsToRecordIds = getLinkedTableIdsToRecordIds({
                recordsFields: args.recordsFields,
                fields: args.airtableFields,
                airtableFieldsUsedByExtensionPublically:
                    args.airtableFieldsUsedByExtensionPublically,
            });

            const result = await executeApiRequest<
                FetchInitialLinkedRecordsInput,
                FetchInitialLinkedRecordsOutput
            >({
                route: v1APIRoute.fetchInitialLinkedRecords,
                body: {
                    linkedTableIdsToRecordIds,
                },
                source: {
                    type: 'website',
                },
            });

            if (result.type === 'success') {
                const {
                    linkedRecordIdsToAirtableRecords,
                    linkedTableIdsToPrimaryFields,
                    linkedTableFieldIdsToAirtableFields,
                } = result.data;

                thunkAPI.dispatch(
                    publicExtensionActions.addMorePrimaryValuesUsingPrimaryFieldsAndRecords(
                        {
                            linkedRecordIdsToAirtableRecords,
                            linkedTableIdsToRecordIds,
                            linkedTableIdsToPrimaryFields,
                        }
                    )
                );

                thunkAPI.dispatch(
                    publicExtensionActions.addMoreLinkedRecordIdsToAirtableRecords(
                        {
                            linkedRecordIdsToAirtableRecords,
                            linkedTableFieldIdsToAirtableFields,
                        }
                    )
                );
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            thunkAPI.dispatch(
                publicExtensionActions.linkedRecordIdsToPrimaryValuesFailed({
                    message: e.message,
                })
            );
        }
    }
);
