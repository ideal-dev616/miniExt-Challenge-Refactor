import { AllFieldIdsToFieldNamesInBase } from 'shared/types/linkedRecordsIdsToPrimaryValues';
import { fetchBaseSchema } from '../../base-schema/index';

export const fetchAllFieldIdsToFieldNamesInBase =
    async (): Promise<AllFieldIdsToFieldNamesInBase> => {
        const base = await fetchBaseSchema();

        const allFieldIdsToFieldNamesInBase: AllFieldIdsToFieldNamesInBase = {};

        for (const table of base.tables) {
            for (const field of table.fields) {
                allFieldIdsToFieldNamesInBase[field.id] = field.name;
            }
        }

        return allFieldIdsToFieldNamesInBase;
    };
