import React from 'react';
import { makeNeedToSyncBaseErrorMessage } from '../../../utils/makeNeedToSyncBaseErrorMessage';
import ErrorMessage from '../../reusables/ErrorMessage';

const UnexpectedFieldValue = () => {
    return (
        <ErrorMessage
            message={makeNeedToSyncBaseErrorMessage(
                'This field contains an unexpected value.'
            )}
        />
    );
};

export default UnexpectedFieldValue;
