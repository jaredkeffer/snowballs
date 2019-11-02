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
  let price = await API.get(apiName, pricePath);
  if (!!price) {
    price = price[0];
    const expiration = (new Date()).addHours(.05);
    await Cache.setItem(cacheId, price, { expires: expiration.getTime() });
  }
  console.log('got pricePerDay: ', price);
  return price.price;
}

/**
 * 
 * @param {String} promoCode a promo code to check against the backend
 * @param {Number} tripPrice the current trip price, can be used to see if a user qualifies for a discoutn etc.
 * @returns {*} {
 *   percentage: .9, // some % off 
 *   amount: 5, // something like a free day
 * }
 */
async function verifyPromoCode(promoCode, tripPrice) {
  console.log('verifying discount');
  const promoPath = `${path}/promo`
  let myInit = {
    body: { type: promoCode, tripPrice },
  };
  const response = await API.post(apiName, promoPath, myInit); 
  console.log('discount response: ', JSON.stringify(response, undefined, 2));
  return response;
}

const SystemAPI = {
  getItineraryPricePerDay,
  verifyPromoCode,
}

export default SystemAPI;
