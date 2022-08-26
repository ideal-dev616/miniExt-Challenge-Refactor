import { default as BlockAirtableField } from '@airtable/blocks/dist/types/src/models/field';
import { FieldData } from '@airtable/blocks/dist/types/src/types/field';
import { Collaborator, FieldSet } from 'airtable';
import { ViewType, FieldType } from '@airtable/blocks/models';
import { Color } from '@airtable/blocks/dist/types/src/colors';

export const ALL_FIELD_TYPES = Object.values<FieldType>(FieldType);

export interface AirtableView {
    id: string;
    name: string;
    type: ViewType;
    url: string;
}

export interface AirtableTable {
    name: string;
    id: string;
    fields: AirtableField[];
    views: AirtableView[];
}

export interface AirtableBase {
    name: string;
    id: string;
    tables: AirtableTable[];
}

export type AirtableBasesMap = {
    [baseId: string]: AirtableBase;
};

export declare type FieldId = string;
export declare type TableId = string;
export declare type ViewId = string;

/**
 * AirtableFieldsOptions
 */

interface NumericFieldOptions {
    precision: number;
}

interface CurrencyFieldOptions extends NumericFieldOptions {
    symbol: string;
}

export interface SelectFieldOptions {
    choices: Array<{
        id: string;
        name: string;
        color?: Color;
    }>;
}

export type AirtableCollaborator = Collaborator & { profilePicUrl?: string };
interface CollaboratorFieldOptions {
    choices: Array<AirtableCollaborator>;
}

interface LinkedRecordFieldOptions {
    linkedTableId: TableId;
    inverseLinkFieldId?: FieldId;
    viewIdForRecordSelection?: ViewId;
    isReversed: boolean;
    prefersSingleRecordLink: boolean;
    titleOverrideFieldId: string | null;
    subtitleFieldId: string | null;
}

export interface DateFieldOptions {
    dateFormat:
        | {
              name: 'local';
              format: 'l';
          }
        | {
              name: 'friendly';
              format: 'LL';
          }
        | {
              name: 'us';
              format: 'M/D/YYYY';
          }
        | {
              name: 'european';
              format: 'D/M/YYYY';
          }
        | {
              name: 'iso';
              format: 'YYYY-MM-DD';
          };
}

export interface DateTimeFieldOptions extends DateFieldOptions {
    timeFormat:
        | {
              name: '12hour';
              format: 'h:mma';
          }
        | {
              name: '24hour';
              format: 'HH:mm';
          };
    timeZone: 'utc' | 'client';
}

interface AttachmentsFieldOptions {
    isReversed: boolean;
}

interface CheckboxFieldOptions {
    icon: 'check' | 'star' | 'heart' | 'thumbsUp' | 'flag';
    color:
        | 'yellowBright'
        | 'orangeBright'
        | 'redBright'
        | 'pinkBright'
        | 'purpleBright'
        | 'blueBright'
        | 'cyanBright'
        | 'tealBright'
        | 'greenBright'
        | 'grayBright';
}

interface FormulaFieldOptions {
    isValid: boolean;
    referencedFieldIds: Array<FieldId>;
    result: FieldConfig;
}

interface RollupFieldOptions extends FormulaFieldOptions {
    recordLinkFieldId: FieldId;
    fieldIdInLinkedTable: FieldId;
}

interface CreatedTimeFieldOptions {
    result: DateFieldConfig | DateTimeFieldConfig;
}

interface CountFieldOptions {
    isValid: boolean;
    recordLinkFieldId: FieldId;
}

declare type LookupFieldOptions =
    | {
          isValid: true;
          recordLinkFieldId: FieldId;
          fieldIdInLinkedTable: FieldId | null;
          result: FieldConfig;
      }
    | {
          isValid: false;
          recordLinkFieldId: FieldId;
          fieldIdInLinkedTable: FieldId | null;
          result: undefined;
      };

interface RatingFieldOptions {
    icon: 'star' | 'heart' | 'thumbsUp' | 'flag';
    max: number;
    color:
        | 'yellowBright'
        | 'orangeBright'
        | 'redBright'
        | 'pinkBright'
        | 'purpleBright'
        | 'blueBright'
        | 'cyanBright'
        | 'tealBright'
        | 'greenBright'
        | 'grayBright';
}

