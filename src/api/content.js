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
      cityId = (city) ? city.toLowerCase() : id + 'cityExp',
      cacheId = `content-city-experiences-${id}`;

  if (refreshCache) await Cache.removeItem(cacheId);
  else cachedCityExperiences = await Cache.getItem(cacheId);

  if (cachedCityExperiences) {
    console.log('got from cache', cachedCityExperiences);
    return cachedCityExperiences;
  }

  // Create API path to call API GW
  let cityFeatuerdExperiences = `${path}/experiences?type=city&city=${city}`;

  // get experience from dynamo
  console.debug('calling api ', cityFeatuerdExperiences);
  let response = await API.get(apiName, cityFeatuerdExperiences)
    .catch((error) => {
      console.warn('Error getting experience: ', id, error);
    });
  console.log(response.data);

  // Cache the response
  if (response.data) await Cache.setItem(cacheId, response.data, {priority: 4});

  return response.data;
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
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function getFeaturedContent(refreshCache) {
  console.debug('calling api', path);
  // call api to get featured content
  let response = await API.get(apiName, path)
    .catch((error) => {
      console.warn('Error getting featured content', error);
    });
  return response.data;
}

/*
 * @param id {string} the experience id you're looking for
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function getFeaturedArticles(refreshCache) {
  let cachedFeaturedContent,
      cacheId = `featured-articles`;

  if (refreshCache) await Cache.removeItem(cacheId);
  else cachedFeaturedContent = await Cache.getItem(cacheId);

  if (cachedFeaturedContent) {
    console.log('got from cache', cachedFeaturedContent);
    return cachedFeaturedContent;
  }
  const apiPath = `${path}/articles`
  console.debug('calling api', apiPath);
  // call api to get featured content
  let response = await API.get(apiName, apiPath)
    .catch((error) => {
      console.warn('Error getting featured articles', error);
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
async function getFeaturedCities(refreshCache) {
  let cachedFeaturedContent,
      cacheId = `featured-cities`;

  if (refreshCache) await Cache.removeItem(cacheId);
  else cachedFeaturedContent = await Cache.getItem(cacheId);

  if (cachedFeaturedContent) {
    console.log('got from cache', cachedFeaturedContent);
    return cachedFeaturedContent;
  }
  const apiPath = `${path}/cities`
  console.debug('calling api', apiPath);
  // call api to get featured content
  let response = await API.get(apiName, apiPath)
    .catch((error) => {
      console.warn('Error getting featured cities', error);
    });

  // Cache the response
  if (response.data) await Cache.setItem(cacheId, response.data, {priority: 5});

  return response.data;
}

const ExperiencesAPI = {
  getFeaturedExperiencesForCity,
  getFeaturedExperiences,
  getFeaturedArticles,
  getFeaturedContent,
  getFeaturedCities
};

export default ExperiencesAPI;
