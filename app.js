import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import bodyParser from "body-parser";
import fs from "fs";
import ejs from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const port = 3000;

let flag = {
    content: "",
    type: "",
};

app.get("/", (req, res) => {
    res.render("pages/index", { flag: flag });
});

app.get("/add", (req, res) => {
    res.render("pages/form", { flag: flag });
});

app.get("/show", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);
    res.render("pages/show", {
        data: data,
        flag: flag,
    });
});

app.get("/find", (req, res) => {
    res.render("pages/find", { results: [], flag: flag });
    flag.type = "";
});

app.get("/delete", (req, res) => {
    res.render("pages/delete", { flag: flag });
});

app.post("/find", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);
    let results_1 = [];
    let results_2 = [];
    let results_3 = [];
    let results_4 = [];
    data.forEach(date => {
        if (
            date.Firma === req.body.searchCompany ||
            req.body.searchCompany === ""
        ) {
            results_1.push(date);
        }
    });
    results_1.forEach(date => {
        if (
            date.Vorname === req.body.searchFirstName ||
            req.body.searchFirstName === ""
        ) {
            results_2.push(date);
        }
    });
    results_2.forEach(date => {
        if (
            date.Nachname === req.body.searchLastName ||
            req.body.searchLastName === ""
        ) {
            results_3.push(date);
        }
    });
    results_3.forEach(date => {
        if (date.Stadt === req.body.searchCity || req.body.searchCity === "") {
            results_4.push(date);
        }
    });
    res.render("pages/find", { results: results_4, flag: flag });
});

app.post("/add", (req, res) => {
    const userObj = {
        Firma: req.body.firma,
        Vorname: req.body.fName,
        Nachname: req.body.lName,
        Stadt: req.body.city,
        Postleitzahl: req.body.plz,
        Straße: req.body.strasse,
        Hausnummer: req.body.Hausnummer,
        Adresszusatz: req.body.Adresszusatz,
        Produkt: req.body.Produkt,
    };

    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);
    data.push(userObj);
    dataJson = JSON.stringify(data);
    fs.writeFileSync("data.json", dataJson, "utf-8");
    let dataJsonNew = fs.readFileSync("data.json", "utf-8");
    let dataNew = JSON.parse(dataJson);
    flag.type = "success";
    flag.content = "Kunde wurde erfolgreich angelegt!";
    res.render("pages/show", {
        data: dataNew,
        flag: flag,
    });
    flag.type = "";
});

app.post("/delete", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);
    let results_1 = [];
    let results_2 = [];
    let results_3 = [];
    let results_4 = [];

    data.forEach(date => {
        if (
            date.Firma === req.body.searchCompany ||
            req.body.searchCompany === ""
        ) {
            results_1.push(date);
        }
    });
    results_1.forEach(date => {
        if (
            date.Vorname === req.body.searchFirstName ||
            req.body.searchFirstName === ""
        ) {
            results_2.push(date);
        }
    });
    results_2.forEach(date => {
        if (
            date.Nachname === req.body.searchLastName ||
            req.body.searchLastName === ""
        ) {
            results_3.push(date);
        }
    });
    results_3.forEach(date => {
        if (date.Stadt === req.body.searchCity || req.body.searchCity === "") {
            results_4.push(date);
        }
    });

    if (results_4.length === 1) {
        let filteredArray = data.filter(element => {
            return element !== results_4[0];
        });

        let filteredData = JSON.stringify(filteredArray);
        fs.writeFileSync("data.json", filteredData, "utf-8");

        flag.type = "success";
        flag.content = "User wurde erfolgreich gelöscht!";
        res.render("pages/show", {
            data: filteredArray,
            flag: flag,
        });
    } else {
        flag.type = "failure";
        flag.content = "Kein eindeutiger Treffer!";
        res.render("pages/show", {
            data: data,
            flag: flag,
        });
    }
    flag.type = "";
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// OK: 1.
// EJS Header ergänzen. In den einzelnen Dateien soll nur noch HTML-Body code stehen

// OK: 2.
// Footer partial erstellen, kleiner Hinweis auf Impressum und Copyright
// Beachte Footer Position

// OK: 3.
// Eigenes kleines Notification Framework erstellen.
// Kleine Flags, die unten in der linken Ecke erscheinen und unterschiedliche Typen haben können (Unterschiedliche Farben)
// Möglicherweise verschwinden nach kurzer Zeit
// Flags wo nötig und sinnvoll implementieren

// TODO: 4.
// Pflichtfelder für die Kundenerstellung hinzufügen
// Lokales Skript überprüft eingaben und schaltet Erstellen-Button frei
// Defaultmäßig ist der Button deaktiviert

// TODO: 5.
// Neue versteckte Post Seite, die die gesamte data.json in eine CSV Datei abspeichert
// CSV Datei Testweise in Excel öffnen
