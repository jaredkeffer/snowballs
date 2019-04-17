import { API, Analytics, Cache } from 'aws-amplify';

let apiName = 'experiences';
let path = '/experiences';

/*
 * @param id {string} the experience id you're looking for
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function getExperienceDetails(id, refreshCache) {
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

  // Cache the response
  if (response) await Cache.setItem(cacheId, response[0], {priority: 4});

  // console.debug(`getExperienceDetails(${id}):`, response);
  return response[0];
}

/*
 * @param id {string}
 * @param preferences {Map}
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function putExperienceDetails(id, details) {
  let myInit = {
    body: {
      experience_id: id,
      ...details,
    },
    headers: {}
  };

  console.log('myinit: ', myInit);

  let response = await API.put(apiName, path, myInit);
  return Cache.setItem(id, myInit.body, {priority: 5});
}

const ExperiencesAPI = {
  getExperienceDetails: getExperienceDetails,
  putExperienceDetails: putExperienceDetails,
}

export default ExperiencesAPI;
