const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "testDb"
});

connection.connect((err)=> {
    if (err) {
        console.error("error in connection...", err);
    } else {
        let sql = "CREATE TABLE users (id int(11) AUTO_INCREMENT, name varchar(255), rating varchar(255), PRIMARY KEY(id))"
        connection.query(sql, (err, result) => {
            if (err) {
                console.error("error in connection...", err);
            }
        })
        console.log("db connected successfully");
    }
});

module.exports = connection;