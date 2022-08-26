import {
    AirtableField,
    AirtableLinkedRecordField,
} from 'shared/airtable/types';
import { v1APIHandler } from 'shared/api/handler-types';
import {
    FetchRecordsForLinkedRecordsSelectorInput,
    FetchRecordsForLinkedRecordsSelectorOutput,
} from 'shared/api/types/fetchRecordsForLinkedRecordsSelector';
import {
    FieldIdsToAirtableFields,
    LinkedRecordIdsToAirtableRecords,
    LinkedTableIdsToPrimaryFields,
} from 'shared/types/linkedRecordsIdsToPrimaryValues';

import { FieldType } from '@airtable/blocks/models';

import { getLinkedTableIdsToRecordIds } from '../../../../airtable/linked-records/primary-values';
import { fetchAirtableRecordsRESTApi } from '../../airtable';
import { fetchFieldsForTable } from '../../base-schema/fetchFieldsForTable';
import { getPrimaryFieldInFields } from '../../base-schema/getPrimaryFieldInFields';
import { fetchExtensionAndVerifyPassword } from '../../database/extensions/fetchExtension';
import { fetchLinkedRecords } from '../../helpers/fetchLinkedRecords';
import { getFieldsNamesToFetchForLinkedRecords } from '../../helpers/getFieldsNamesToFetchForLinkedRecords';
import { getNameFromMiniExtFieldWithConfig } from 'shared/extensions/miniExt-field-configs/id-helpers';

const getLinkedRecordConfigInFields = (args: {
    fieldName: string;
    fields: AirtableField[];
}): {
    linkedRecordFieldConfig: AirtableLinkedRecordField['config'];
    linkedRecordFieldIdInMainTable: string;
} | null => {
    for (const field of args.fields) {
        if (
            field.name === args.fieldName &&
            field.config.type === FieldType.MULTIPLE_RECORD_LINKS
        ) {
            return {
                linkedRecordFieldConfig: field.config,
                linkedRecordFieldIdInMainTable: field.id,
            };
        }
    }

    return null;
};

export const fetchRecordsForLinkedRecordsSelector: v1APIHandler<
    FetchRecordsForLinkedRecordsSelectorInput,
    FetchRecordsForLinkedRecordsSelectorOutput
