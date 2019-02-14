import { Auth, API, Analytics, Cache } from 'aws-amplify';
import UsersAPI from './users';

let apiName = 'itineraries';
let path = '/itineraries';

/*
  @param {Date} startDate
  @param {Date} endDate
  @returns {*} itinerary object

  Note: We will eventually need to support multi city + travel time between them
  aka Em's Road trip idea

*/
async function getNewItinerary(start, end, city) {
  let newPath = `${path}/new`;

  // get current user token
  let user = await UsersAPI.getUser();

  // TODO: parse activity slots
  let activitySlots = ["Morning"];

  let myInit = {
    body:{
      email: user.email,
      sub: user.sub,
      city,
      activitySlots,
      start, end,
    }
  };

  let response = await API.post(apiName, newPath, myInit)
    .catch((error) => {
      console.error('Error getting experience: ', apiName, error);
    });
  console.log('post response', response);
}

const NewItineraryAPI = {
  getNewItinerary
}

export default NewItineraryAPI;
