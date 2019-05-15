/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

// NOTE: This is where the first part of our algorithm will live.
//       Displaying content that a user will enjoy is part of our value proposition, and
//       this will return the content for the home page of the app. Including but not limited to:
//   1. Blog posts
//   2. Food Tours
//   3. Experiences

const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "experiences";
let indexName = 'type-featured-index';

function featuredQuery(type, cohort) {
  return {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: 'featured = :hkey AND #T = :rkey',
    ExpressionAttributeNames: { "#T": "type" },
    ExpressionAttributeValues: {
      ':rkey': type,
      ':hkey': cohort
    }
  }
}

function extractUserId(event) {
  let provider = event.requestContext.identity.cognitoAuthenticationProvider;
  provider = provider.split(':CognitoSignIn:');
  return provider[provider.length - 1];
}

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

const getFeaturedArticles = async (userId) => {
  let queryParams = featuredQuery('article', 'cohort_1');
  let something = await dynamodb.query(queryParams).promise();
  console.log('getFeaturedArticles', something);
  return something
}

const getFeaturedExperiences = async (userId) => {
  let queryParams = featuredQuery('experience', 'cohort_1');
  let something = await dynamodb.query(queryParams).promise();
  console.log('getFeaturedExperiences', something);
  return something
}

const getFeaturedCities = async (userId) => {
  let queryParams = featuredQuery('city', 'cohort_1');
  let something = await dynamodb.query(queryParams).promise();
  console.log('getFeaturedCities', something);
  return something
}

/**********************
 * Example get method *
 **********************/

app.get('/content', async function(req, res) {
  // Add your code here
  const userId = extractUserId(req.apiGateway.event);
  const articles = await getFeaturedArticles(userId);
  const experiences = await getFeaturedExperiences(userId);
  const cities = await getFeaturedCities(userId);

  const data = {
    articles: articles.Items,
    experiences: experiences.Items,
    cities: cities.Items,
  }

  console.log('/content returns:', data);

  res.json({
    success: `get ALL featured content call succeed for user ${userId}`,
    url: req.url,
    data: data,
  });
});

app.get('/content/cities', async function(req, res) {
  const userId = extractUserId(req.apiGateway.event);
  const cities = await getFeaturedCities(userId);
  console.log('/content/cities returns:', cities.Items);

  res.json({data: cities.Items, success: 'get featured CITIES call succeed!', url: req.url});
});

app.get('/content/cities/:experienceId', function(req, res) {
  // Add your code here
  res.json({success: `get featured cities call succeed for experience: ${req.params.experienceId}!`, url: req.url});
});

app.get('/content/articles', async function(req, res) {
  const userId = extractUserId(req.apiGateway.event);
  const articles = await getFeaturedArticles(userId);
  console.log('/content/articles returns:', articles.Items);

  res.json({data: articles.Items, success: 'get featured ARTICLES call succeed!', url: req.url});
});

app.get('/content/articles/:experienceId', function(req, res) {
  // Add your code here
  res.json({success: `get featured article for experience: ${req.params.experienceId} call succeed!`, url: req.url});
});

app.get('/content/experiences', async function(req, res) {
  const userId = extractUserId(req.apiGateway.event);
  const experiences = await getFeaturedExperiences(userId);
  console.log('/content/experiences returns:', experiences.Items);

  res.json({data: experiences.Items, success: 'get featured EXPERIENCES call succeed!', url: req.url});
});

app.get('/content/experiences/:experienceId', function(req, res) {
  // Add your code here
  res.json({success: `get featured experience for experience: ${req.params.experienceId} call succeed!`, url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/content', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/content/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example post method *
****************************/

app.put('/content', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/content/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/content', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/content/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
