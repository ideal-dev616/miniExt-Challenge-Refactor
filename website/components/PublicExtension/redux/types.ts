import {
    ExtensionScreen,
    FormLoadedOutputData,
} from 'shared/api/types/loadExtension';
import { ExecuteApiRequestResult } from 'shared/executeApiRequest';
import {
    FieldIdsToAirtableFields,
    LinkedRecordIdsToAirtableRecords,
    LinkedRecordsIdsToPrimaryValues,
} from 'shared/types/linkedRecordsIdsToPrimaryValues';
import { LoadingState } from 'shared/utils/loadingState';

export type PublicExtensionExecuteApiRequestResultForLoadedScreen =
    ExecuteApiRequestResult<FormLoadedOutputData>;

type FormLoadedState = {
    extensionScreen: ExtensionScreen.FORM_LOADED;
    result: PublicExtensionExecuteApiRequestResultForLoadedScreen | null;

    /**
     * This is true if the user has made changes on the form but they haven't been saved to Airtable yet.
     */
    hasUnsavedChanges: boolean;
};

export type ScreenState = FormLoadedState;

export type SessionIdsToScreenStates = {
    [sessionId: string]: ScreenState;
};

export type PublicExtensionState = {
    /**
     * We assign a unique ID to each session. This is used to separate the state of each extension.
     */
    sessionIdsToScreenStates: SessionIdsToScreenStates;
    linkedRecordIdsToPrimaryValues: LoadingState<LinkedRecordsIdsToPrimaryValues>;
    linkedRecordIdsToAirtableRecords: LoadingState<LinkedRecordIdsToAirtableRecords>;
    linkedTableFieldIdsToAirtableFields: LoadingState<FieldIdsToAirtableFields>;
};
