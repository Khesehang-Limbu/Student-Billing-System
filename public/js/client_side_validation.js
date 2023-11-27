function validateEmail(email) {
  const email_regex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  return email_regex.test(email);
}

function validatePassword(password) {
  const password_regex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

  return password_regex.test(password);
}

function validateFullName(name) {
  const fullname_regex = /(?:(\w+-?\w+)) (?:(\w+))(?: (\w+))?$/g;

  return fullname_regex.test(name);
}

function validatePhoneNumber(ph_number) {
  const ph_number_regex = /(?:\(?\+977\)?)?[9][6-9]\d{8}|01[-]?[0-9]{7}/;

  return ph_number_regex.test(ph_number);
}

function validateInputs(
  user_type,
  form_type,
  user_details
) {
  let fullname_value,
    email_value,
    password_value,
    cpassword_value,
    ph_number_value,
    faculty_value,
    gender_value;

  let success = true;

  const {fullname, email, password, cpassword, ph_number, faculty, gender, gender_error} = user_details;

  if (user_type === "student" && form_type === "register") {
    fullname_value = fullname.value.trim();
    email_value = email.value.trim();
    password_value = password.value.trim();
    cpassword_value = cpassword.value.trim();
    ph_number_value = ph_number.value.trim();
    faculty_value = faculty.value.trim();
    gender_value = gender.value;

    const register_form = document.querySelector("form");


    if (fullname_value === "") {
      success = false;
      setError(fullname, "Username is required");
    } else if (!validateFullName(fullname_value)) {
      success = false;
      setError(fullname, "Enter a valid Full Name; Ex: 'Khesehang Yonghang'");
    } else {
      setSuccess(fullname);
    }

    if (email_value === "") {
      success = false;
      setError(email, "Email is required");
    } else if (!validateEmail(email_value)) {
      success = false;
      setError(email, "Please enter a valid email");
    } else {
      setSuccess(email);
    }

    if (password_value === "") {
      success = false;
      setError(password, "Password is required");
    } else if (!validatePassword(password_value)) {
      success = false;
      setError(password, "Password must be atleast 8 characters long");
    } else {
      setSuccess(password);
    }

    if (cpassword_value === "") {
      success = false;
      setError(cpassword, "Confirm password is required");
    } else if (cpassword_value !== password_value) {
      success = false;
      setError(cpassword, "Password does not match");
    } else {
      setSuccess(cpassword);
    }

    if (ph_number_value === "") {
      success = false;
      setError(ph_number, "Phone Number is required");
    } else if (!validatePhoneNumber(ph_number_value)) {
      success = false;
      setError(ph_number, "Enter a valid Nepali phone number, (+977)");
    } else {
      setSuccess(ph_number);
    }

    if (faculty_value === "") {
      success = false;
      setError(faculty, "Faculty Data is required");
    } else {
      setSuccess(faculty);
    }

    if (gender_value === "") {
      success = false;
      setError(gender_error, "Please, select a gender.");
    } else {
      setSuccess(gender_error);
    }
  } else if (
    (user_type === "staff" || user_type === "student") &&
    form_type === "login"
  ) {
    email_value = email.value.trim();
    password_value = password.value.trim();

    if (email_value === "") {
      success = false;
      setError(email, "Email is required");
    } else if (!validateEmail(email_value)) {
      success = false;
      setError(email, "Please enter a valid email");
    } else {
      setSuccess(email);
    }

    if (password_value === "") {
      success = false;
      setError(password, "Password is required");
    } else if (!validatePassword(password_value)) {
      success = false;
      setError(password, "Password must be atleast 8 characters long");
    } else {
      setSuccess(password);
    }
  }

  return success;
}

function setError(element, message) {
  const input_field = element.parentElement;
  console.log(input_field);
  const error_element = input_field.querySelector(".error");

  error_element.innerText = message;
  input_field.classList.add("error");
  input_field.classList.remove("success");
}

function setSuccess(element) {
  const input_field = element.parentElement;
  const error_element = input_field.querySelector(".error");

  error_element.innerText = "";
  input_field.classList.add("success");
  input_field.classList.remove("error");
}

export { validateInputs };
