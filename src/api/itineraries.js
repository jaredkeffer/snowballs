import { Auth, API, Analytics, Cache } from 'aws-amplify';
import UsersAPI from './users';
import { addQueryParamsToPath } from '../util/helper';

let apiName = 'itineraries';
let path = '/itineraries';

let buildPath = (sub, rangeKey) => {
  return path + ['/object', sub, rangeKey].join('/');
}

async function createNewItinerary(questionsAndAnswers) {
  let myInit = {
    body: {
      qAndA: { ...questionsAndAnswers },
    }
  };

  console.log('using path ', path, 'with request params ', myInit);

  let response = await API.post(apiName, path, myInit)
    .catch((error) => {
      console.error('Error creating itinerary: ', apiName, error);
    });
  return response;
}

async function approveItinerary(itinerary_id) {
  path = addQueryParamsToPath(path + '/approve', {itinerary_id})

  console.log('using path ', path);

  let response = await API.post(apiName, path, {})
    .catch((error) => {
      console.error('Error creating itinerary: ', apiName, error);
    });
  console.log('approve itinerary response', response);
  return response;
}

async function getItinerariesWithDetails(refreshCache) {
  let cachedItineraries;

  if (refreshCache) await Cache.removeItem('itineraries');
  else cachedItineraries = await Cache.getItem('itineraries');

  if (cachedItineraries) {
    console.log('return itineraries from cache');
    return cachedItineraries
  }

  console.debug('getting itineraries with details from dynamo');

  let user = await UsersAPI.getUser();
  let apiPath = `${path}/${user.sub}`;

  let response = await API.get(apiName, apiPath)
    .catch((error) => {
      console.warn('Error getting itineraries from dynamo', error);
      // TODO: need to handle network errors in catch statements
    });

  if (!response) return undefined;

  // Cache the response
  let cachingItineraries = await Cache.setItem('itineraries', response, {priority: 2});

  console.debug(`getItinerariesWithDetails() # items: ${response.length}`);
  return response;
}

const ItinerariesAPI = {
  getItinerariesWithDetails,
  createNewItinerary,
  approveItinerary,
}

export default ItinerariesAPI;
