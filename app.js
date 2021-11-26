const express = require("express");
const bodyParser = require("body-parser");
const GoogleRecaptcha = require("google-recaptcha");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const axios = require("axios");
const app = express();

app.use(express.static("./public")); // for static files
app.use(bodyParser.urlencoded({ extended: true })); // to be able to pars data from post requests.

app.post("/", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const response_key = req.body["g-recaptcha-response"];
  const secret_key = "6Ldm1F0dAAAAAGDiplqHIwkTJI272flrdbut1IVu";
  const google_url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

  //check if user filled captcha
  if (response_key.length < 300) {
    res.sendFile(__dirname + "/error.html");
  } else {
    ///go on with google validation

    axios.post(google_url).then((Gresponse) => {
      if (Gresponse.data.success) {
        console.log(Gresponse.data.success);
        // **********mail chimp api request ***********
        mailchimp.setConfig({
          apiKey: "e2f3edbde6c6e7d259e7ae3d52cd9f46-us18",
          server: "us18",
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
              LNAME: subscribingUser.lastName,
            },
          });
        }

        run()
          .then(() => res.sendFile(__dirname + "/success.html"))
          .catch(() => res.sendFile(__dirname + "/error.html"));
      } else {
    () => res.sendFile(__dirname + "/error.html");
      }
    });
  }

});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("app is running");
});
