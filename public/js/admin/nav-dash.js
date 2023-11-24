const dash_items = document.querySelectorAll(".dash-item");
const overview = document.querySelector(".overview");
const fee_section = document.querySelector(".students-body");
const staff_section = document.querySelector(".staff-body");

dash_items[0].classList.add("active");

dash_items.forEach(item => {
    const item_name = item.children[1].innerHTML.toLowerCase();
    if (item.classList.contains("active")) {
        if (item_name === "overview") {
            overview.style.display = "block";
            fee_section.style.display = "none";
            staff_section.style.display = "none";
        }
    }
    item.addEventListener("click", function () {
        const childrenArr = Array.from(item.parentElement.children);
        childrenArr.forEach(child => {
            if (child.classList.contains("active")) {
                if (item_name === "overview") {
                    overview.style.display = "block";
                    fee_section.style.display = "none";
                    staff_section.style.display = "none";
                } else if (item_name === "students") {
                    fee_section.style.display = "block";
                    console.log(fee_section);
                    overview.style.display = "none";
                    staff_section.style.display = "none";
                } else if (item_name == "staffs") {
                    overview.style.display = "none";
                    fee_section.style.display = "none";
                    staff_section.setAttribute("style", `display :block; margin-top : 10px;`);
                    Array.from(staff_section.children).forEach(child => {
                        child.setAttribute("style", `margin : 0 auto;`);
                    })
                }
                child.classList.remove("active");
            }
        })
        item.classList.add("active");
    });
});