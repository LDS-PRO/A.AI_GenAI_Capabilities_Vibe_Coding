const express = require("express");
const app = express();
const sql = require("./database");



app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (request, response) {
  var cluster = 2;
  var PC = [];
  response.render("index", { cluster, PC });
  
  //console.log(cluster)
});


app.post("/update/", async function (cluster, PC) {
  //function pc2Steps(i,ii) {if (typeof i ==='undefined') {return ii} else {return i}};
  //var Pf = pc2Steps(Pmin1,cluster.body.PC)
  let update = await sql.accessSpreadsheet2(cluster.body, cluster.body.PC);
  //var Pmin1 = cluster.body.PC;
  //cluster.send(update);
 
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