interface DurationFieldOptions {
    durationFormat:
        | 'h:mm'
        | 'h:mm:ss'
        | 'h:mm:ss.S'
        | 'h:mm:ss.SS'
        | 'h:mm:ss.SSS';
}

interface LastModifiedTimeFieldOptions {
    isValid: boolean;
    referencedFieldIds: Array<FieldId>;
    result: DateFieldConfig | DateTimeFieldConfig;
}

interface CreatedByFieldOptions extends CollaboratorFieldOptions {}

interface LastModifiedByFieldOptions extends CreatedByFieldOptions {
    referencedFieldIds: Array<FieldId>;
}

interface ExternalSyncSourceFieldOptions extends SelectFieldOptions {}

/**
 * AirtableFields
 */

interface AirtableFieldBase<Config> {
    id: FieldData['id'];
    name: FieldData['name'];
    description: FieldData['description'];
    isComputed: BlockAirtableField['isComputed'];
    isPrimaryField: BlockAirtableField['isPrimaryField'];
    config: Config;
}

interface NumericFieldConfig {
    type: FieldType.NUMBER | FieldType.PERCENT;
    options: NumericFieldOptions;
}
export type AirtableNumericField = AirtableFieldBase<NumericFieldConfig>;

interface CurrencyFieldConfig {
    type: FieldType.CURRENCY;
    options: CurrencyFieldOptions;
}
export type AirtableCurrencyField = AirtableFieldBase<CurrencyFieldConfig>;

interface SelectFieldConfig {
    type: FieldType.SINGLE_SELECT | FieldType.MULTIPLE_SELECTS;
    options: SelectFieldOptions;
}
export type AirtableSelectField = AirtableFieldBase<SelectFieldConfig>;

interface CollaboratorFieldConfig {
    type:
        | FieldType.SINGLE_COLLABORATOR
        | FieldType.MULTIPLE_COLLABORATORS
        | FieldType.CREATED_BY;
    options: CollaboratorFieldOptions;
}
export type AirtableCollaboratorField =
    AirtableFieldBase<CollaboratorFieldConfig>;

interface LinkedRecordFieldConfig {
    type: FieldType.MULTIPLE_RECORD_LINKS;
    options: LinkedRecordFieldOptions;
}
export type AirtableLinkedRecordField =
    AirtableFieldBase<LinkedRecordFieldConfig>;

interface DateFieldConfig {
    type: FieldType.DATE;
    options: DateFieldOptions;
}
export type AirtableDateField = AirtableFieldBase<DateFieldConfig>;

interface DateTimeFieldConfig {
    type: FieldType.DATE_TIME;
    options: DateTimeFieldOptions;
}
export type AirtableDateTimeField = AirtableFieldBase<DateTimeFieldConfig>;

interface AttachmentsFieldConfig {
    type: FieldType.MULTIPLE_ATTACHMENTS;
    options: AttachmentsFieldOptions;
}
export type AirtableAttachmentsField =
    AirtableFieldBase<AttachmentsFieldConfig>;

interface CheckboxFieldConfig {
    type: FieldType.CHECKBOX;
    options: CheckboxFieldOptions;
}
export type AirtableCheckboxField = AirtableFieldBase<CheckboxFieldConfig>;

interface FormulaFieldConfig {
    type: FieldType.FORMULA;
    options: FormulaFieldOptions;
}
export type AirtableFormulaField = AirtableFieldBase<FormulaFieldConfig>;

interface CreatedTimeFieldConfig {
    type: FieldType.CREATED_TIME;
    options: CreatedTimeFieldOptions;
}
export type AirtableCreatedTimeField =
    AirtableFieldBase<CreatedTimeFieldConfig>;

interface RollupFieldConfig {
    type: FieldType.ROLLUP;
    options: RollupFieldOptions;
}
export type AirtableRollupField = AirtableFieldBase<RollupFieldConfig>;

interface CountFieldConfig {
    type: FieldType.COUNT;
    options: CountFieldOptions;
}
export type AirtableCountField = AirtableFieldBase<CountFieldConfig>;

interface LookupFieldConfig {
    type: FieldType.MULTIPLE_LOOKUP_VALUES;
    options: LookupFieldOptions;
}
export type AirtableLookupField = AirtableFieldBase<LookupFieldConfig>;

interface RatingFieldConfig {
    type: FieldType.RATING;
    options: RatingFieldOptions;
}
export type AirtableRatingField = AirtableFieldBase<RatingFieldConfig>;

