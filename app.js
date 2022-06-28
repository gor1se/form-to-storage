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
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);

    res.render("pages/delete", { results: data, flag: flag });
});

app.get("/data-to-csv", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);
    let csvdata = ``;
    csvdata += `sep=,
Firma,Vorname,Nachname,Stadt,Postleitzahl,Straße,Hausnummer,Adresszusatz,Produkt`;
    data.forEach(date => {
        csvdata += `
${date.Firma},${date.Vorname},${date.Nachname},${date.Stadt},${date.Postleitzahl},${date.Straße},${date.Hausnummer},${date.Adresszusatz},${date.Produkt}`;
    });
    fs.writeFileSync("data.csv", csvdata, "utf-8");
    flag.type = "success";
    flag.content = "Daten erfolgreich als CSV abgespeichert!";
    res.render("pages/index", { flag: flag });
    flag.type = "";
});

app.post("/find", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);

    let filteredArray = data.filter(element => {
        return (
            (element.Firma === req.body.searchCompany ||
                req.body.searchCompany === "") &&
            (element.Vorname === req.body.searchFirstName ||
                req.body.searchFirstName === "") &&
            (element.Nachname === req.body.searchLastName ||
                req.body.searchLastName === "") &&
            (element.Stadt === req.body.searchCity ||
                req.body.searchCity === "")
        );
    });

    res.render("pages/find", { results: filteredArray, flag: flag });
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

    let filteredArray = data.filter(element => {
        return (
            (element.Firma === req.body.searchCompany ||
                req.body.searchCompany === "") &&
            (element.Vorname === req.body.searchFirstName ||
                req.body.searchFirstName === "") &&
            (element.Nachname === req.body.searchLastName ||
                req.body.searchLastName === "") &&
            (element.Stadt === req.body.searchCity ||
                req.body.searchCity === "")
        );
    });

    res.render("pages/delete", { results: filteredArray, flag: flag });
});

app.post("/delete-item", (req, res) => {
    let deleteObj = {
        Firma: req.body.searchCompany,
        Vorname: req.body.searchFirstName,
        Nachname: req.body.searchLastName,
        Stadt: req.body.searchCity,
    };

    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);

    let newData = data.filter(date => {
        return (
            date.Firma !== deleteObj.Firma ||
            date.Vorname !== deleteObj.Vorname ||
            date.Nachname !== deleteObj.Nachname ||
            date.Stadt !== deleteObj.Stadt
        );
    });

    let filteredData = JSON.stringify(newData);
    fs.writeFileSync("data.json", filteredData, "utf-8");

    flag.type = "success";
    flag.content = `Der Datensatz ${deleteObj.Firma}, ${deleteObj.Vorname}, ${deleteObj.Nachname}, ${deleteObj.Stadt} wurder erfolgreich gelöscht`;

    res.render("pages/delete", { results: [], flag: flag });
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

// OK: 4.
// Pflichtfelder für die Kundenerstellung hinzufügen
// Lokales Skript überprüft eingaben und schaltet Erstellen-Button frei
// Defaultmäßig ist der Button deaktiviert

// OK: 5.
// Neue versteckte Post Seite, die die gesamte data.json in eine CSV Datei abspeichert
// CSV Datei Testweise in Excel öffnen

// OK: 6.
// Bei Kunden anzeigen ist die Stadt und die Postleitzahl vertauscht
// Bei Kunden suchen tritt das gleiche Problem auf

// OK: 7.
// Das Kunde löschen Feature überarbeiten
// Erst sollen die Kunden gesucht werden
// Bei allen Ergebnissen die erscheinen soll rechts ein Mülleimer Icon in einer neuen Spalte erscheinen
// Dieses Icon ist auch ein Button. Nachdem der Button geklickt wird soll der Datensatz gelöscht werden und von der Ergebnisliste verschwinden

//TODO: 8.
// Die Kunden anzeigen Seite überarbeiten
// Auf die Jeweiligen Tabellenüberschriften sollte man klicken können um diese Entsprechend zu sortieren
// Lösung ähnlich wie bei 7.?
// Was für ein Default Filter soll angewendet werden?

// OK: 9
// Filterfunktionen überarbeiten
// Vier Arrays zu verwenden ist zu umständlich
// Arrayfunktionen verwenden (Filterfunktion kombinieren)

// TODO: 10.
// Nach dem Löschen eines Elements sollen die Suchkriterien nicht verschwinden
// Die Seite soll einfach nochmal Laden und die gleichen Suckkriterien nochmal durchlaufen lassen
