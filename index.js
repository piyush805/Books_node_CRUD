import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sys",
});

app.use(express.json());

// if there is a auth problem
// ALTER USER 'root@localhost' IDENTIFIED WITH mysql_native_password BY 'root'
// OR simply uninstall mysql and install mysql2

app.get("/", (req, res) => {
  res.json("Hello this is the backend");
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) return res.json({ message: "failure", data: err });
    return res.json({ message: "success", data: data });
  });
});

app.post("/books", (req, res) => {
  const q = "INSERT INTO books (`title`, `desc`, `cover`,`price`) VALUES(?)";
  const { title, desc, price, cover } = req.body;
  const values = [title, desc, cover, price];
  db.query(q, [values], (err, data) => {
    if (err) return res.json({ message: "failure", data: err });
    return res.json({
      message: "success",
      data: "Book has been created successfully",
    });
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id=?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.json({ message: "failure", data: err });
    return res.json({
      message: "success",
      data: "Book has been deleted successfully",
    });
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const { title, desc, price, cover } = req.body;
  const values = [title, desc, price, cover, bookId];

  const q =
    "UPDATE books SET `title` = ? ,`desc` = ? ,`price` = ? ,`cover` = ? WHERE id = ?";

  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.json({ message: "failure", data: err });
    return res.json({
      message: "success",
      data: "Book has been updated successfully",
    });
  });
});

app.listen(8800, () => {
  console.log("Connected to backend");
});
