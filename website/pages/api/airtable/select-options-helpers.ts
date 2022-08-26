import { SelectOptions } from 'airtable';
import { AirtableFieldSet } from 'shared/airtable/types';

export type AirtableSelectOptions = SelectOptions<AirtableFieldSet>;

export const getViewSelectDict = (viewId: string | null) => {
    return viewId ? { view: viewId } : {};
};

/**
 * Get a record using filter by formula + a view.
 * We do this rather than getting the record directly using the ID because
 * in some cases we want to know whether or not a record is within a view.
 */
export const getAirtableSelectOptionsForRecordId = (args: {
    recordId: string;
    viewId: string | null;
    fieldsToInclude?: string[];
}): AirtableSelectOptions => {
    const selectPayload: AirtableSelectOptions = {
        maxRecords: 1,
        filterByFormula: `RECORD_ID()='${args.recordId}'`,
        ...getViewSelectDict(args.viewId),
    };

    if (args.fieldsToInclude) {
        selectPayload.fields = args.fieldsToInclude;
    }

    return selectPayload;
};

/**
 * Get the {@link AirtableSelectOptions} for selecting a array records based on a field on the table and
 * a list of values.
 */
export const getAirtableSelectOptionsForPrimaryValues = ({
    primaryField,
    primaryValues,
}: {
    primaryField: string;
    primaryValues: string[];
}) => {
    const primaryFieldFormula = `LOWER({${primaryField}})`;
    const valuesFormula = primaryValues
        .map((value) => value.toLowerCase())
        .join('|');
    const formula = `REGEX_MATCH(${primaryFieldFormula}, '${valuesFormula}')`;
    const selectPayload: AirtableSelectOptions = {
        fields: [primaryField],
        filterByFormula: formula,
    };

    return selectPayload;
};
