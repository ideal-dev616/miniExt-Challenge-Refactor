import { AirtableField } from 'shared/airtable/types';

import { FieldType, ViewType } from '@airtable/blocks/models';

export type FieldsForTable = {
    fields: AirtableField[];
    primaryFieldId?: string;
};

export type ViewFromMetadataAPI = {
    id: string;
    name: string;
    type: ViewType;
};

export type FieldFromMetadataAPI = {
    id: string;
    name: string;
    type: FieldType;
};

export type TableFromMetadataAPI = {
    id: string;
    name: string;
    primaryFieldId: string;
    fields: FieldFromMetadataAPI[];
    views: ViewFromMetadataAPI[];
};
export type BaseFromMetadataAPI = {
    tables: TableFromMetadataAPI[];
};
