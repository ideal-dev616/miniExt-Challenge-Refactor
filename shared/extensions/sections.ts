import { enumKeys } from '../helpers/enumKeys';

// TODO (Damilola): Pull constants into one file.
export enum ExtensionType {
    FORM = 'form',
}

export enum ExtFieldsWithConfigKey {
    formFieldsWithConfigsKey = 'formFields',
}

export const ALL_EXT_FIELDS_WITH_CONFIGS_KEYS = enumKeys(
    ExtFieldsWithConfigKey
).map((enumKeyName) => ExtFieldsWithConfigKey[enumKeyName]);
