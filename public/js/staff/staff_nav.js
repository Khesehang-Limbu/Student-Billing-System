const dash_items = document.querySelectorAll(".dash-item");
const overview = document.querySelector(".card-container");
const bills = document.querySelector(".bills");
const paid_bills = document.querySelector(".paid-bills");

dash_items[0].classList.add("active");

dash_items.forEach(item => {
    const item_name = item.children[1].innerHTML.toLowerCase();
    if (item.classList.contains("active")) {
        if (item_name === "overview") {
            overview.classList.add("card-container");
            bills.style.display = "none";
            paid_bills.style.display = "none";
        }
    }
    item.addEventListener("click", function () {
        const childrenArr = Array.from(item.parentElement.children);
        childrenArr.forEach(child => {
            if (child.classList.contains("active")) {
                if (item_name === "overview") {
                    overview.style.display = "grid";
                    bills.style.display = "none";
                    paid_bills.style.display = "none";
                } else if (item_name === "manage bills") {
                    bills.style.display = "block";
                    paid_bills.style.display = "block";
                    overview.style.display = "none";
                }
                child.classList.remove("active");
            }
        })
        item.classList.add("active");
    });
});
