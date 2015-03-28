/**
 * Created by Роман on 28.03.2015.
 */
var math = require('mathjs');
/**
 *
 * @param data
 * @returns {{isValid: boolean, expression: *, error: null}}
 */
var validation = function (data) {
    var UnexpectedCharacters;
    var result = {
        isValid: true,
        expression: data,
        error: null
    };
    UnexpectedCharacters = result.expression.match(/[^\d\(\)\*\/\+-\. ]+/gi);
    if (UnexpectedCharacters && UnexpectedCharacters.length) {
        result.isValid = false;
        result.error = 'Unexpected operators: ' + JSON.stringify(UnexpectedCharacters);
    }
    return result;
};
/**
 *
 * @param data
 * @returns {*}
 */
module.exports = function (data) {
    var ValidationResult = validation(data);
    if (ValidationResult.isValid) {
        try {
            return data + ' = ' + math.eval(ValidationResult.expression);
        } catch (e) {
            console.log(e);
            return e.message;
        }
    } else {
        return ValidationResult.error;
    }
};