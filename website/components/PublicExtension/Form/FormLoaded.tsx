import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { FrontendPublicExtensionContext } from 'shared/extensions/PublicExtensionContext';
import { useAppDispatch } from '../../../redux/hooks';
import { Alert } from '../../reusables/Alert';
import { EditableFieldRenderer } from '../../reusables/EditableFieldRenderer';
import ErrorMessage from '../../reusables/ErrorMessage';
import { loadLinkedRecordsToPrimaryValues } from '../redux/loadLinkedRecordsToPrimaryValues';
import {
    useAirtableFields,
    useAirtableFieldsUsedByExtensionPublically,
    useFormFields,
    useFormErrors,
    useFormRecord,
} from '../redux/publicExtensionSelectors';

export type FormSaveState =
    | 'saving'
    | 'error'
    | 'idle'
    | 'deleting'
    | 'deleted'
    | 'success';

type Props = {
    extensionId: string;
    extensionSessionId: string;
    context: FrontendPublicExtensionContext;
    reload: () => Promise<void>;
};

const FormLoaded = (props: Props) => {
    const sessionIdArgs = {
        extensionSessionId: props.extensionSessionId,
    };

    const formRecord = useFormRecord(sessionIdArgs);
    const formErros = useFormErrors(sessionIdArgs);

    const formFields = useFormFields(sessionIdArgs);
    const dispatch = useAppDispatch();
    const airtableFields = useAirtableFields(sessionIdArgs);
    const airtableFieldsUsedByExtensionPublically =
        useAirtableFieldsUsedByExtensionPublically(sessionIdArgs);
    const [saveState] = useState<FormSaveState>('idle');
    const [errorMessage] = useState<string | null>(null);

    const recordData = formRecord.data;
    useEffect(() => {
        dispatch(
            loadLinkedRecordsToPrimaryValues({
                recordsFields: [formRecord.data],
                airtableFieldsUsedByExtensionPublically,
                airtableFields,
                extensionId: props.extensionId,
                extensionSessionId: props.extensionSessionId,
            })
        );
        // We only want this to run on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div
                className={
                    `flex-1 justify-center flex flex-row ` +
                    (saveState === 'deleting'
                        ? ' pointer-events-none opacity-50 '
                        : '') +
                    (props.context.type === 'direct-url' ? 'min-h-screen' : '')
                }
            >
                <div
                    className='flex flex-row flex-1 max-w-lg'
                    style={{
                        height: 'fit-content',
                    }}
                >
                    <div
                        className={`flex flex-row flex-1 w-full ${
                            props.context.type === 'modal'
                                ? ''
                                : 'pt-10 mt-5 pb-10'
                        }`}
                    >
                        <div className='flex flex-row flex-1 w-full mx-auto bg-white border-2 rounded-md shadow'>
                            {(() => {
                                switch (saveState) {
                                    case 'deleted':
                                        return (
                                            <div className='flex flex-1 w-72'>
                                                <Alert
                                                    body='You can close this page'
                                                    heading='Record successfully deleted'
                                                />
                                            </div>
                                        );

                                    case 'success':
                                        return null;

                                    default:
                                        return (
                                            <div
                                                className={`flex flex-col flex-1 rounded-md w-full`}
                                            >
                                                <div
                                                    className={clsx(
                                                        'flex flex-col flex-1 w-full px-4 py-5 space-y-6 sm:p-6',
                                                        saveState ===
                                                            'saving' &&
                                                            'pointer-events-none select-none'
                                                    )}
                                                >
                                                    {formFields.map(
                                                        (formField) => {
                                                            return (
                                                                <EditableFieldRenderer
                                                                    formRecord={
                                                                        formRecord
                                                                    }
                                                                    airtableFields={
                                                                        airtableFields
                                                                    }
                                                                    key={
                                                                        formField.id
                                                                    }
                                                                    currentAirtableField={
                                                                        formField
                                                                    }
                                                                    value={
                                                                        recordData[
                                                                            formField
                                                                                .name
                                                                        ]
                                                                    }
                                                                    extensionId={
                                                                        props.extensionId
                                                                    }
                                                                    extensionSessionId={
                                                                        props.extensionSessionId
                                                                    }
                                                                    errorMessage={
                                                                        formErros[
                                                                            formField
                                                                                .name
                                                                        ]
                                                                    }
                                                                />
                                                            );
                                                        }
                                                    )}
                                                </div>
                                                {errorMessage ? (
                                                    <ErrorMessage
                                                        message={errorMessage}
                                                    />
                                                ) : null}
                                            </div>
                                        );
                                }
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormLoaded;
