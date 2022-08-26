import { FC } from 'react';

import { AirtableField, AirtableValue } from 'shared/airtable/types';
import { useAppDispatch } from '../../redux/hooks';
import FieldEditor from '../Fields/FieldRenderer';
import { publicExtensionActions } from '../PublicExtension/redux/publicExtensionReducer';
import { FormRecord } from 'shared/api/types/loadExtension';

interface EditableFieldRendererProps {
    currentAirtableField: AirtableField;
    airtableFields: AirtableField[];
    formRecord: FormRecord;
    value: AirtableValue;
    errorMessage: string | undefined;
    extensionId: string;
    extensionSessionId: string;
}

export const EditableFieldRenderer: FC<EditableFieldRendererProps> = (
    props
) => {
    const dispatch = useAppDispatch();

    const setValue = (value: AirtableValue) => {
        dispatch(
            publicExtensionActions.updateRecordValue({
                airtableField: props.currentAirtableField,
                value,
                extensionSessionId: props.extensionSessionId,
            })
        );
    };

    const effectiveTitle = props.currentAirtableField.name;

    return (
        <div key={props.currentAirtableField.id}>
            <label
                className='text-sm font-medium text-gray-700'
                htmlFor={props.currentAirtableField.id}
            >
                {effectiveTitle}{' '}
            </label>

            <div className='mt-1'>
                <FieldEditor
                    airtableField={props.currentAirtableField}
                    value={props.value}
                    setValue={setValue}
                    extensionId={props.extensionId}
                    extensionSessionId={props.extensionSessionId}
                />
            </div>
            {props.errorMessage ? (
                <div className='mt-1 text-xs text-red-400'>
                    {props.errorMessage}
                </div>
            ) : null}
        </div>
    );
};
