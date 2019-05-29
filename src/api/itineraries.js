import { Auth, API, Analytics, Cache } from 'aws-amplify';
import UsersAPI from './users';

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

async function approveItinerary(id) {
  let apiPath = path + '/status'

  console.log(`using path ${apiPath}`);
  let myInit = {
    body: {
      itinerary_id: id,
      status: 'Approved',
    }
  };

  let response = await API.post(apiName, apiPath, myInit)
    .catch((error) => {
      console.error('Error creating itinerary: ', error);
    });
  console.log('approve itinerary response', response);
  return response;
}

async function getItinerary(refreshCache, itineraryId) {
  let cachedItinerary;

  if (refreshCache) await Cache.removeItem(itineraryId);
  else cachedItinerary = await Cache.getItem(itineraryId);

  if (cachedItinerary) {
    console.log('return itineraries from cache');
    return cachedItinerary
  }

  let user = await UsersAPI.getUser();
  let apiPath = buildPath(user.sub, itineraryId);

  console.debug('getting itinerary with details from dynamo ', itineraryId, ' with path: ', apiPath);

  let response = await API.get(apiName, apiPath)
    .catch((error) => {
      console.warn('Error getting itinerary from dynamo', error);
      // TODO: need to handle network errors in catch statements
    });

  if (!response) return undefined;

  // Cache the response
  let cachingItineraries = await Cache.setItem(itineraryId, response, {priority: 2});

  console.debug(`getItinerary()`, response);
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

async function submitItineraryFeedback(itineraryId, feedback) {
  let user = await UsersAPI.getUser();
  let apiPath = path + '/feedback'

  let myInit = {
    body: {
      itinerary_id: itineraryId,
      feedback: feedback,
    }
  };

  console.log('submitItineraryFeedback using path ', apiPath, 'with request params ', myInit);

  let response = await API.post(apiName, apiPath, myInit)
    .catch((error) => {
      console.warn('Error setting feedback', error);
    });
  return response;
}

const ItinerariesAPI = {
  getItinerary,
  getItinerariesWithDetails,
  createNewItinerary,
  approveItinerary,
  submitItineraryFeedback,
}

export default ItinerariesAPI;