> = async (args) => {
    const {
        extension,
        allFieldIdsToFieldNamesInBase,
        fieldIdsToNestedFieldIdsInMiniExtFieldConfigs,
    } = await fetchExtensionAndVerifyPassword();

    const { fields: airtableFieldsInMainTable } = await fetchFieldsForTable({
        userUID: extension.userUID,
        baseId: extension.baseId,
        tableId: extension.state.tableId,
    });

    const linkedRecordFieldInMainTableResult = getLinkedRecordConfigInFields({
        fieldName: args.linkedRecordFieldName,
        fields: airtableFieldsInMainTable,
    });

    if (!linkedRecordFieldInMainTableResult) {
        throw new Error(
            'Could not fetch records because the linked records field was not found in the table.'
        );
    }

    const { linkedRecordFieldConfig, linkedRecordFieldIdInMainTable } =
        linkedRecordFieldInMainTableResult;

    const linkedTableId = linkedRecordFieldConfig.options.linkedTableId;

    const { fields: airtableFieldsInLinkedTable } = await fetchFieldsForTable({
        userUID: extension.userUID,
        baseId: extension.baseId,
        tableId: linkedTableId,
    });

    const primaryFieldInLinkedTable = getPrimaryFieldInFields({
        fields: airtableFieldsInLinkedTable,
    });

    // Filter and sort based on the user's view from the linked records field config.
    const viewPart = linkedRecordFieldConfig.options.viewIdForRecordSelection
        ? {
              view: linkedRecordFieldConfig.options.viewIdForRecordSelection,
          }
        : {};

    const linkedTableFieldIdsToAirtableFields: FieldIdsToAirtableFields =
        airtableFieldsInLinkedTable.reduce((acc, curr) => {
            acc[curr.id] = curr;
            return acc;
        }, {} as FieldIdsToAirtableFields);

    const linkedRecordsAirtableField = airtableFieldsInMainTable.find(
        (field) => field.name === args.linkedRecordFieldName
    );

    if (!linkedRecordsAirtableField)
        throw new Error('Linked records field not found.');

    const linkedRecordFieldIdsInMainTable = [linkedRecordFieldIdInMainTable];

    const fieldIdsNestedInMiniExtLinkedRecordFieldConfig =
        linkedRecordFieldIdsInMainTable
            .map(
                (linkedRecordFieldIdInMainTable) =>
                    fieldIdsToNestedFieldIdsInMiniExtFieldConfigs[
                        linkedRecordFieldIdInMainTable
                    ]
            )
            .flat()
            .filter(Boolean);

    const fieldNamesToFetch = await getFieldsNamesToFetchForLinkedRecords({
        extension,
        allFieldIdsToFieldNamesInBase,
        primaryFieldInLinkedTable,
        linkedRecordFieldIdsInMainTable,
        airtableFieldsInMainTable,
        airtableFieldsInLinkedTable,
        fieldIdsNestedInMiniExtLinkedRecordFieldConfig,
    });

    const miniExtFieldWithConfig = extension.state.formFields.find(
        (field) =>
            getNameFromMiniExtFieldWithConfig(field) ===
            args.linkedRecordFieldName
    );

    if (!miniExtFieldWithConfig) {
        throw new Error(
            'Could not fetch records because the linked records field was not found in the table.'
        );
    }

    const { records: linkedTableRecords, offset } =
        await fetchAirtableRecordsRESTApi({
            userUID: extension.userUID,
            baseId: extension.baseId,
            tableId: linkedTableId,
            selectOptions: {
                ...viewPart,
                fields: fieldNamesToFetch,
                filterByFormula: `AND(${
                    args.searchTerm !== ''
                        ? `SEARCH(LOWER("${args.searchTerm}"), LOWER(${primaryFieldInLinkedTable.name}))`
                        : '1'
                })`,
                sort: [{ field: primaryFieldInLinkedTable.name }],
            },
            offset: args.offset,
        });

    const nestedLinkedTableIdsToRecordIds = getLinkedTableIdsToRecordIds({
        recordsFields: linkedTableRecords.map((record) => record.fields),
        airtableFieldsUsedByExtensionPublically: new Set(fieldNamesToFetch),
        fields: airtableFieldsInLinkedTable,
    });

    let additionalRecordIdsToAirtableRecords: LinkedRecordIdsToAirtableRecords =
        {};
    const additionalTableIdsToPrimaryFields: LinkedTableIdsToPrimaryFields = {};

    for (const tableId of Object.keys(nestedLinkedTableIdsToRecordIds)) {
        const recordIds = nestedLinkedTableIdsToRecordIds[tableId].recordIds;
        if (recordIds.length === 0) continue;
        const fields = await fetchFieldsForTable({
            userUID: extension.userUID,
            baseId: extension.baseId,
            tableId,
            totalRemainingTriesToResolveLookupLinkedRecordFields: 3,
        });
        const primaryField = getPrimaryFieldInFields(fields);
        additionalTableIdsToPrimaryFields[tableId] = primaryField;

        const moreLinkedRecords = await fetchLinkedRecords({
            baseId: extension.baseId,
            userUID: extension.userUID,
            tableId,
            fieldNamesToFetch: [primaryField.name],
            recordIds,
        });

        additionalRecordIdsToAirtableRecords = {
            ...additionalRecordIdsToAirtableRecords,
            ...moreLinkedRecords,
        };
    }

    const linkedRecords = linkedTableRecords;

    for (const record of linkedRecords) {
        for (const fieldName of Object.keys(record.fields)) {
            if (!fieldNamesToFetch.includes(fieldName)) {
                // When we fetch the records, we already only ask Airtable for the primary field and lookup field's
                // values. But, just in case, we loop over the fields again and remove anything if it exists.
                // Data security is of extreme importance, we should be paranoid
                delete record.fields[fieldName];
            }
        }
    }

    return {
        records: linkedRecords,
        offset,
        primaryFieldInLinkedTable,
        linkedTableFieldIdsToAirtableFields,
        additionalTableIdsToPrimaryFields,
        additionalRecordIdsToAirtableRecords,
    };
};

export const handler = fetchRecordsForLinkedRecordsSelector;
