/*
* IMPORTANT add Content-Type:application/json as headers to request

Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
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

let filterResults = (data, numberOfDays) => {
  //get user preferences


  // filter results by what they like

  //return those results here
  return {idsOnly:[data[0].experience_id, data[1].experience_id, data[2].experience_id],
          allInfo:[data[0], data[1], data[2]]};
}

app.post('/itineraries/new', async function(req, res) {

  let { city, activitySlots, numberOfDays} = req.body;

  activitySlots = Array.from(activitySlots);

  // this will need to get pulled out into its own function when this gets more complex
  // when we do multi location trips or road trips we need to make this more robust
  // for now this is sufficient because we know that we will only be in NYC
  let itinerary = {};
  filteredMasterItinerary = {};
  // Add your code here
  for (let slot of activitySlots) {

    if (!slot) continue;
    var params = {
      TableName: 'experiences',
      IndexName: 'city',
      KeyConditionExpression: 'city = :city and activity_slot = :act_slt',
      ExpressionAttributeValues: {
        ':city': {S: city},
        ':act_slt': {S: slot},
      }
    }

    let query = await dynamodb.query(params).promise().catch(error => {
      console.error(error);
      res.json({ failure: 'post call returned with an error', url: req.url, error: error });
    });
    console.debug('query returned: ', query.Count);
    let filteredResults = filterResults(query.Items, numberOfDays);
    filteredMasterItinerary[slot] = (filteredResults.allInfo);
    itinerary[slot] = filteredResults.idsOnly;
  }

  itinerary.itinerary_id = uuidv4();

  var params = {
    TableName: 'itineraries',
    Item: itinerary,
  }

  let response = await dynamodbClient.put(params).promise().catch(error => {
    console.error(error);
    res.json({ failure: 'post call returned with an error', url: req.url, error: error });
  });

  res.json({ success: 'post call returned', url: req.url, itinerary: filteredMasterItinerary });

});

app.post('/itineraries/new/*', function(req, res) {
  // Add your code here
  res.json({
    success: 'post call succeed!',
    url: req.url,
    body: req.body
  })
});

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
