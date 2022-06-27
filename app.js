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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public", "index.html"));
});

app.get("/add", (req, res) => {
    res.render("pages/form");
});

app.get("/show", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);
    res.render("pages/show", {
        data: data,
    });
});

app.get("/find", (req, res) => {
    res.render("pages/find", { results: [] });
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
    res.render("pages/find", { results: results_4 });
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
    res.render("Erfolgreich");
    let dataJsonNew = fs.readFileSync("data.json", "utf-8");
    let dataNew = JSON.parse(dataJson);
    res.render("pages/show", {
        data: dataNew,
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

/*TODO:
    Startseite:
    Hier soll der Kunde ganz einfach zwischen Schaltflächen wählen können.
    Es soll folgende Schaltflächen geben: Kunde hinzufügen, Kunde suchen, Kunden anzeigen, Kunde löschen
    Kunde hinzufügen:
    Im Prinzip ist die Funktionalität hierfür schon vorhanden. Nur wird das Formular und der Datensatz noch etwas geändert.
    Ein Kunde hat folgende Felder: Firma, Vorname, Nachname, Stadt, Postleitzahl, Straße, Hausnummer, Adresszusatz, Produkt.
    Es gibt folgende Produkte: Gemüsekiste Basic, Gemüsekiste Pro, Gemüsekiste Deluxe
    Kunde suchen:
    Auf dieser Seite kann nach Kunden gesucht werden. Gefiltert wird nach den folgenden Kriterien:
    Postleitzahl, Firma, Vorname, Nachname, Produkt
    Kunden anzeigen:
    Auf dieser Seite werden alle Kunden tabellarisch angezeigt.
    Später könnte man noch eine Filterfunktion in den Kopf der Tabelle integrieren.
    Kunde löschen:
    Ähnlich wie Kunde suchen. Mit dem unterschied, dass Kundendaten auch gelöscht werden können
*/
