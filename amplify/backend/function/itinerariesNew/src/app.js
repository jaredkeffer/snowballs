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
let cognitoClient = new AWS.CognitoIdentityServiceProvider();
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
  let emailResponse = sendEmail(info);
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
  let params = {
    Destination: { ToAddresses: [email] },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `User: ${details}
                 City: ${city}\nDates: ${start} - ${end}\nDetails: ${details}`
        }
      },
      Subject: { Charset: "UTF-8", Data: "Test email" }
    },
    Source: "odysseytech.llc@gmail.com",
  };

  return await ses.sendEmail(params).promise().catch((error) => console.log(error));
}

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
