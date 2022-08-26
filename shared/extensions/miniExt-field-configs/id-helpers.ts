import { AnyMiniExtFieldWithConfig } from 'shared/generated/extension-versions/current/MiniExtFieldConfig';

export const getIdFromMiniExtFieldWithConfig = (
    config: AnyMiniExtFieldWithConfig
) => {
    const id = config.idOrName.type === 'id' ? config.idOrName.id : null;

    if (!id) {
        throw new Error(
            'Fields were expected to be keyed by ids, but found names instead.'
        );
    }

    return id;
};

export const getNameFromMiniExtFieldWithConfig = (
    config: AnyMiniExtFieldWithConfig
) => {
    const name = config.idOrName.type === 'name' ? config.idOrName.name : null;

    if (!name) {
        throw new Error(
            'Fields were expected to be keyed by names, but found ids instead.'
        );
    }

    return name;
};
