import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "admin",
  port: 5432,
})

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  //{ id: 1, title: "Buy milk" },
  //{ id: 2, title: "Finish homework" },
];


app.get("/", async (req, res) => {
  try{
    const result = await db.query("SELECT * FROM items");
    items = result.rows;
    console.log(items);
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }catch(err){
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  //items.push({ title: item });
  try{
    const result = await db.query("INSERT INTO items(title) VALUES($1) RETURNING *", [item]);
    console.log(result.rows[0]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const updatedItemTitle = req.body.updatedItemTitle
  try{
    const result = await db.query("UPDATE items SET title = $1 WHERE id = $2", [updatedItemTitle, id]);
    if(result.rowCount > 0){
      console.log("update is success");
      res.redirect("/");
    }
    else{
      console.log("update isn't success");
    }
  }catch(err)
  {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try{
    const result = await db.query("DELETE FROM items WHERE id = $1", [id]);
    if(result.rowCount > 0){
      console.log("Delete is success");
      res.redirect("/");
    }
    else{
      console.log("Delete isn't success");
    }
  }catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
