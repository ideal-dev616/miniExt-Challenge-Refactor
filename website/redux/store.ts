import { configureStore } from '@reduxjs/toolkit';

import publicExtensionReducer from '../components/PublicExtension/redux/publicExtensionReducer';
import { PublicExtensionState } from '../components/PublicExtension/redux/types';
import modalReducer, {
    ModalState,
} from '../components/reusables/Modal/modalReducer';

export const store = configureStore<{
    publicExtension: PublicExtensionState;
    modal: ModalState;
}>({
    reducer: {
        publicExtension: publicExtensionReducer,
        modal: modalReducer,
    },
});

export type Store = typeof store;
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];
