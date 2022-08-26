import { useMemo } from 'react';
import { AirtableField, FieldNamesToFields } from 'shared/airtable/types';
import {
    ExtensionScreen,
    FormErrors,
    FormLoadedOutputData,
    FormRecord,
} from 'shared/api/types/loadExtension';
import {
    FieldIdsToAirtableFields,
    LinkedRecordIdsToAirtableRecords,
    LinkedRecordsIdsToPrimaryValues,
} from 'shared/types/linkedRecordsIdsToPrimaryValues';
import { LoadingState } from 'shared/utils/loadingState';

import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { invalidScreenError } from './publicExtensionReducer';
import { ScreenState } from './types';

export const selectScreenState = (args: { extensionSessionId: string }) => {
    return (state: RootState): ScreenState => {
        const screenState =
            state.publicExtension.sessionIdsToScreenStates[
                args.extensionSessionId
            ];

        if (screenState) {
            return screenState;
        } else {
            throw new Error('Could not find screen state for session.');
        }
    };
};

export const selectPublicExtensionErrorMessage = (
    state: ScreenState
): string | null => {
    const result = state.result;

    if (result?.type === 'error') {
        return result.message ?? 'Could not load extension';
    } else {
        return null;
    }
};

export const usePublicExtensionErrorMessage = (args: {
    extensionSessionId: string;
}) => {
    const screenState = useAppSelector(selectScreenState(args));
    return selectPublicExtensionErrorMessage(screenState);
};

/**
 * Used for form extension loaded screen
 */
export const selectLoadedExtension = (
    state: ScreenState
): FormLoadedOutputData => {
    if (state.extensionScreen === ExtensionScreen.FORM_LOADED) {
        if (state.result?.type === 'success') return state.result.data;
        else
            throw new Error(
                'Unable to select because result is not loaded successfully.'
            );
    } else throw new Error(invalidScreenError(state.extensionScreen));
};

export const selectFieldNamesToAirtableFieldSchemas = (
    state: ScreenState
): FieldNamesToFields => {
    return selectLoadedExtension(state).fieldNamesToSchemas;
};

export const selectAirtableFields = (state: ScreenState): AirtableField[] => {
    const loadedExtension = selectLoadedExtension(state);

    return Object.values(loadedExtension.fieldNamesToSchemas).map(
        (schema) => schema
    );
};

export const useAirtableFields = (args: {
    extensionSessionId: string;
}): AirtableField[] => {
    const screenState = useAppSelector(selectScreenState(args));
    return selectAirtableFields(screenState);
};

export const useFieldNamesToAirtableFieldSchemas = (args: {
    extensionSessionId: string;
}): FieldNamesToFields => {
    const screenState = useAppSelector(selectScreenState(args));
    return selectFieldNamesToAirtableFieldSchemas(screenState);
};

export const useMappedAirtableFieldSchemas = (args: {
    extensionSessionId: string;
}): FieldNamesToFields => {
    const screenState = useAppSelector(selectScreenState(args));
    const airtableFieldSchemas =
        selectFieldNamesToAirtableFieldSchemas(screenState);
    return airtableFieldSchemas;
};

export const useFieldsInForm = (args: { extensionSessionId: string }) => {
    const screenState = useAppSelector(selectScreenState(args));
    if (screenState.extensionScreen === ExtensionScreen.FORM_LOADED) {
        if (screenState.result?.type === 'success') {
            return screenState.result.data.fieldsInForm;
        } else throw new Error('Extension not loaded.');
    } else throw new Error(invalidScreenError(screenState.extensionScreen));
};

export const useFormFields = (args: {
    extensionSessionId: string;
}): AirtableField[] => {
    const screenState = useAppSelector(selectScreenState(args));

    const fieldNamesToAirtableFieldSchemas =
        selectFieldNamesToAirtableFieldSchemas(screenState);
    const fieldsInForm = useFieldsInForm(args);

    return useMemo(() => {
        return fieldsInForm
            .map((fieldName) => {
                if (fieldNamesToAirtableFieldSchemas[fieldName])
                    return fieldNamesToAirtableFieldSchemas[fieldName];
                return null;
            })
            .filter(
                (formFieldOrNull) => formFieldOrNull != null
            ) as AirtableField[];
    }, [fieldNamesToAirtableFieldSchemas, fieldsInForm]);
};

