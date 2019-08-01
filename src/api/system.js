import { API, Analytics, Auth, Cache } from 'aws-amplify';

let apiName = 'system';
let path = '/v1/system';

Date.prototype.addHours = function(m) {
   this.setTime(this.getTime() + (m*60*1000));
   return this;
}

async function getItineraryPricePerDay(refreshCache) {
  let cachedPrice;
  const cacheId = 'pricePerDay';
  console.log('starting getItineraryPricePerDay()');

  if (refreshCache) await Cache.removeItem(cacheId);
  else cachedPrice = await Cache.getItem(cacheId);

  if (cachedPrice) {
    console.log('got itinerary price from cache', cachedPrice);
    return cachedPrice;
  }

  console.log('fetching pricePerDay from dynamo');
  let pricePath = `${path}/price_per_day`;
  let price = await API.get(apiName, pricePath).catch(err => console.error(err));
  if (!!price) {
    price = price[0];
    const expiration = (new Date()).addHours(1);
    await Cache.setItem(cacheId, price.price, { expires: expiration.getTime() });
  }
  console.log('got pricePerDay: ', price);
  return price.price;
}

const SystemAPI = {
  getItineraryPricePerDay
}

export default SystemAPI;
