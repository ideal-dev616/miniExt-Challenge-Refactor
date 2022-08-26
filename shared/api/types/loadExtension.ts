import { AirtableFieldSet, FieldNamesToFields } from '../../airtable/types';
import { ExtensionType } from '../../extensions/sections';
import { ParsedCookies } from '../handler-types';

export enum ExtensionScreen {
    FORM_LOADED = 'form_loaded',
}

export type Query = NodeJS.Dict<string | string[]>;

export type ExtensionId = string;

type LoadExtensionInputBase = {
    extensionId: ExtensionId;
    loggedInUserUID: string | null;
    loggedInUserEmail: string | null;
    parsedCookies: ParsedCookies;
};

export type LoadExtensionInput = LoadExtensionInputBase & {
    extensionScreen: ExtensionScreen.FORM_LOADED;

    /**
     * The recordId from the URL, or from the line item form.
     * If a login screen is used, this will be ignored.
     */
    recordId: string | null;
    searchQuery: Query;
    clientIp: string | undefined;
    userAgent: string | undefined;
};
/**
 * Represents a record on a form. When the form is being used to edit a record, this includes that record's ID.
 */
export type FormRecord =
    | {
          type: 'create';
          data: AirtableFieldSet;
      }
    | {
          type: 'edit';
          recordId: string;
          data: AirtableFieldSet;
      };

/**
 * Represents the current field errors in the form.
 */
export type FormErrors = {
    [fieldName: string]: string | undefined;
};

export type FormLoadedOutputData = {
    extensionType: ExtensionType.FORM;
    extensionUserUID: string;
    formRecord: FormRecord;
    formErrors: FormErrors;
    /**
     * These are not just all the fields in the form. These
     * are all the fields on the form + fields used for things like form title, cover img, etc.
     * defined in the extensions's state
     */
    airtableFieldsUsedByExtensionPublically: string[];
    fieldsInForm: string[];
    fieldNamesToSchemas: FieldNamesToFields;
};

export type ExtensionScreenAndDataOutput<Screen, Data> = {
    extensionScreen: Screen;
    extensionId: string;
    payload: Data;
};

export type FormLoadedOutput = ExtensionScreenAndDataOutput<
    ExtensionScreen.FORM_LOADED,
    FormLoadedOutputData
>;

export type LoadExtensionOuput = FormLoadedOutput;
