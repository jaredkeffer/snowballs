/*
* IMPORTANT add Content-Type:application/json as headers to request
*/

let express = require('express')
let bodyParser = require('body-parser')
let awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });


// declare a new express app
let app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


let dynamodb = new AWS.DynamoDB();
let dynamodbClient = new AWS.DynamoDB.DocumentClient();
let ses = new AWS.SES();

app.post('/itineraries/new', async (req, res) => {
  let { sub, email, city, activitySlots, start, end} = req.body;
  console.log('req.body: ',req.body);
  console.log('email: ',req.body);
  let itinerary = {};
  itinerary.itinerary_id = uuidv4();
  itinerary.created_date = new Date().getTime();
  itinerary.created_by = sub;

  let writeItinerary = await writeDynamo('itineraries', itinerary);
  if (writeItinerary.isError) res.json(writeItinerary.response);

  let info = {
    email, city, activitySlots,
    start, end,
    details: {
      // add more stuff here...
      preferences: 'na',
    },
  };
  let emailResponse = await sendEmail(info);
  console.log(emailResponse);

  res.json({ success: 'post call returned', url: req.url, itinerary: itinerary, email: emailResponse });

});

async function writeDynamo(tableName, item){
  let params = {
    TableName: tableName,
    Item: item,
  }

  let response = await dynamodbClient.put(params).promise().catch((error) => {
    console.error('writeDynamo() ',error);
    return {isError: true, response: { failure: 'writeDynamo() returned with an error', error: error }};
  });
  return {isError: false, response: { success: 'writeDynamo() succeeded' }};

}

async function sendEmail(info) {
  let { city, start, end, email, details } = info;
  let formattedMessage = craftMessage(info)
  let dez = 'dez@odyssey-experiences.com';
  let params = {
    Destination: { ToAddresses: [email], BccAddresses: [dez], },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: formattedMessage
        },
      },
      Subject: { Charset: "UTF-8", Data: "Itinerary Request Confirmation" }
    },
    Source: "Odyssey Experiences Team <odysseytech.llc@gmail.com>",
  }

  return await ses.sendEmail(params).promise().catch((error) => console.log(error));
}

function craftMessage(info) {
  let { city, start, end, email, details } = info;

  return `<h3>Thanks for requesting an itinerary to ${city}!</h3>
  <p>The itinerary was requested by ${email}.</p>
  <div class="main">
    <table>
      <tr>
        <td>City</td>
        <td>${city}</td>
      </tr>
      <tr>
        <td>Dates</td>
        <td>${new Date(start).toDateString() } - ${new Date(end).toDateString()}</td>
      </tr>
      <tr>
        <td>Details</td>
        <td><pre>${JSON.stringify(details, undefined, 2)} </pre></td>
      </tr>
    </table>
  </div>`;
}

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
