const modals = document.querySelectorAll('[data-modal]');
const update_form = document.querySelector(".modal form");

modals.forEach(function (trigger) {
  trigger.addEventListener('click', function (event) {
    const student_update = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    const user_id = trigger.getAttribute("id");
    console.log();
    event.preventDefault();
    let modal = "";
    if (event.target.name === "create"){
      modal = document.getElementById("modal-one");
    }else if (student_update.getAttribute("class") === "students-body"){
      document.querySelectorAll("#modal-three input[type=hidden]")[0].setAttribute("value", user_id);
      modal = document.getElementById("modal-three");
    }else if(student_update.getAttribute("class") === "students"){
      document.querySelectorAll("#modal-four input[type=hidden]")[0].setAttribute("value", user_id);
      modal = document.getElementById("modal-four");
    }else{
      document.querySelectorAll("#modal-two input[type=hidden]")[0].setAttribute("value", user_id);
      modal = document.getElementById("modal-two");
    }

    modal.classList.add('open');

    const exits = modal.querySelectorAll('.modal-exit');
    exits.forEach(function (exit) {
      exit.addEventListener('click', function (event) {
        event.preventDefault();
        modal.classList.remove('open');
      });
    });
  });
});