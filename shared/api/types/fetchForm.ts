import { ExtensionScreen, FormLoadedOutput, Query } from './loadExtension';

type FetchFormInputBase = {
    recordId: string | null;
    screen: ExtensionScreen;
    query: Query | undefined;
};

type FetchFormInputWithExtensionId = FetchFormInputBase & {
    extensionId: string;
};

export type FetchFormInput = FetchFormInputWithExtensionId;

export type FetchFormOutput = FormLoadedOutput;
