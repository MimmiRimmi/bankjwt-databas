import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import mysql from "mysql";

const secret = "sommar";
const app = express();
const PORT = 7002;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Bank",
  port: 8889,
});

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  const id = 1;

  connection.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.log(err);
    }
    console.log(results);
    res.send(results[0].username);
  });
});

app.post("/users", (req, res) => {
  const user = req.body;
  console.log(user);

  const { userName, password, email, amount } = user;

  console.log(userName);

  console.log("NEW USER", user);

  connection.query(
    "INSERT INTO users (userName, password, email) VALUES (?, ?, ?)",
    [userName, password, email],
    (err, results) => {
      console.log("results", results);

      if (err) {
        res.sendStatus(500);
      } else {
        const userId = results.insertId;

        connection.query(
          "INSERT INTO accounts (user_id) VALUES (?)",
          [userId],
          (err, results) => {
            if (err) {
              res.sendStatus(500);
            } else {
              res.send("ok");
            }
          }
        );
      }
    }
  );
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("DB connected");
  }
});

function generateAccessToken(userId) {
  return jwt.sign(userId, secret);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secret, (err, userId) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.userId = userId;

    next();
  });
}

app.post("/sessions", (req, res) => {
  const user = req.body;
  const { userName } = user;

  connection.query(
    "SELECT * FROM users WHERE userName = ?",
    [userName],
    (err, results) => {
      console.log(results[0].id, userName, results[0].password);
      if (userName != null && results[0].password) {
        const token = generateAccessToken(results[0].id);
        console.log("great success");
        console.log(token);
        res.json({ token });
      } else {
        console.log("INCORRECT PW OR UNAME", userName);
        res.status = 401;
        res.json();
      }
    }
  );
});

app.get("/me/accounts", authenticateToken, (req, res) => {
  const user_Id = req.userId;
  connection.query(
    "SELECT * FROM accounts WHERE user_id = ?",
    [user_Id],
    (err, results) => {
      if (err) console.log("fel från databasen", err);
      console.log("result", results[0]);
      const amount = results[0].amount;
      console.log(amount);
      res.json(amount);
    }
  );
});

app.listen(PORT, () => {
  console.log("server starts listening on port " + PORT);
});
