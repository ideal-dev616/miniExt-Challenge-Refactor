import { FieldType } from '@airtable/blocks/models';
import {
    AirtableButtonValue,
    AirtableField,
    AirtableValue,
} from 'shared/airtable/types';

const isValueEmptyForField = (args: {
    airtableFieldConfig: AirtableField['config'];
    value: AirtableValue;
}): boolean => {
    if (args.value == null || args.value === '') return true;

    if (
        args.airtableFieldConfig.type === FieldType.BUTTON &&
        !(args.value as AirtableButtonValue).url
    )
        return true;

    if (Array.isArray(args.value)) {
        if (args.value.length === 0) return true;

        if (args.value.every((x) => x == null)) return true;
    }

    return false;
};

export default isValueEmptyForField;
