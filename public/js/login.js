const form = document.forms[0];
const email = form.email;
const password = form.password;

form.addEventListener("submit", function (event) {
    const emailRegularExp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

    if (!email.value.length > 8) {
        event.preventDefault();
        const error = document.createElement("span");
        error.innerHTML = "Insufficient length";

        if (!email.value.test(emailRegularExp)) {
            const errorRegex = document.querySelector(".error");
            error.innerHTML = "Error";
            console.log(error);
        }
    }
});