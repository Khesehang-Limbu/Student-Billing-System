import {validateEmail, validateFullName, validatePassword, validatePhoneNumber} from "/js/client_side_validation.js";

const register_path = window.location.pathname;
const register_input = document.querySelector("[name='route']");
const login_form = document.querySelector("form");
let errors = [];

login_form.addEventListener("submit", function (event) {

    const email = login_form.email.value;
    const password = login_form.password.value;
    const confirm_password = login_form.cpassword.value;

    const is_email_ok = validateEmail(email);
    const is_password_ok = validatePassword(password);

    let is_empty = false;
    let is_correct = true;
    let is_all_test = true;

    console.log(errors);

    if ((email !== "") && (password !== "")) {
        if (is_email_ok && is_password_ok) {
            if(password === confirm_password){
            }else{
                is_correct = false;
            }
        }else{
            is_all_test= false;
        }
    }else{
        is_empty = true;
    }

    errors.push(is_empty);
    errors.push(is_correct);
    errors.push(is_all_test);

    if ((errors[0] === false) && (errors[1] === true) && (errors[2] === true)){
        console.log("All Set");
        register_input.setAttribute("value", register_path);        
    }else {
        console.log("errors");
        event.preventDefault();
        errors = [];
        document.cookie = ("errors", errors);
    }
})

