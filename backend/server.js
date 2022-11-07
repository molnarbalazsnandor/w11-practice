const express = require("express");
const path = require("path");
//alap elérési útvonalakat csinál
// a node.js globális eszköze

const fs = require("fs");
//beimportálja a telepített express modult

const app = express();

app.use(express.json()); //FONTOS!
//json content type-ú post requesteket átalakít json formátummá

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.use("/public", express.static(`${__dirname}/../frontend/public`));
/*a 
- use egy egész mappát tesz statikusan elérhetővé
- azaz a mappát magát nem, hanem a tartalmait
*/

app.get("/beers", (req, res) => {
  fs.readFile(`${__dirname}/data/data.json`, (err, data) => {
    if (err) {
      console.log("hiba:", err);
      res.status(500).send("hibavan");
    } else {
      res.status(200).send(JSON.parse(data));
    }
  });
});
//readFile /readFileSync: az utóbbiban nem lehet felülírni mások módosításait, cserébe lehet kicsit lassabb

app.get("/beers/:id", (req, res) => {
  let paramId = parseInt(req.params.id);
  //stringet csinálunk belőle

  let response = "beer not found";

  fs.readFile(`${__dirname}/data/data.json`, (err, data) => {
    if (err) {
      console.log("hiba:", err);
      return res.status(500).send("error at reading file");
    } else {
      const beerData = JSON.parse(data);

      beerData.forEach((beer) => {
        if (beer.id === paramId) {
          response = beer;
        }
      });

      return res.send(response);
    }
  });
});
//"/beers/:id": id nevű változóban elmenti azt a lekérést, amit a böngészőben ide írunk, a req.params alatt

app.post("/beers/:id", (req, res) => {
  const paramId = parseInt(req.params.id);
  const newBeerData = req.body;

  console.log(newBeerData);

  fs.readFile(`${__dirname}/data/data.json`, (err, data) => {
    if (err) {
      console.log("error:", err);
      return res.status(500).send(err);
    } else {
      const beersData = JSON.parse(data);

      for (let i = 0; i < beersData.length; i++) {
        if (beersData[i].id === paramId) {
          beersData[i] = newBeerData;
        }
      }

      fs.writeFile(
        `${__dirname}/data/data.json`,
        JSON.stringify(beersData, null, 2),
        (err) => {
          if (err) {
            console.log("error", err);
            return res.status(500).send(err);
          } else {
            return res.send({ response: "done" });
          }
        }
      );
    }
  });
});

app.listen(2022, console.log("server listening on http://127.0.0.1:2022"));
//1. paraméter: megadja a portszámot ennek a figyelőnek
//2. paraméter: mi történjen ezen a portszámon
