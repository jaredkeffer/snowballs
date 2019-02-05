import { API, Analytics, Auth, Cache } from 'aws-amplify';

let apiName = 'experiences';
let path = '/experiences';

/*
 * @param id {string} the experience id you're looking for
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function getExperienceDetails(id, refreshCache) {
  let cachedExperience;

  if (refreshCache) Cache.removeItem(id);
  else cachedExperience = await Cache.getItem(id);

  if (cachedExperience) return cachedExperience;

  // Create API path to call API GW
  let experiencePath = `${path}/${id}`;

  // get experience from dynamo
  console.debug('fetching experience details from dynamo');
  let response = await API.get(apiName, experiencePath)
    .catch((error) => {
      console.error('Error getting experience: ', id, error);
    });

  // Cache the response
  // cachedExperience = await Cache.setItem(id, response, {priority: 4});

  console.debug(`getExperienceDetails(${id}):`, response);
  return response;
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
