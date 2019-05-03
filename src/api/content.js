import { API, Analytics, Cache } from 'aws-amplify';

let apiName = 'content';
let path = '/content';

/*
 * @param id {string} the experience id you're looking for
 * @param city {string} the city name you're looking for
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function getFeaturedExperiencesForCity(id, city, refreshCache) {
  let cachedCityExperiences,
      cityId = city.toLowerCase().replace(' ', '-'),
      cacheId = `content-city-experiences-${cityId}`;

  if (refreshCache) await Cache.removeItem(cacheId);
  else cachedCityExperiences = await Cache.getItem(cacheId);

  if (cachedCityExperiences) {
    console.log('got from cache', cachedCityExperiences);
    return cachedCityExperiences;
  }

  // Create API path to call API GW
  let cityFeatuerdExperiences = `${path}/city/${cityId}/experiences`;

  // get experience from dynamo
  console.debug('fetching experience details from dynamo');
  let response = await API.get(apiName, cityFeatuerdExperiences)
    .catch((error) => {
      console.warn('Error getting experience: ', id, error);
    });

  response = response[0];

  // Cache the response
  if (response) await Cache.setItem(cacheId, response, {priority: 4});

  // console.debug(`getExperienceDetails(${id}):`, response);
  return response;
}

const ExperiencesAPI = {
  getFeaturedExperiencesForCity: getFeaturedExperiencesForCity,
}

export default ExperiencesAPI;
