const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: "e2f3edbde6c6e7d259e7ae3d52cd9f46-us18",
  server: "us18",
});

async function run() {
  const response = await mailchimp.ping.get();
  console.log(response);
}

run();