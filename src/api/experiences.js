import { API, Analytics, Cache } from 'aws-amplify';

const apiName = 'experiences';
const path = '/experiences';

Date.prototype.addHours = function(h) {
   this.setTime(this.getTime() + (h*60*60*1000));
   return this;
}

const itineraryQuestionsId = 'itinerary-questions-id';
const preferenceQuestionsId = 'preference-questions-id';

async function getItineraryQuestions() {
  const expiration = (new Date()).addHours(8);
  const response = await getExperienceDetails(itineraryQuestionsId, false, { expires: expiration.getTime() });
  return response.questions;
}

async function getPreferenceQuestions() {
  const expiration = (new Date()).addHours(8);
  const response = await getExperienceDetails(preferenceQuestionsId, false, { expires: expiration.getTime() });
  return response.questions;
}

/*
 * @param id {string} the experience id you're looking for
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function getExperienceDetails(id, refreshCache, expires) {
  let cachedExperience,
      cacheId = `experience-${id}`;

  if (refreshCache) await Cache.removeItem(cacheId);
  else cachedExperience = await Cache.getItem(cacheId);

  if (cachedExperience) {
    console.log('got from cache', cachedExperience);
    return cachedExperience;
  }

  // Create API path to call API GW
  let experiencePath = `${path}/${id}`;

  // get experience from dynamo
  console.debug('fetching experience details from dynamo');
  let response = await API.get(apiName, experiencePath)
    .catch((error) => {
      console.warn('Error getting experience: ', id, error);
    });

  response = response[0];
  // Cache the response
  let expiration = expires || {priority: 4};
  if (response) await Cache.setItem(cacheId, response, expiration);

  // console.debug(`getExperienceDetails(${id}):`, response);
  return response;
}

/*
 * @param id {string}
 * @param preferences {Map}
 * @returns {*} response from Lambda (aka Dynamo)
 */
// async function putExperienceDetails(id, details) {
//   let myInit = {
//     body: {
//       experience_id: id,
//       ...details,
//     },
//     headers: {}
//   };
//
//   console.log('myinit: ', myInit);
//
//   let response = await API.put(apiName, path, myInit);
//   return Cache.setItem(id, myInit.body, {priority: 5});
// }

const ExperiencesAPI = {
  getExperienceDetails,
  getItineraryQuestions,
  getPreferenceQuestions,
  // putExperienceDetails: putExperienceDetails,
};

export default ExperiencesAPI;
