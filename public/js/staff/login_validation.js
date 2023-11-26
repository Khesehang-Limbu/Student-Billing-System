import {validateEmail, validateFullName, validatePassword, validatePhoneNumber} from "/js/client_side_validation.js";

const register_path = window.location.pathname;
const register_input = document.querySelector("[name='route']");
const login_form = document.querySelector("form");
const title = document.querySelector(".header").innerHTML;

let errors = [];

login_form.addEventListener("submit", function (event) {

    const email = login_form.email.value;
    const password = login_form.password.value;

    const is_email_ok = validateEmail(email);
    const is_password_ok = validatePassword(password);

    let is_empty = false;
    let is_all_test = true;

    if ((email !== "") && (password !== "")) {
        if (is_email_ok && is_password_ok) {
        }else{
            is_all_test= false;
        }
    }else{
        is_empty = true;
    }

    if (title.trim() === "Admin Login"){
        is_all_test = true;
    }

    errors.push(is_empty);
    errors.push(is_all_test);

    console.log(errors);

    if ((errors[0] === false) && (errors[1] === true)){
        register_input.setAttribute("value", register_path);        
    }else {
        event.preventDefault();
        errors = [];
        document.cookie = ("errors", errors);
    }
})

