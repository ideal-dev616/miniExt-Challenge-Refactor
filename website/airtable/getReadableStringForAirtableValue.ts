import { FieldType } from '@airtable/blocks/models';
import {
    AirtableField,
    AirtableFieldSet,
    AirtableRecord,
    AirtableValue,
    FieldNamesToFields,
} from 'shared/airtable/types';
import { assertUnreachable } from 'shared/utils/assertUnreachable';
import { LinkedRecordsIdsToPrimaryValues } from 'shared/types/linkedRecordsIdsToPrimaryValues';
import { assertRunningOnFrontend } from '../pages/api/helpers/assertRunningOnFrontend';
import { makeNeedToSyncBaseErrorMessage } from '../utils/makeNeedToSyncBaseErrorMessage';

type UserDefinedFieldName = string;
export type AirtableFieldNameToUserDefinedFieldNameOverrides = {
    [airtableFieldName: string]: UserDefinedFieldName;
};

export const convertRecordsToReadableRecords = (args: {
    records: AirtableRecord[];
    fieldSchemas: AirtableField[];
    linkedRecordIdsToPrimaryValues: LinkedRecordsIdsToPrimaryValues | null;
    airtableFieldNameToUserDefinedFieldNameOverrides?: AirtableFieldNameToUserDefinedFieldNameOverrides;
}): AirtableRecord[] => {
    return args.records.map((r) =>
        getReadableRecord({
            record: r,
            fieldSchemas: args.fieldSchemas,
            linkedRecordIdsToPrimaryValues: args.linkedRecordIdsToPrimaryValues,
            airtableFieldNameToUserDefinedFieldNameOverrides:
                args.airtableFieldNameToUserDefinedFieldNameOverrides,
        })
    );
};

const unexpectedValueError = new Error(
    makeNeedToSyncBaseErrorMessage('Unexpectedly failed.')
);

export const getReadableRecord = (args: {
    record: AirtableRecord;
    linkedRecordIdsToPrimaryValues: LinkedRecordsIdsToPrimaryValues | null;
    fieldSchemas: AirtableField[];
    airtableFieldNameToUserDefinedFieldNameOverrides?: AirtableFieldNameToUserDefinedFieldNameOverrides;
}): AirtableRecord => {
    const fields: AirtableFieldSet = {};

    const fieldNames = Object.keys(args.record.fields);

    const fieldsNamesToField: FieldNamesToFields =
        args.fieldSchemas?.reduce((acc: any, cur) => {
            acc[cur.name] = cur;
            return acc;
        }, {}) ?? {};

    for (const fieldName of fieldNames) {
        const fieldNameOverride =
            args.airtableFieldNameToUserDefinedFieldNameOverrides
                ? args.airtableFieldNameToUserDefinedFieldNameOverrides[
                      fieldName
                  ]
                : null;

        const effectiveFieldName = fieldNameOverride
            ? fieldNameOverride
            : fieldName;

        const field = fieldsNamesToField[fieldName];

        if (!field) {
            throw unexpectedValueError;
        }

        fields[effectiveFieldName] = getReadableStringForAirtableValue({
            value: args.record.fields[fieldName],
            linkedRecordIdsToPrimaryValues: args.linkedRecordIdsToPrimaryValues,
            airtableFieldConfig: field.config,
        });
    }

    return {
        id: args.record.id,
        fields,
    };
};

export const getReadableStringForAirtableValue = (args: {
    value: AirtableValue;
    linkedRecordIdsToPrimaryValues: LinkedRecordsIdsToPrimaryValues | null;
    airtableFieldConfig: AirtableField['config'];
    doNotReturnRecordIdsForLinkedRecords?: boolean;
    seperator?: string;
    runOnBackendWithWrongTimezone?: boolean;
}): string => {
    const seperator = args.seperator || ',';

    if (!args.runOnBackendWithWrongTimezone) {
        assertRunningOnFrontend(`getReadableStringForAirtableValue`);
    }

    if (args.value == null) {
        return '';
    }

    if (typeof args.value === 'object' && 'error' in args.value) {
        return args.value.error;
    }

    switch (args.airtableFieldConfig.type) {
        case FieldType.SINGLE_LINE_TEXT: {
            if (typeof args.value !== 'string') {
                throw unexpectedValueError;
            }

            return args.value;
        }

        case FieldType.MULTIPLE_RECORD_LINKS: {
            if (!Array.isArray(args.value)) {
                throw unexpectedValueError;
            }

            return args.value
                .map((idOrPrimaryValue) => {
                    if (
                        idOrPrimaryValue &&
                        idOrPrimaryValue.length === 17 &&
                        idOrPrimaryValue.startsWith('rec')
                    ) {
                        // It's an ID
                        if (
                            args.linkedRecordIdsToPrimaryValues &&
                            args.linkedRecordIdsToPrimaryValues[
                                idOrPrimaryValue
                            ]
                        ) {
                            const primaryValue =
                                args.linkedRecordIdsToPrimaryValues[
                                    idOrPrimaryValue
                                ];

                            return primaryValue
                                ? primaryValue
                                : idOrPrimaryValue;
                        } else {
                            if (args.doNotReturnRecordIdsForLinkedRecords) {
                                return null;
                            } else {
                                return idOrPrimaryValue;
                            }
                        }
                    } else {
                        // It's already a primary value
                        return idOrPrimaryValue;
                    }
                })
                .filter(Boolean)
                .join(seperator);
        }

        case FieldType.CREATED_BY:
        case FieldType.LAST_MODIFIED_BY:
        case FieldType.SINGLE_COLLABORATOR:
        case FieldType.BARCODE:
        case FieldType.BUTTON:
        case FieldType.EXTERNAL_SYNC_SOURCE:
        case FieldType.RATING:
        case FieldType.RICH_TEXT:
        case FieldType.SINGLE_SELECT:
        case FieldType.MULTILINE_TEXT:
        case FieldType.PHONE_NUMBER:
        case FieldType.URL:
        case FieldType.EMAIL:
        case FieldType.MULTIPLE_SELECTS:
        case FieldType.MULTIPLE_ATTACHMENTS:
        case FieldType.MULTIPLE_COLLABORATORS:
        case FieldType.LAST_MODIFIED_TIME:
        case FieldType.DATE:
        case FieldType.DATE_TIME:
        case FieldType.CHECKBOX:
        case FieldType.COUNT:
        case FieldType.AUTO_NUMBER:
        case FieldType.NUMBER:
        case FieldType.PERCENT:
        case FieldType.DURATION:
        case FieldType.CURRENCY:
        case FieldType.ROLLUP:
        case FieldType.FORMULA:
        case FieldType.MULTIPLE_LOOKUP_VALUES:
        case FieldType.CREATED_TIME: {
            throw new Error('This field type is not supported');
        }

        default:
            assertUnreachable(args.airtableFieldConfig);
    }
};
