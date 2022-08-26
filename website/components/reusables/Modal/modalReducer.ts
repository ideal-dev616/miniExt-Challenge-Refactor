import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ModalState = {
    /**
     * We set this to true when a modal is shown using react-callable because
     * we need to disable dismissing any nested modal that was opened
     * before the callable modal.
     */
    callableModalIsShown: boolean;
};

const initialState: ModalState = {
    callableModalIsShown: false,
};

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setCallableModalIsShown: (state, action: PayloadAction<boolean>) => {
            state.callableModalIsShown = action.payload;
        },
    },
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;
