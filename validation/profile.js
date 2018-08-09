const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    // Profile Handle validations
    if (validator.isEmpty(data.handle)) {
        errors.handle = 'Profile handle is required';
    } else if (!validator.isLength(data.handle, {
            min: 2,
            max: 40
        })) {
        errors.handle = 'Handle needs to be betwwen 2 and 40 characters';
    }

    // Status validations
    if (validator.isEmpty(data.status)) {
        errors.status = 'Status field is required';
    }

    // Skills validations
    if (validator.isEmpty(data.skills)) {
        errors.skills = 'Skills field is required';
    }

    // WebSite validations
    if (!isEmpty(data.website)) {
        if (!validator.isURL(data.website)) {
            errors.website = 'Not a valid URL';
        }
    }

    // Youtube validations
    if (!isEmpty(data.youtube)) {
        if (!validator.isURL(data.youtube)) {
            errors.youtube = 'Not a valid URL';
        }
    }

    // Facebook validations
    if (!isEmpty(data.facebook)) {
        if (!validator.isURL(data.facebook)) {
            errors.facebook = 'Not a valid URL';
        }
    }

    // Twitter validations
    if (!isEmpty(data.twitter)) {
        if (!validator.isURL(data.twitter)) {
            errors.twitter = 'Not a valid URL';
        }
    }

    // LinkedIn validations
    if (!isEmpty(data.linkedin)) {
        if (!validator.isURL(data.linkedin)) {
            errors.linkedin = 'Not a valid URL';
        }
    }

    // Instagram validations
    if (!isEmpty(data.instagram)) {
        if (!validator.isURL(data.instagram)) {
            errors.instagram = 'Not a valid URL';
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};