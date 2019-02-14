// add me to new itin request
// function calcNumberOfDays(startDate, endDate) {
//   const oneDay = 24*60*60*1000;
//   let numDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
//   return (numDays) ? numDays : 1;
// }

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
