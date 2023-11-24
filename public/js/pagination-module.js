const createPagination = function () {
    const paginationNumbers = document.getElementsByClassName("pagination-numbers");
    const paginatedList = document.querySelector(table + "#paginated-item");
    const listItem = paginatedList.querySelectorAll("tr");
    const paginationLimit = 5;
    const pageCount1 = Math.ceil(listItem.length / paginationLimit);

    appendPageNumber = (index) => {
        const pageNumber = document.createElement("button");
        pageNumber.className = "pagination-number";
        pageNumber.innerHTML = index;
        pageNumber.setAttribute("page-index", index);
        pageNumber.setAttribute("aria-label", "Page " + index);
        paginationNumbers.appendChild(pageNumber);
    };

    getPaginationNumbers = () => {
        for (let i = 1; i <= pageCount; i++) {
            appendPageNumber(i);
        }
    };

    setCurrentPage = (pageNum) => {
        currentPage = pageNum;

        handleActivePageNumber();
        handlePageButtonsStatus();

        const prevRange = (pageNum - 1) * paginationLimit;
        const currRange = pageNum * paginationLimit;

        listItem.forEach((item, index) => {
            item.classList.add("hidden");
            if (index >= prevRange && index < currRange) {
                item.classList.remove("hidden");
            }
        });
    };

    handleActivePageNumber = () => {
        document.querySelectorAll(".pagination-number").forEach((button) => {
            button.classList.remove("active-btn");

            const pageIndex = Number(button.getAttribute("page-index"));
            if (pageIndex == currentPage) {
                button.classList.add("active-btn");
            }
        });
    };

    disableButton = (button) => {
        button.classList.add("disabled");
        button.setAttribute("disabled", true);
    };

    enableButton = (button) => {
        button.classList.remove("disabled");
        button.removeAttribute("disabled");
    };

    handlePageButtonsStatus = () => {
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
}

module.exports = createPagination;
