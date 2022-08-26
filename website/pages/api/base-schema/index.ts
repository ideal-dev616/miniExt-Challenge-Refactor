import { FieldType } from '@airtable/blocks/models';
import { AirtableBase } from 'shared/airtable/types';

const base: AirtableBase = {
    name: 'name',
    id: 'appbVvNerqsCChIH1',
    tables: [
        {
            id: 'tblWKJgDuc7j8JTBD',
            name: 'Furniture',
            fields: [
                {
                    id: 'fld1FIhIm8alVGOwE',
                    name: 'Name',
                    description: '',
                    config: {
                        type: FieldType.SINGLE_LINE_TEXT,
                        options: null,
                    },
                    isComputed: false,
                    isPrimaryField: true,
                },
                {
                    id: 'fldBkouHIRcYyBqBH',
                    name: 'Vendor',
                    description: '',
                    config: {
                        type: FieldType.MULTIPLE_RECORD_LINKS,
                        options: {
                            linkedTableId: 'tbl09P57B0ubn2FrN',
                            isReversed: false,
                            prefersSingleRecordLink: false,
                            inverseLinkFieldId: 'fldKTXVmp77vU6WK3',
                            titleOverrideFieldId: null,
                            subtitleFieldId: null,
                        },
                    },
                    isComputed: false,
                    isPrimaryField: false,
                },
            ],
            views: [],
        },
        {
            id: 'tbl09P57B0ubn2FrN',
            name: 'Vendors',
            fields: [
                {
                    id: 'fldpdYeDFqiQp9pJq',
                    name: 'Name',
                    description: '',
                    config: {
                        type: FieldType.SINGLE_LINE_TEXT,
                        options: null,
                    },
                    isComputed: false,
                    isPrimaryField: true,
                },
                {
                    id: 'fldKTXVmp77vU6WK3',
                    name: 'Furniture',
                    description: '',
                    config: {
                        type: FieldType.MULTIPLE_RECORD_LINKS,
                        options: {
                            linkedTableId: 'tblWKJgDuc7j8JTBD',
                            isReversed: false,
                            prefersSingleRecordLink: false,
                            inverseLinkFieldId: 'fldBkouHIRcYyBqBH',
                            titleOverrideFieldId: null,
                            subtitleFieldId: null,
                        },
                    },
                    isComputed: false,
                    isPrimaryField: false,
                },
                {
                    id: 'fldrxdSm29TyzZ1hu',
                    name: 'Sales contact',
                    description: '',
                    config: {
                        type: FieldType.SINGLE_LINE_TEXT,
                        options: null,
                    },
                    isComputed: false,
                    isPrimaryField: false,
                },
                {
                    id: 'fldKabGHiY44Ydd95',
                    name: 'City',
                    description: '',
                    config: {
                        type: FieldType.SINGLE_LINE_TEXT,
                        options: null,
                    },
                    isComputed: false,
                    isPrimaryField: false,
                },
            ],
            views: [],
        },
    ],
};

/**
 * Expects that the user is allowed to preform this action.
 */
export const fetchBaseSchema = async (): Promise<AirtableBase> => {
    return base;
};
