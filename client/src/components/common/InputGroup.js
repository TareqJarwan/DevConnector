import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TextFieldGroup from "./TextFieldGroup";

const InputGroup = ({name, placeholder, value, error, onChange, icon, type}) => {
    return (
        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className={icon}/>
                </span>
            </div>
            <input type={type} placeholder={placeholder} name={name} value={value} onChange={onChange}
                   className={classNames('form-control form-control-lg', {'is-invalid': error})}/>
            {error && (<div className="invalid-feedback">{error}</div>)}
        </div>
    )
};

InputGroup.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    icon: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
};

TextFieldGroup.defaultProps = {
    type: 'text'
};

export default InputGroup;