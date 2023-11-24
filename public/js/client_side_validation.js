function validateEmail(email){
    const email_regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

    return email_regex.test(email);
}

function validatePassword(password){
    const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

    return password_regex.test(password);
}

function validateFullName(name){
    const fullname_regex = /(?:(\w+-?\w+)) (?:(\w+))(?: (\w+))?$/g;

    return fullname_regex.test(name);
}

function validatePhoneNumber(ph_number){
    const ph_number_regex = /(?:\(?\+977\)?)?[9][6-9]\d{8}|01[-]?[0-9]{7}/;

    return ph_number_regex.test(ph_number);
}

export {validateEmail, validateFullName, validatePassword, validatePhoneNumber};