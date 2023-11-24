const modals = document.querySelectorAll(".data-modal");
const payment_form = document.querySelector("#modal-one");
const update_form = document.querySelector("#modal-two");

const exits = document.querySelectorAll(".modal-exit");
payment_form.style.display = "none";
update_form.style.display = "none";

modals.forEach(function (modal) {
    modal.addEventListener('click', function (event) {
        if (this.getAttribute("name") === "pay") {
            const bill_id = this.querySelector("[name='pay_button']").getAttribute("id");
            payment_form.querySelector("[name='bill_id']").setAttribute("value", bill_id);
            payment_form.style.display = "grid";
            payment_form.classList.add("open");
        }else if (this.getAttribute("name") === "edit") {
            update_form.style.display = "grid";
            update_form.classList.add("open");
            const student_id = document.querySelector("[name='student_id']").getAttribute("id");
            update_form.querySelector("[name='id']").setAttribute("value", student_id);
        }

        exits.forEach(exit => {
            exit.addEventListener("click", function(){
                if (exit.getAttribute("name") === "issue-exit"){
                    payment_form.classList.remove("open");
                }else if(exit.getAttribute("name") === "update-exit"){
                    update_form.classList.remove("open");
                }
            })
        })
    });
})