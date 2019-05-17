import { Auth, API, Analytics, Cache } from 'aws-amplify';
import UsersAPI from './users';

let apiName = 'users';
let path = '/users/itineraries';

let buildPath = (sub, dataType) => {
  return path + ['/object', sub, dataType].join('/');
}

async function createNewItinerary(questionsAndAnswers) {

  // get current user token
  let user = await UsersAPI.getUser();
  path = buildPath(user.sub, 'itineraries');

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
