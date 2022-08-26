import { v1APIHandler } from 'shared/api/handler-types';
import {
    FetchInitialLinkedRecordsInput,
    FetchInitialLinkedRecordsOutput,
} from 'shared/api/types/fetchAllLinkedRecordPrimaryValues';
import {
    FieldIdsToAirtableFields,
    LinkedRecordIdsToAirtableRecords,
    LinkedTableIdsToPrimaryFields,
} from 'shared/types/linkedRecordsIdsToPrimaryValues';
import { chunkArray } from 'shared/utils/chunkArray';

import { fetchFieldsForTable } from '../../base-schema/fetchFieldsForTable';
import { getPrimaryFieldInFields } from '../../base-schema/getPrimaryFieldInFields';
import { fetchExtensionAndVerifyPassword } from '../../database/extensions/fetchExtension';
import { fetchLinkedRecords } from '../../helpers/fetchLinkedRecords';
import { getFieldsNamesToFetchForLinkedRecords } from '../../helpers/getFieldsNamesToFetchForLinkedRecords';

export const fetchInitialLinkedRecords: v1APIHandler<
    FetchInitialLinkedRecordsInput,
    FetchInitialLinkedRecordsOutput
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
        totalRemainingTriesToResolveLookupLinkedRecordFields: 3,
    });

    let linkedRecordIdsToAirtableRecords: LinkedRecordIdsToAirtableRecords = {};
    const linkedTableIdsToPrimaryFields: LinkedTableIdsToPrimaryFields = {};
    const linkedTableFieldIdsToAirtableFields: FieldIdsToAirtableFields = {};

    for (const linkedTableId of Object.keys(args.linkedTableIdsToRecordIds)) {
        const { recordIds, linkedRecordFieldIdsInMainTable } =
            args.linkedTableIdsToRecordIds[linkedTableId];

        const { fields: airtableFieldsInLinkedTable } =
            await fetchFieldsForTable({
                userUID: extension.userUID,
                baseId: extension.baseId,
                tableId: linkedTableId,
                totalRemainingTriesToResolveLookupLinkedRecordFields: 3,
            });

        const currentLinkedTableFieldsIdsToAirtableFields: FieldIdsToAirtableFields =
            {};

        airtableFieldsInLinkedTable.forEach((field) => {
            linkedTableFieldIdsToAirtableFields[field.id] = field;
            currentLinkedTableFieldsIdsToAirtableFields[field.id] = field;
        });

        const primaryFieldInLinkedTable = getPrimaryFieldInFields({
            fields: airtableFieldsInLinkedTable,
        });

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

        linkedTableIdsToPrimaryFields[linkedTableId] =
            primaryFieldInLinkedTable;

        if (recordIds.length > 0) {
            const nestedRecordsIds =
                recordIds.length > 100
                    ? chunkArray(recordIds, 100)
                    : [recordIds];

            for (const recordIds of nestedRecordsIds) {
                const moreLinkedRecordsWithLinks = await fetchLinkedRecords({
                    tableId: linkedTableId,
                    baseId: extension.baseId,
                    userUID: extension.userUID,
                    fieldNamesToFetch,
                    recordIds,
                });

                linkedRecordIdsToAirtableRecords = {
                    ...linkedRecordIdsToAirtableRecords,
                    ...moreLinkedRecordsWithLinks,
                };
            }
        }
    }

    return {
        linkedRecordIdsToAirtableRecords,
        linkedTableIdsToPrimaryFields,
        linkedTableFieldIdsToAirtableFields,
    };
};

export const handler = fetchInitialLinkedRecords;
