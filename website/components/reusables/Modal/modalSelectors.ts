import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';

export const selectCallableModalIsShown = (state: RootState) => {
    return state.modal.callableModalIsShown;
};

export const useCallableModalIsShown = () =>
    useAppSelector(selectCallableModalIsShown);
