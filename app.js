let express = require("express");
let sendEmail = require('./email.js');
let port = 3030;
let app = express();

app.use(express.json());

app.listen(port, () => {
    console.log("server is live");
});


app.get("/",(req,res)=>{

    res.send("helloo ji kaise ho ");
})
app.post("/email", (req, res) => {
    let { userEmail, subject, text } = req.body;

    sendEmail(userEmail, subject, text)
        .then(() => {
            res.send("MAIL SENT");
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error sending email");
        });
});