interface DurationFieldConfig {
    type: FieldType.DURATION;
    options: DurationFieldOptions;
}
export type AirtableDurationField = AirtableFieldBase<DurationFieldConfig>;

interface LastModifiedTimeFieldConfig {
    type: FieldType.LAST_MODIFIED_TIME;
    options: LastModifiedTimeFieldOptions;
}
export type AirtableLastModifiedTimeField =
    AirtableFieldBase<LastModifiedTimeFieldConfig>;

interface CreatedByFieldConfig {
    type: FieldType.CREATED_BY;
    options: CreatedByFieldOptions;
}
export type AirtableCreatedByField = AirtableFieldBase<CreatedByFieldConfig>;

interface LastModifiedByFieldConfig {
    type: FieldType.LAST_MODIFIED_BY;
    options: LastModifiedByFieldOptions;
}
export type AirtableLastModifiedByField =
    AirtableFieldBase<LastModifiedByFieldConfig>;

interface ExternalSyncSourceFieldConfig {
    type: FieldType.EXTERNAL_SYNC_SOURCE;
    options: ExternalSyncSourceFieldOptions;
}
export type AirtableExternalSyncSourceField =
    AirtableFieldBase<ExternalSyncSourceFieldConfig>;

interface OptionlessFieldConfig<T> {
    type: T;
    options: null;
}

export type AirtableURLField = AirtableFieldBase<
    OptionlessFieldConfig<FieldType.URL>
>;

export type AirtableSingleLineTextField = AirtableFieldBase<
    OptionlessFieldConfig<FieldType.SINGLE_LINE_TEXT>
>;

export type AirtableRichTextField = AirtableFieldBase<
    OptionlessFieldConfig<FieldType.RICH_TEXT>
>;

export type AirtableMultilineTextField = AirtableFieldBase<
    OptionlessFieldConfig<FieldType.MULTILINE_TEXT>
>;

export type AirtableEmailField = AirtableFieldBase<
    OptionlessFieldConfig<FieldType.EMAIL>
>;

export type AirtablePhoneNumberField = AirtableFieldBase<
    OptionlessFieldConfig<FieldType.PHONE_NUMBER>
>;

export type AirtableBarcodeField = AirtableFieldBase<
    OptionlessFieldConfig<FieldType.BARCODE>
>;

export type AirtableButtonField = AirtableFieldBase<
    OptionlessFieldConfig<FieldType.BUTTON>
>;

export type AirtableAutoNumberField = AirtableFieldBase<
    OptionlessFieldConfig<FieldType.AUTO_NUMBER>
>;

export type AirtableField =
    | AirtableNumericField
    | AirtableCurrencyField
    | AirtableCollaboratorField
    | AirtableURLField
    | AirtableCheckboxField
    | AirtableRatingField
    | AirtableEmailField
    | AirtableCheckboxField
    | AirtableDateField
    | AirtableRichTextField
    | AirtableSingleLineTextField
    | AirtableSelectField
    | AirtableLastModifiedTimeField
    | AirtableExternalSyncSourceField
    | AirtableLastModifiedByField
    | AirtableCreatedByField
    | AirtableDurationField
    | AirtableLookupField
    | AirtableCountField
    | AirtableRollupField
    | AirtableCreatedTimeField
    | AirtableFormulaField
    | AirtableLinkedRecordField
    | AirtableDateField
    | AirtableDateTimeField
    | AirtableAttachmentsField
    | AirtableMultilineTextField
    | AirtablePhoneNumberField
    | AirtableBarcodeField
    | AirtableButtonField
    | AirtableAutoNumberField;

export declare type FieldConfig = AirtableField['config'];

export type FieldNamesToFields = {
    [fieldName: string]: AirtableField;
};

export type AirtableBarcodeValue = { text?: string; type?: string };
export type AirtableButtonValue = { url: string; label: string };

/**
 * Airtable computed values can sometimes have an error instead of a value
 * e.g. a lookup field that was deleted in linked table. An invalid formula.
 */
export type AirtableComputedErrorValue = { error: string };

export type AirtableValue =
    | FieldSet[keyof FieldSet]
    | AirtableBarcodeValue
    | AirtableButtonValue
    | AirtableComputedErrorValue;

export type AirtableFieldSet = {
    [fieldName: string]: AirtableValue;
};

export type AirtableRecord = {
    id: string;
    fields: AirtableFieldSet;
};
