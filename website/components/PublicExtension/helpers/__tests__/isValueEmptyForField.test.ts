import {
    AirtableButtonField,
    AirtableSelectField,
    AirtableSingleLineTextField,
    AirtableValue,
} from 'shared/airtable/types';
import isValueEmptyForField from '../isValueEmptyForField';
import faker from 'faker';
import { FieldType } from '@airtable/blocks/models';

describe('isValueEmptyForField helper', () => {
    const textFieldConfig: AirtableSingleLineTextField['config'] =
        Object.freeze({
            type: FieldType.SINGLE_LINE_TEXT,
            options: null,
        });

    const buttonFieldConfig: AirtableButtonField['config'] = Object.freeze({
        type: FieldType.BUTTON,
        options: null,
    });
    const selectFieldConfig: AirtableSelectField['config'] = Object.freeze({
        type: FieldType.MULTIPLE_SELECTS,
        options: { choices: [] },
    });
    it('should return true for undefined', () => {
        expect(
            isValueEmptyForField({
                airtableFieldConfig: textFieldConfig,
                value: undefined,
            })
        ).toBe(true);
    });
    it("should return true for empty strings ('')", () => {
        expect(
            isValueEmptyForField({
                airtableFieldConfig: textFieldConfig,
                value: '',
            })
        ).toBe(true);
    });

    it('should return true when url of ButtonField is null', () => {
        expect(
            isValueEmptyForField({
                airtableFieldConfig: buttonFieldConfig,
                value: { url: null, label: 'Some label' } as AirtableValue,
            })
        ).toBe(true);
    });
    it('should return true when url of ButtonField is undefined', () => {
        expect(
            isValueEmptyForField({
                airtableFieldConfig: buttonFieldConfig,
                value: { url: undefined, label: 'Some label' } as AirtableValue,
            })
        ).toBe(true);
    });

    it('should return true when url of ButtonField is an empty string', () => {
        expect(
            isValueEmptyForField({
                airtableFieldConfig: buttonFieldConfig,
                value: { url: '', label: 'Some label' } as AirtableValue,
            })
        ).toBe(true);
    });
    it('should return true for empty arrays', () => {
        expect(
            isValueEmptyForField({
                airtableFieldConfig: selectFieldConfig,
                value: [] as AirtableValue,
            })
        ).toBe(true);
    });

    it('should return true for arrays filled with undefined', () => {
        expect(
            isValueEmptyForField({
                airtableFieldConfig: selectFieldConfig,
                value: [undefined, undefined, undefined] as AirtableValue,
            })
        ).toBe(true);
    });

    it('should return true for arrays filled with null', () => {
        expect(
            isValueEmptyForField({
                airtableFieldConfig: selectFieldConfig,
                value: [null, null, null] as AirtableValue,
            })
        ).toBe(true);
    });

    it('should return false partially filled arrays', () => {
        const option = {
            id: faker.datatype.string(6),
            name: 'An option',
            color: 'red',
        };
        expect(
            isValueEmptyForField({
                airtableFieldConfig: selectFieldConfig,
                value: [
                    option,
                    undefined,
                    option,
                    null,
                    option,
                    option,
                    null,
                    undefined,
                    undefined,
                ] as AirtableValue,
            })
        ).toBe(false);
    });
});
