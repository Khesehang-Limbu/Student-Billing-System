import {
  validateInputs,
} from "/js/client_side_validation.js";

const register_path = window.location.pathname;
const register_input = document.querySelector("[name='route']");

const register_form = document.querySelector("form");
const fullname = register_form.fullname;
const email = register_form.email;
const password = register_form.password;
const cpassword = register_form.cpassword;
const ph_number = register_form.ph_number;
const faculty = register_form.faculty;
const gender = register_form.gender;
const gender_error = register_form
.querySelector(".radio_option")
.querySelector(".error");

const user_details = {
    fullname : fullname,
    email : email,
    password : password,
    cpassword : cpassword,
    ph_number : ph_number,
    faculty : faculty,
    gender : gender,
    gender_error : gender_error
}

register_form.addEventListener("submit", function (event) {
  if (!validateInputs("student", "register", user_details)) {
    event.preventDefault();
  }
});
