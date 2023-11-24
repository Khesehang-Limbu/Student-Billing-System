const modals = document.querySelectorAll("[data-modal]");
const issue_form = document.querySelector("#modal-one");
const verify_form = document.querySelector("#modal-two");

issue_form.style.display = "none";
verify_form.style.display = "none";

modals.forEach(modal => {
    modal.addEventListener('click', function (event) {
        if (modal.getAttribute("name") === "issue"){
            issue_form.style.display = "grid";
            issue_form.classList.add('open');
            const student_id = modal.getAttribute("id");
            issue_form.querySelector("[name='student_id']").setAttribute("value", student_id);
        }else{
            var xhttp = new XMLHttpRequest();
            const student_id = "";
            let bill_amount = "";
            let bill_img = "";

            const bill_id = modal.dataset.bill_id;

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                // Typical action to be performed when the document is ready:
                const result = JSON.parse(xhttp.response);

                console.log(result.payment_amount);

                bill_amount = result.payment_amount;
                bill_img = result.bill_image;

                console.log(bill_amount);
                console.log(bill_img);
                console.log(document.querySelector(".bill").children[0]);
                console.log(document.querySelector(".bill").children[0].setAttribute("src", `/uploads/bills/${bill_img}`));
                document.querySelector(".bill_amount").setAttribute("value", bill_amount);  
                }
            };
            const url = `/verify?bill_id=${bill_id}`;
            console.log(url);
            xhttp.open("GET", `/verify?bill_id=${bill_id}`, true);
            xhttp.send();


            verify_form.style.display = "grid";
            verify_form.classList.add("open");
        }
        
        const exits = document.querySelectorAll('.modal-exit');
        exits.forEach(function (exit) {
            exit.addEventListener('click', function (event) {
                event.preventDefault();
                if (modal.getAttribute("name") === "issue"){
                    issue_form.classList.remove('open');
                }else{
                    verify_form.classList.remove('open');
                }
            });
        });
    });
})