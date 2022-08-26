import {
    LoadExtensionInput,
    LoadExtensionOuput,
} from 'shared/api/types/loadExtension';
import { fetchFieldsForTable } from '../../base-schema/fetchFieldsForTable';
import { fetchExtension } from '../../database/extensions/fetchExtension';
import { assertRecordId } from '../../helpers/assertRecordId';
import { loadFormForLoadedScreen } from '../../public-extensions/Form/loadFormForLoadedScreen';

export const loadExtension = async (
    args: LoadExtensionInput
): Promise<LoadExtensionOuput> => {
    if (args.recordId) {
        assertRecordId(args.recordId);
    }

    const loggedInUserUID = args.loggedInUserUID ?? null;

    const extensionResult = await fetchExtension();

    const { extension, airtableFieldsUsedByExtensionPublically } =
        extensionResult;

    const { userUID, baseId, state } = extension;

    const { fields: airtableFields } = await fetchFieldsForTable({
        userUID,
        baseId,
        tableId: state.tableId,
        totalRemainingTriesToResolveLookupLinkedRecordFields: 3,
    });

    return await loadFormForLoadedScreen({
        recordInfo: args.recordId
            ? {
                  type: 'recordId',
                  recordId: args.recordId,
              }
            : null,
        loggedInUserUID,
        loggedInUserEmail: args.loggedInUserEmail,
        searchQuery: args.searchQuery,
        airtableFields,
        extension,
        airtableFieldsUsedByExtensionPublically,
        clientIp: args.clientIp,
        userAgent: args.userAgent,
    });
};
