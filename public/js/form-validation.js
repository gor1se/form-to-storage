"use strict";

// Pflichtfelder: Vorname, Nachname, Stadt, Plz, Straße, Hausnummer

const fieldfName = document.querySelector("#fName");
const fieldlName = document.querySelector("#lName");
const fieldcity = document.querySelector("#city");
const fieldplz = document.querySelector("#plz");
const fieldstrasse = document.querySelector("#strasse");
const fieldHausnummer = document.querySelector("#Hausnummer");

const addButton = document.querySelector("#add-btn");

addButton.setAttribute("disabled", "");
addButton.classList.add("disabled");

document.addEventListener("keyup", () => {
    console.log("press!");
    if (
        fieldfName.value !== "" &&
        fieldlName.value !== "" &&
        fieldcity.value !== "" &&
        fieldplz.value !== "" &&
        fieldstrasse.value !== "" &&
        fieldHausnummer.value !== ""
    ) {
        addButton.classList.remove("disabled");
        addButton.removeAttribute("disabled");
    } else {
        addButton.setAttribute("disabled", "");
        addButton.classList.add("disabled");
    }
});
