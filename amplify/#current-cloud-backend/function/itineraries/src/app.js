/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
const AWS = require('aws-sdk');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
var bodyParser = require('body-parser');
var express = require('express');

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "itineraries";
let userTableName = 'users'
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const uuidv4 = require('uuid/v4');

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "user_id";
const partitionKeyType = "S";
const sortKeyName = "itinerary_id";
const userSortKeyName = "data_type";
const sortKeyType = "S";
const hasSortKey = sortKeyName !== "";
const path = "/itineraries";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

function extractUserId(event) {
  let provider = event.requestContext.identity.cognitoAuthenticationProvider;
  provider = provider.split(':CognitoSignIn:');
  return provider[provider.length - 1];
}

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path + hashKeyPath, function(req, res) {
  var condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType(req.params[partitionKeyName], partitionKeyType) ];
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let queryParams = {
    TableName: tableName,
    KeyConditions: condition
  }

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data) ;
      }
    }
  });
});


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, function(req, res) {
  console.log('req.apiGateway.event:');
  console.log(req.apiGateway.event);

  let user_id = extractUserId(req.apiGateway.event);
  console.log('got user id: ', user_id);
  let itinerary_id = uuidv4();
  console.log('new itinerary id: ', itinerary_id);

  let putItemParams = {
    TableName: tableName,
    Item: {
      itinerary_id,
      user_id,
      created_timestamp: (new Date()).getTime(),
      ...req.body,
    },
  };

  let params = {
    TableName: userTableName,
    Key: {
      [partitionKeyName]: user_id,
      [userSortKeyName]: 'preferences',
    },
    UpdateExpression: "SET #c = list_append(if_not_exists(#c, :empty_list), :vals)",
    ExpressionAttributeNames: {
       "#c": "itineraries",
    },
    ExpressionAttributeValues: {
      ":vals": [itinerary_id],
      ":empty_list": [],
    },
    ReturnValues: "UPDATED_NEW"
  };

  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      console.error(err);
      res.json({error: err, url: req.url, body: req.body});
    } else {
      dynamodb.update(params, (err, data) => {
        if(err) {
          console.error(err);
          console.log('cleaning up itinerary in itineraries dynamodb');
          dynamodb.delete(params, (error1, data) => {
            if (error1) console.error(error1);
            res.json({error: 'could not save itinerary in users: ' + err.message});
          })
        } else {
          if (data.Item) {
            console.log('success data.Item: ', data.Item);
            res.json(data.Item);
          } else {
            console.log('success data: ', data);
            res.json(data);
          }
        }
      });
    }
  });
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'post call succeed!', url: req.url, data: data})
    }
  });
});

app.post(path + '/status', function(req, res) {
  const userId = extractUserId(req.apiGateway.event);
  console.log('Started: ', path + '/status', ' request for user: ', userId);

  // TODO: update last edited param and others as well
  let params = {
    TableName: tableName,
    Key: {
      [partitionKeyName]: userId,
      [sortKeyName]: req.body.itinerary_id,
    },
    UpdateExpression: "SET #c = :val",
    ExpressionAttributeNames: {
       "#c": "status",
    },
    ExpressionAttributeValues: {
      ":val": req.body.status,
    },
    ReturnValues: "UPDATED_NEW"
  };

  dynamodb.update(params, (err, data) => {
    if(err) {
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'approval call succeed!', url: req.url, data: data})
    }
  });
});

app.post(path + '/feedback', function(req, res) {
  const userId = extractUserId(req.apiGateway.event);
  console.log('Started: ', path + '/feedback', ' request for user: ', userId);

  if (!req.body.feedback.timestamp) {
    let now = (new Date()).getTime();
    req.body.feedback.timestamp = now;
  }
  // TODO: update last edited param and others as well
  let params = {
    TableName: tableName,
    Key: {
      [partitionKeyName]: userId,
      [sortKeyName]: req.body.itinerary_id,
    },
    UpdateExpression: "SET #c = list_append(if_not_exists(#c, :empty_list), :vals)",
    ExpressionAttributeNames: {
       "#c": "feedback",
    },
    ExpressionAttributeValues: {
      ":vals": [req.body.feedback],
      ":empty_list": [],
    },
    ReturnValues: "UPDATED_NEW"
  };

  dynamodb.update(params, (err, data) => {
    if(err) {
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'approval call succeed!', url: req.url, data: data})
    }
  });
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
     try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }
  dynamodb.delete(removeItemParams, (err, data)=> {
    if(err) {
      res.json({error: err, url: req.url});
    } else {
      res.json({url: req.url, data: data});
    }
  });
});
app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
