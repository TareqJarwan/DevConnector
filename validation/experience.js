const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';


    // Tilte Validations
    if (validator.isEmpty(data.title)) {
        errors.title = 'Job Title field is required';
    } 

    // Company Validations
    if (validator.isEmpty(data.company)) {
        errors.company = 'Company field is required';
    }

    // Form Date Validations
    if (validator.isEmpty(data.from)) {
        errors.from = 'Form Date field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};