export const selectFormRecord = (state: ScreenState): FormRecord => {
    const loadedExtension = selectLoadedExtension(state);

    return loadedExtension.formRecord;
};

export const selectFormErros = (state: ScreenState): FormErrors => {
    const loadedExtension = selectLoadedExtension(state);

    return loadedExtension.formErrors;
};

/**
 * These are not just all the fields in the form. These
 * are all the fields on the form + fields used for things like form title, cover img, etc.
 * defined in the extensions's state
 */
export const selectAirtableFieldsUsedByExtensionPublically = (
    state: ScreenState
): string[] => {
    const loadedExtension = selectLoadedExtension(state);

    return loadedExtension.airtableFieldsUsedByExtensionPublically;
};

export const useFormRecord = (args: {
    extensionSessionId: string;
}): FormRecord => {
    const screenState = useAppSelector(selectScreenState(args));

    return selectFormRecord(screenState);
};

export const useFormErrors = (args: {
    extensionSessionId: string;
}): FormErrors => {
    const screenState = useAppSelector(selectScreenState(args));

    return selectFormErros(screenState);
};

/**
 * These are not just all the fields in the form. These
 * are all the fields on the form + fields used for things like form title, cover img, etc.
 * defined in the extensions's state
 */
export const useAirtableFieldsUsedByExtensionPublically = (args: {
    extensionSessionId: string;
}): Set<string> => {
    const screenState = useAppSelector(selectScreenState(args));

    const airtableFieldsUsedByExtensionPublically =
        selectAirtableFieldsUsedByExtensionPublically(screenState);

    return useMemo(
        () => new Set(airtableFieldsUsedByExtensionPublically),
        [airtableFieldsUsedByExtensionPublically]
    );
};

const selectLinkedRecordIdsToPrimaryValues = (
    state: RootState
): LoadingState<LinkedRecordsIdsToPrimaryValues> => {
    return state.publicExtension.linkedRecordIdsToPrimaryValues;
};

export const useLinkedRecordIdsToPrimaryValues =
    (): LoadingState<LinkedRecordsIdsToPrimaryValues> => {
        const linkedRecordIdsToPrimaryValues = useAppSelector(
            selectLinkedRecordIdsToPrimaryValues
        );

        return linkedRecordIdsToPrimaryValues;
    };

const selectLinkedRecordIdsToAirtableRecords = (
    state: RootState
): LoadingState<LinkedRecordIdsToAirtableRecords> => {
    return state.publicExtension.linkedRecordIdsToAirtableRecords;
};

export const useLinkedRecordIdsToAirtableRecords =
    (): LoadingState<LinkedRecordIdsToAirtableRecords> => {
        const linkedRecordIdsToAirtableRecords = useAppSelector(
            selectLinkedRecordIdsToAirtableRecords
        );

        return linkedRecordIdsToAirtableRecords;
    };

const selectLinkedTableFieldIdsToAirtableFields = (
    state: RootState
): LoadingState<FieldIdsToAirtableFields> => {
    return state.publicExtension.linkedTableFieldIdsToAirtableFields;
};

export const useLinkedTableFieldIdsToAirtableFields =
    (): LoadingState<FieldIdsToAirtableFields> => {
        const linkedTableFieldIdsToAirtableFields = useAppSelector(
            selectLinkedTableFieldIdsToAirtableFields
        );

        return linkedTableFieldIdsToAirtableFields;
    };

export const selectExtensionScreenType = (
    state: ScreenState
): ExtensionScreen | undefined => {
    return state.extensionScreen;
};

export const useExtensionScreenType = (args: {
    extensionSessionId: string;
}): ExtensionScreen | undefined => {
    const screenState = useAppSelector(selectScreenState(args));

    return selectExtensionScreenType(screenState);
};
