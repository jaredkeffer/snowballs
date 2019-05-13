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
      cityId = (city) ? city.toLowerCase().replace(' ', '_') : id + 'cityExp',
      cacheId = `content-city-experiences-${cityId}`;

  if (refreshCache) await Cache.removeItem(cacheId);
  else cachedCityExperiences = await Cache.getItem(cacheId);

  if (cachedCityExperiences) {
    console.log('got from cache', cachedCityExperiences);
    return cachedCityExperiences;
  }

  // Create API path to call API GW
  let cityFeatuerdExperiences = `${path}/cities/${id}/experiences`;

  // get experience from dynamo
  console.debug('calling api ', cityFeatuerdExperiences);
  let response = await API.get(apiName, cityFeatuerdExperiences)
    .catch((error) => {
      console.warn('Error getting experience: ', id, error);
    });

  response = response[0];

  // Cache the response
  if (response) await Cache.setItem(cacheId, response, {priority: 4});

  // return response;
  return fakeExperiences;
}

/*
 * @param id {string} the experience id you're looking for
 * @param city {string} the city name you're looking for
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function getFeaturedExperiences(refreshCache) {
  let cachedFeaturedContent,
      cacheId = `featured-experiences`;

  if (refreshCache) await Cache.removeItem(cacheId);
  else cachedFeaturedContent = await Cache.getItem(cacheId);

  if (cachedFeaturedContent) {
    console.log('got from cache', cachedFeaturedContent);
    return cachedFeaturedContent;
  }
  let apiPath = `${path}/experiences`;

  // call api to get featured content
  console.debug('calling api', apiPath);
  let response = await API.get(apiName, apiPath)
    .catch((error) => {
      console.warn('Error getting featured experiences', error);
    });

  // Cache the response
  if (response.data) await Cache.setItem(cacheId, response.data, {priority: 5});

  return response.data;
}

/*
 * @param id {string} the experience id you're looking for
 * @param city {string} the city name you're looking for
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function getFeaturedContent(refreshCache) {
  let cachedFeaturedContent,
      cacheId = `featured-content`;

  if (refreshCache) await Cache.removeItem(cacheId);
  else cachedFeaturedContent = await Cache.getItem(cacheId);

  if (cachedFeaturedContent) {
    console.log('got from cache', cachedFeaturedContent);
    return cachedFeaturedContent;
  }

  console.debug('calling api', path);
  // call api to get featured content
  let response = await API.get(apiName, path)
    .catch((error) => {
      console.warn('Error getting featured content', error);
    });

  // Cache the response
  if (response.data) await Cache.setItem(cacheId, response.data, {priority: 5});

  return response.data;
}

const ExperiencesAPI = {
  getFeaturedExperiencesForCity,
  getFeaturedExperiences,
  getFeaturedContent,
};

export default ExperiencesAPI;
