import {
    ExtensionScreen,
    LoadExtensionOuput,
} from 'shared/api/types/loadExtension';
import { assertUnreachable } from 'shared/utils/assertUnreachable';

import { ScreenState } from './redux/types';

export const getScreenStateForLoadExtensionOutput = (args: {
    result: LoadExtensionOuput;
}): ScreenState | null => {
    const result = args.result;
    const screen = result.extensionScreen;

    switch (screen) {
        case ExtensionScreen.FORM_LOADED:
            return {
                result: {
                    type: 'success',
                    data: result.payload,
                },
                extensionScreen: ExtensionScreen.FORM_LOADED,
                hasUnsavedChanges: false,
            };

        default:
            assertUnreachable(screen);
    }
};
