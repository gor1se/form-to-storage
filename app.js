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

    let deleteCriteria = {
        deleteCriteriaCompany: "",
        deleteCriteriaFirstName: "",
        deleteCriteriaLastName: "",
        deleteCriteriaCity: "",
    };

    res.render("pages/delete", {
        results: data,
        flag: flag,
        criteria: deleteCriteria,
    });
});

app.get("/data-to-csv", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);
    let csvdata = ``;
    csvdata += `sep=,
Firma,Vorname,Nachname,Stadt,Postleitzahl,Strasse,Hausnummer,Adresszusatz,Produkt`;
    data.forEach(date => {
        csvdata += `
${date.Firma},${date.Vorname},${date.Nachname},${date.Stadt},${date.Postleitzahl},${date.Strasse},${date.Hausnummer},${date.Adresszusatz},${date.Produkt}`;
    });
    fs.writeFileSync("data.csv", csvdata, "utf-8");
    flag.type = "success";
    flag.content = "Daten erfolgreich als CSV abgespeichert!";
    res.render("pages/index", { flag: flag });
    flag.type = "";
});

// Hier entsteht ein neuer Kommentar!

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
        Strasse: req.body.strasse,
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

    let deleteCriteria = {
        deleteCriteriaCompany: req.body.searchCompany,
        deleteCriteriaFirstName: req.body.searchFirstName,
        deleteCriteriaLastName: req.body.searchLastName,
        deleteCriteriaCity: req.body.searchCity,
    };

    console.log(deleteCriteria);

    res.render("pages/delete", {
        results: filteredArray,
        flag: flag,
        criteria: deleteCriteria,
    });
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

    let deleteCriteria = {
        deleteCriteriaCompany: req.body.deleteCriteriaCompany,
        deleteCriteriaFirstName: req.body.deleteCriteriaFirstName,
        deleteCriteriaLastName: req.body.deleteCriteriaLastName,
        deleteCriteriaCity: req.body.deleteCriteriaCity,
    };

    // Hier nochmals die Daten Lesen und Filtern

    let dataJsonAfterDelete = fs.readFileSync("data.json", "utf-8");
    let dataAfterDelete = JSON.parse(dataJsonAfterDelete);

    let newDataAfterDelete = dataAfterDelete.filter(date => {
        return (
            (date.Firma === deleteCriteria.deleteCriteriaCompany ||
                deleteCriteria.deleteCriteriaCompany === "") &&
            (date.Vorname === deleteCriteria.deleteCriteriaFirstName ||
                deleteCriteria.deleteCriteriaFirstName === "") &&
            (date.Nachname === deleteCriteria.deleteCriteriaLastName ||
                deleteCriteria.deleteCriteriaLastName === "") &&
            (date.Stadt === deleteCriteria.deleteCriteriaCity ||
                deleteCriteria.deleteCriteriaCity === "")
        );
    });

    res.render("pages/delete", {
        results: newDataAfterDelete,
        flag: flag,
        criteria: deleteCriteria,
    });
});

app.post("/filter-Firma", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);

    data.sort((a, b) => a.Firma.localeCompare(b.Firma));

    res.render("pages/show", { data: data, flag: flag });
});

app.post("/filter-Vorname", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);

    data.sort((a, b) => a.Vorname.localeCompare(b.Vorname));

    res.render("pages/show", { data: data, flag: flag });
});

app.post("/filter-Nachname", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);

    data.sort((a, b) => a.Nachname.localeCompare(b.Nachname));

    res.render("pages/show", { data: data, flag: flag });
});

app.post("/filter-Postleitzahl", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);

    data.sort((a, b) => a.Postleitzahl.localeCompare(b.Postleitzahl));

    res.render("pages/show", { data: data, flag: flag });
});

app.post("/filter-Stadt", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);

    data.sort((a, b) => a.Stadt.localeCompare(b.Stadt));

    res.render("pages/show", { data: data, flag: flag });
});

app.post("/filter-Strasse", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);

    data.sort((a, b) => a.Strasse.localeCompare(b.Strasse));

    res.render("pages/show", { data: data, flag: flag });
});

app.post("/filter-Hausnummer", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);

    data.sort((a, b) => {
        return parseInt(a.Hausnummer, 10) - parseInt(b.Hausnummer, 10);
    });
    res.render("pages/show", { data: data, flag: flag });
});

app.post("/filter-Adresszusatz", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);

    data.sort((a, b) => a.Adresszusatz.localeCompare(b.Adresszusatz));

    res.render("pages/show", { data: data, flag: flag });
});

app.post("/filter-Produkt", (req, res) => {
    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);

    data.sort((a, b) => a.Produkt.localeCompare(b.Produkt));

    res.render("pages/show", { data: data, flag: flag });
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

// OK: 8.
// Die Kunden anzeigen Seite überarbeiten
// Auf die Jeweiligen Tabellenüberschriften sollte man klicken können um diese Entsprechend zu sortieren
// Lösung ähnlich wie bei 7.?
// Was für ein Default Filter soll angewendet werden?
// Indikator für angewendeten Filter anzeigen. Pfeil nach unten.
// OK: Strasse in Strasse ändern
// OK: Hausnummern werden nicht korrekt gefiltert

// OK: 9
// Filterfunktionen überarbeiten
// Vier Arrays zu verwenden ist zu umständlich
// Arrayfunktionen verwenden (Filterfunktion kombinieren)

// OK: 10.
// Nach dem Löschen eines Elements sollen die Suchkriterien nicht verschwinden
// Die Seite soll einfach nochmal Laden und die gleichen Suckkriterien nochmal durchlaufen lassen

// OK: 11.
// Flagsystem animieren
// Eingangsanimation
// Ausgangsanimation (Verschwinden nach x-Sekunden)

// OK: 12.
// Löschenfeature: Mülleimer werden bei Hover weiß

// OK: Wie werden die Hausnummern nach der Zahl sortiert?
// Kommt 3a vor 3b? Wie ist die Logik?
