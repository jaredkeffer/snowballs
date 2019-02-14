/*
* IMPORTANT add Content-Type:application/json as headers to request
*/

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

let dynamodb = new AWS.DynamoDB();
let dynamodbClient = new AWS.DynamoDB.DocumentClient();
let cognitoClient = new AWS.CognitoIdentityServiceProvider();

app.post('/itineraries/new', async (req, res) => {

  let { city, activitySlots, numberOfDays, dates: {startDate, endDate}} = req.body;
  itinerary.itinerary_id = uuidv4();
  itinerary.created_date = new Date().getTime();

  let writeItinerary = await writeDynamo('itineraries', itinerary);
  if (writeItinerary.isError) res.json(writeItinerary.response);

  // getUserFromCognito(userpoolId, clientId);

  let info = {};
  info.city = city;
  info.start = startDate;
  info.end = endDate;
  info.username =
  info.details = {
    // req.requestContext.identity.
  }

  let emailResponse = await sendEmail(info);
  let userResponse = await getUserOfAuthenticatedUser(request);
  console.log(userResponse);

  res.json({ success: 'post call returned', url: req.url, itinerary: filteredMasterItinerary });

}

async function writeDynamo(tableName, items){
  var params = {
    TableName: tableName,
    Item: item,
  }

  let response = await dynamodbClient.put(params).promise().catch(error => {
    console.error('writeDynamo() ',error);
    return {isError: true, response: { failure: 'writeDynamo() returned with an error', error: error }};
  });
}


async function sendEmail(info) => {
  let { city, start, end, username, details } = info;
  var params = {
    Destination: { ToAddresses: ["recipient1@example.com", "recipient2@example.com"] },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `User: ${}
                 City: ${city}\nDates: ${start} - ${end}\nDetails: ${details}`
        }
      },
      Subject: { Charset: "UTF-8", Data: "Test email" }
    },
    Source: "odysseytech.llc@gmail.com",
  };

  return await ses.sendEmail(params).promise().catch((error) => console.log(error));
}

async function getUserFromCognitoToken(token, userPoolId) {
  var params = { AccessToken: token };
  await cognitoidentityserviceprovider.getUser(params).promise().catch((error) => {
    console.log(error);
  });
}


/*
let filterResults = (data, numberOfDays) => {
  //get user preferences

  // this needs to adapt to multi day trips.
  // filter results by what they like

  //return those results here
  return {idsOnly:[data[0].experience_id, data[1].experience_id, data[2].experience_id],
          allInfo:[data[0], data[1], data[2]]};
}

potential post handler
app.post('/itineraries/new', async function(req, res) {

  let { city, activitySlots, numberOfDays, dates: {startDate, endDate}} = req.body;
  let itinerary = {};

  let userId = req.requestContext.identity.cognitoIdentityId;
  console.log(req.requestContext);

  activitySlots = Array.from(activitySlots);

  // this will need to get pulled out into its own function when this gets more complex
  // when we do multi location trips or road trips we need to make this more robust
  // for now this is sufficient because we know that we will only be in NYC
  let itinerary = {};
  let filteredMasterItinerary = {};

  for (let slot of activitySlots) {
    if (!slot) continue;
    var params = {
      TableName: 'experiences',
      IndexName: 'city',
      KeyConditionExpression: 'city = :city and activity_slot = :act_slt',
      ExpressionAttributeValues: {
        ':city': {S: city},
        ':act_slt': {S: slot},
      },
    }

    let query = await dynamodb.query(params).promise().catch(error => {
      console.error(error);
      res.json({ failure: 'dynamodb call returned with an error', url: req.url, error: error });
    });

    console.debug('query returned: ', query.Count);

    let filteredResults = filterResults(query.Items, numberOfDays);

    filteredMasterItinerary[slot.toLowerCase()] = filteredResults.allInfo;
    itinerary[slot.toLowerCase()] = filteredResults.idsOnly;
  }

  itinerary.itinerary_id = uuidv4();
  itinerary.created_date = new Date().getTime();

  let writeItinerary = writeDynamo('itineraries', itinerary);
  if (writeItinerary.isError) res.json(writeItinerary.response);

  // send email to team


  // TODO: Make this only add the itinerary to the user. not rewrite it
  // let userWrite = writeItineraryToUser('users', itinerary.itinerary_id, userId, req, res);
  // if (userWrite.isError) res.json(userWrite.response);

  res.json({ success: 'post call returned', url: req.url, itinerary: filteredMasterItinerary });
});


async function writeItineraryToUser(tableName, itineraryId, userId, req, res){
  var params = {
    TableName: tableName,
    Key: {
      user_id: userId,
    },
    UpdateExpression: "SET #c = list_append(#c, :itd)",
    ExpressionAttributeNames: {
       "#c": "itineraries"
    },
    ExpressionAttributeValues: {
      ":itd": itineraryId,
    },
    Item: itineraryId,
  }

  let response = await dynamodbClient.put(params).promise().catch(error => {
    console.error('writeItineraryToUser()',error);
    return {isError: true, response: { failure: 'writeItineraryToUser() call returned with an error', url: req.url, error: error }};
  });
  console.log(response);
  return response;
}
*/
app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
