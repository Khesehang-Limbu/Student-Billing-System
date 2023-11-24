const paginationNumbers = document.getElementsByClassName("pagination-numbers");
const paginatedList = document.querySelectorAll("#paginated-item");
const listItems1 = paginatedList[0].querySelectorAll("tr");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");

const listItems2 = paginatedList[1].querySelectorAll("tr");
const listItems3 = paginatedList[2].querySelectorAll("tr");

const paginationLimit = 5;
const pageCount1 = Math.ceil(listItems1.length / paginationLimit);
const pageCount2 = Math.ceil(listItems2.length / paginationLimit);
const pageCount3 = Math.ceil(listItems2.length / paginationLimit);

let currentPage;

window.addEventListener("load", () => {
    getPaginationNumbers(0, pageCount1);
    getPaginationNumbers(1, pageCount2);
    getPaginationNumbers(2, pageCount3);

    setCurrentPage("students", 1);
    setCurrentPage("staffs", 1);

    prevButton.addEventListener("click", (event) => {
        if (event.target.parentElement.parentElement.getAttribute("class") === "students"){
            setCurrentPage("students", currentPage - 1);
        }else{
            setCurrentPage("staffs", currentPage - 1);
        }
    });

    nextButton.addEventListener("click", (event) => {
        if (event.target.parentElement.parentElement.getAttribute("class") === "students"){
            setCurrentPage("students", currentPage + 1);
        }else{
            setCurrentPage("staffs", currentPage + 1);
        }
    });

    document.querySelectorAll(".pagination-number").forEach((button) => {
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex) {
            button.addEventListener("click", (event) => {
                if (event.target.parentElement.parentElement.parentElement.getAttribute("class") === "students"){
                    setCurrentPage("students", pageIndex);
                }else{
                    setCurrentPage("staffs", pageIndex);
                }
            });
        }
    });
});

const appendPageNumber = (index, table_no) => {
    const pageNumber = document.createElement("button");
    pageNumber.className = "pagination-number";
    pageNumber.innerHTML = index;
    pageNumber.setAttribute("page-index", index);
    pageNumber.setAttribute("aria-label", "Page " + index);
    paginationNumbers[table_no].appendChild(pageNumber);
};

const getPaginationNumbers = (table_no, pageCount) => {
    const tables = paginationNumbers.length;
    for (let i = 1; i <= pageCount; i++) {
        appendPageNumber(i, table_no);
    }
};

const setCurrentPage = (table, pageNum) => {
    currentPage = pageNum;
    handleActivePageNumber(table);
    handlePageButtonsStatus();

    const prevRange = (pageNum - 1) * paginationLimit;
    const currRange = pageNum * paginationLimit;

    listItems1.forEach((item, index) => {
        item.classList.add("hidden");
        if (index >= prevRange && index < currRange) {
            item.classList.remove("hidden");
        }
    });
};

const handleActivePageNumber = (table) => {
    document.querySelectorAll(`.${table} .pagination-number`).forEach((button) => {
        button.classList.remove("active-btn");
        const pageIndex = Number(button.getAttribute("page-index"));
        if (pageIndex == currentPage) {
            button.classList.add("active-btn");
        }
    });
};

const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
};

const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
};

const handlePageButtonsStatus = () => {
    if (currentPage === 1) {
        disableButton(prevButton);
    } else {
        enableButton(prevButton);
    }
    if (pageCount1 === currentPage) {
        disableButton(nextButton);
    } else {
        enableButton(nextButton);
    }
};