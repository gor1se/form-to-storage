import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import bodyParser from "body-parser";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public", "form.html"));
});

app.post("/", (req, res) => {
    const userObj = {
        fName: req.body.fName,
        lName: req.body.lName,
        city: req.body.city,
    };
    console.log(userObj);
    // Hier sollen nun die Daten abgespeichert werden
    // const dataStr = JSON.stringify(userObj);

    // fs.appendFile("data.json", dataStr, "utf-8", function (err) {
    //     if (err) {
    //         console.log("There was an Error!");
    //     } else {
    //         console.log("Data has been saved successfuly!");
    //         res.send("Erfolgreich");
    //     }
    // });

    let dataJson = fs.readFileSync("data.json", "utf-8");
    let data = JSON.parse(dataJson);
    data.push(userObj);
    dataJson = JSON.stringify(data);
    fs.writeFileSync("data.json", dataJson, "utf-8");
    res.send("Erfolgreich");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
