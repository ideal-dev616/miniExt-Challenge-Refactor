import Airtable from 'airtable';
import { AirtableFieldSet, AirtableRecord } from 'shared/airtable/types';
import { generatetAirtableFunctionWithErrorHandling } from './generateAirtableFunctionWithErrorHandling';
import { AirtableSelectOptions } from './select-options-helpers';

const MAXSECURITY_getDecryptedApiKey = async (): Promise<string> => {
    return 'STOPSHIP add an Airtable api key here';
};

export const fetchAirtableRecordsFirstPage =
    generatetAirtableFunctionWithErrorHandling(
        async (args: {
            baseId: string;
            userUID: string;
            tableId: string;
            selectOptions: AirtableSelectOptions;
        }): Promise<AirtableRecord[]> => {
            const airtable = await getAirtable();

            return airtable
                .base(args.baseId)
                .table(args.tableId)
                .select(args.selectOptions)
                .firstPage() as unknown as AirtableRecord[];
        }
    );
export const fetchAirtableRecord = generatetAirtableFunctionWithErrorHandling(
    async (args: {
        baseId: string;
        userUID: string;
        tableId: string;
        recordId: string;
    }): Promise<AirtableRecord> => {
        const airtable = await getAirtable();

        return airtable
            .base(args.baseId)
            .table(args.tableId)
            .find(args.recordId);
    }
);

/**
 *  Only use this if you need pagination, Airtable SDK should be used otherwise
 */
export const fetchAirtableRecordsRESTApi =
    generatetAirtableFunctionWithErrorHandling(
        async (args: {
            baseId: string;
            userUID: string;
            tableId: string;
            selectOptions: AirtableSelectOptions;
            offset: string | null;
        }): Promise<{ records: AirtableRecord[]; offset: string | null }> => {
            const apiKey = await MAXSECURITY_getDecryptedApiKey();

            const url = formatUrl(
                `https://api.airtable.com/v0/${args.baseId}/${args.tableId}`,
                args.offset ? { offset: args.offset } : args.selectOptions
            );

            const options = {
                headers: { Authorization: `Bearer ${apiKey}` },
            };

            const data = await fetch(url, options).then((res) => res.json());

            if (data.error) {
                throw new Error(
                    data.error.message ?? 'Could not fetch records.'
                );
            }

            return { records: data.records, offset: data.offset || null };
        }
    );

/**
 * Creates an Airtable record with the provided recordData. Uses the base's Airtable API key.
 */
export const createAirtableRecord = generatetAirtableFunctionWithErrorHandling(
    async (args: {
        baseId: string;
        userUID: string;
        tableId: string;
        recordData: AirtableFieldSet;
        typecast?: boolean;
    }): Promise<AirtableRecord> => {
        const airtable = await getAirtable();

        const records = await airtable
            .base(args.baseId)
            .table(args.tableId)
            .create(
                [
                    {
                        // Cast to any because we use our own field set type.
                        fields: args.recordData as any,
                    },
                ],
                { typecast: args.typecast }
            );

        if (records.length !== 1) {
            throw new Error(
                'Should have only created one Airtable record but the result was different.'
            );
        }

        return records[0];
    }
);

/**
 * Updates an Airtable record with the provided recordData. Uses the base's Airtable API key.
 */
export const updateAirtableRecord = generatetAirtableFunctionWithErrorHandling(
    async (args: {
        baseId: string;
        userUID: string;
        tableId: string;
        recordId: string;
        recordData: AirtableFieldSet;
    }): Promise<AirtableRecord> => {
        const airtable = await getAirtable();

        // Cast to any because we use our own field set type.
        const fields = args.recordData as any;

        const records = await airtable
            .base(args.baseId)
            .table(args.tableId)
            .update([{ id: args.recordId, fields }]);

        if (records.length !== 1) {
            throw new Error(
                'Should have only updated one Airtable record but the result was different.'
            );
        }

        return records[0];
    }
);

/**
 * Deletes Airtable Record(s)
 */
export const deleteAirtableRecords = generatetAirtableFunctionWithErrorHandling(
    async (args: {
        baseId: string;
        userUID: string;
        tableId: string;
        recordIds: string[];
    }) => {
        if (args.recordIds.length > 10) {
            throw new Error(
                'You can only delete a maximum of 10 records at a time.'
            );
        }

        const airtable = await getAirtable();

        await airtable
            .base(args.baseId)
            .table(args.tableId)
            .destroy(args.recordIds);
    }
);

const formatUrl = (url: string, airtableSelectOptions: any) => {
    const query = Object.entries(airtableSelectOptions)
        .map(([airtableSelectOption, airtableSelectOptionValue]) => {
            if (Array.isArray(airtableSelectOptionValue)) {
                if (airtableSelectOption === 'fields') {
                    return airtableSelectOptionValue
                        .map(
                            (fieldName, index) =>
                                `${airtableSelectOption}[${index}]=${encodeURIComponent(
                                    fieldName as string
                                )}`
                        )
                        .join('&');
                } else if (airtableSelectOption === 'sort') {
                    return airtableSelectOptionValue
                        .map((sortObject, index) =>
                            Object.entries(sortObject)
                                .map(
                                    ([sortObjectKey, sortObjectValue]) =>
                                        `${airtableSelectOption}[${index}][${sortObjectKey}]=${encodeURIComponent(
                                            sortObjectValue as string
                                        )}`
                                )
                                .join('&')
                        )
                        .join('&');
                }
            } else if (typeof airtableSelectOptionValue === 'string') {
                return (
                    airtableSelectOption +
                    '=' +
                    encodeURIComponent(airtableSelectOptionValue)
                );
            }
            return null;
        })
        .filter(Boolean)
        .join('&');

    return url + (query ? '?' + query : '');
};


const getAirtable = async () => {
    const apiKey = await MAXSECURITY_getDecryptedApiKey();

    return new Airtable({
        apiKey,
    });
};
