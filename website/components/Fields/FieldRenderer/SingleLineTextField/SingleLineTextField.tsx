import React from 'react';
import classes from './SingleLineTextField.styles';

type SingleLineTextFieldProps = {
    value: string | undefined;
    setValue: (value: string) => void;
};

/**
 * A field that renders AirtableSingleLineTextField in editor mode
 */
const SingleLineTextField = (props: SingleLineTextFieldProps) => {
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (
        event
    ) => {
        props.setValue(event.target.value);
    };

    return (
        <div className={classes.container}>
            <input
                // The role is needed by tests
                role={'textbox'}
                type={'text'}
                className={classes.input()}
                value={props.value || ''}
                onChange={handleChange}
            />
        </div>
    );
};

export default SingleLineTextField;
