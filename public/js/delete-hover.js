"use strict";

function hover(element) {
    element.setAttribute("src", "img/bin_w.png");
}

function unhover(element) {
    element.setAttribute("src", "img/bin.png");
}

const deleteCriteriaCompany = document.querySelectorAll(
    ".deleteCriteriaCompany"
);
const deleteCriteriaFirstName = document.querySelectorAll(
    ".deleteCriteriaFirstName"
);
const deleteCriteriaLastName = document.querySelectorAll(
    ".deleteCriteriaLastName"
);
const deleteCriteriaCity = document.querySelectorAll(".deleteCriteriaCity");

document.addEventListener("keyup", () => {
    deleteCriteriaCompany.forEach(element => {
        element.value = document.querySelector("#searchCompany").value;
    });
    deleteCriteriaFirstName.forEach(element => {
        element.value = document.querySelector("#searchFirstName").value;
    });
    deleteCriteriaLastName.forEach(element => {
        element.value = document.querySelector("#searchLastName").value;
    });
    deleteCriteriaCity.forEach(element => {
        element.value = document.querySelector("#searchCity").value;
    });
});
