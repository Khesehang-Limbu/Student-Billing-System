import {validateInputs} from "/js/client_side_validation.js";

const register_path = window.location.pathname;
const register_input = document.querySelector("[name='route']");

const type_of_user = document.querySelector("[name='type_of_user']").value;
const login_form = document.querySelector("form");

const email = login_form.email;
const password = login_form.password;

const user_details = {
    email : email,
    password : password    
}

login_form.addEventListener("submit", function (event) {
    if (type_of_user === "student"){
        if (!validateInputs("student", "login", user_details)) {
            event.preventDefault();
        }
    }else if (type_of_user === "staff"){
        if (!validateInputs("staff", "login", user_details)) {
            event.preventDefault();
        }
    }
})



