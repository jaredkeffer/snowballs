import { Auth, API, Analytics, Cache } from 'aws-amplify';
import UsersAPI from './users';

let apiName = 'users';
let path = '/users/itineraries';

async function createNewItinerary(questionsAndAnswers) {

  // get current user token
  let user = await UsersAPI.getUser();

  let myInit = {
    body: { ...questionsAndAnswers }
  };

  console.log('got user', user, 'using path', path, 'with request params ', myInit);

  let response = await API.post(apiName, path, myInit)
    .catch((error) => {
      console.error('Error creating itinerary: ', apiName, error);
    });
  console.log('create itinerary response', response);
  return response;
}

const ItinerariesAPI = {
  createNewItinerary
}

export default ItinerariesAPI;
