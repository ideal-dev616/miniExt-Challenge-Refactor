import {
    AirtableField,
    AirtableLinkedRecordField,
    AirtableValue,
} from 'shared/airtable/types';
import { FieldType } from '@airtable/blocks/models';
import LinkedRecordsField from './LinkedRecordsField';
import SingleLineTextField from './SingleLineTextField';
import UnexpectedFieldValue from './UnexpectedFieldValue';

type Props = {
    airtableField: AirtableField;
    value: AirtableValue;
    extensionId: string;
    extensionSessionId: string;
    setValue: (value: AirtableValue) => void;
};

const FieldRenderer = (props: Props) => {
    const { airtableField } = props;
    switch (airtableField.config.type) {
        case FieldType.SINGLE_LINE_TEXT: {
            if (props.value != null && typeof props.value !== 'string') {
                return <UnexpectedFieldValue />;
            }

            return (
                <SingleLineTextField
                    value={props.value}
                    setValue={props.setValue}
                />
            );
        }

        case FieldType.MULTIPLE_RECORD_LINKS: {
            if (props.value != null && !Array.isArray(props.value)) {
                return <UnexpectedFieldValue />;
            }

            return (
                <LinkedRecordsField
                    airtableField={airtableField as AirtableLinkedRecordField}
                    value={props.value}
                    setValue={props.setValue}
                    extensionId={props.extensionId}
                    extensionSessionId={props.extensionSessionId}
                />
            );
        }
        case FieldType.MULTIPLE_ATTACHMENTS:
        case FieldType.BARCODE:
        case FieldType.MULTIPLE_LOOKUP_VALUES:
        case FieldType.BUTTON:
        case FieldType.CREATED_BY:
        case FieldType.LAST_MODIFIED_BY:
        case FieldType.SINGLE_SELECT:
        case FieldType.MULTIPLE_SELECTS:
        case FieldType.LAST_MODIFIED_TIME:
        case FieldType.RICH_TEXT:
        case FieldType.EXTERNAL_SYNC_SOURCE:
        case FieldType.DURATION:
        case FieldType.COUNT:
        case FieldType.ROLLUP:
        case FieldType.DATE_TIME:
        case FieldType.DATE:
        case FieldType.CREATED_TIME:
        case FieldType.AUTO_NUMBER:
        case FieldType.FORMULA:
        case FieldType.CHECKBOX:
        case FieldType.RATING:
        case FieldType.NUMBER:
        case FieldType.PERCENT:
        case FieldType.CURRENCY:
        case FieldType.SINGLE_COLLABORATOR:
        case FieldType.MULTIPLE_COLLABORATORS:
        case FieldType.EMAIL:
        case FieldType.PHONE_NUMBER:
        case FieldType.URL:
        case FieldType.MULTILINE_TEXT:
            throw new Error(`Field type  is not supported.`);
    }
};

export default FieldRenderer;
