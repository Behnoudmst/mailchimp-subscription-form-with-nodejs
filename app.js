const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.static("./public")); // for static files
app.use(bodyParser.urlencoded({ extended: true })); // to be able to pars data from post requests.


app.post ("/", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

//   **********mail chimp api request ***********
mailchimp.setConfig({
    apiKey:"e2f3edbde6c6e7d259e7ae3d52cd9f46-us18",
    server: "us18"
  });  


const listId = "90f850b520";
  const subscribingUser = {
    firstName: fname,
    lastName: lname,
    email: email,
  };
  
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }, 
    });
           
      }
  
  
    run()
    .then(()=>res.sendFile(__dirname + "/success.html"))
    .catch(()=>res.sendFile(__dirname + "/error.html"));
 
    });





app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen( process.env.PORT || 3000, () => {
  console.log("app is running");
});
