const dash_items = document.querySelectorAll(".dash-item");
const overview = document.querySelector(".card-container");
const fee_section = document.querySelector(".fee-section");
const profile_section = document.querySelector(".profile-section");

dash_items[0].classList.add("active");

dash_items.forEach(item => {
    const item_name = item.children[1].innerHTML.toLowerCase();
    if (item.classList.contains("active")) {
        if (item_name === "overview") {
            overview.classList.add("card-container");
            fee_section.style.display = "none";
            profile_section.style.display = "none";
        }
    }
    item.addEventListener("click", function () {
        const childrenArr = Array.from(item.parentElement.children);
        childrenArr.forEach(child => {
            if (child.classList.contains("active")) {
                if (item_name === "overview") {
                    overview.style.display = "grid";
                    fee_section.style.display = "none";
                    profile_section.style.display = "none";
                } else if (item_name === "fee details") {
                    fee_section.style.display = "block";
                    overview.style.display = "none";
                    profile_section.style.display = "none";
                }else if (item_name === "edit profile"){
                    profile_section.style.display = "block";
                    overview.style.display = "none";
                    fee_section.style.display = "none";
                }
                child.classList.remove("active");
            }
        })
        item.classList.add("active");
    });
});