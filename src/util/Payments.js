const XDate = require('xdate');
// TODO: getMetadata call here to get price
export const pricePerDay = 5;

// TODO: change to false when done developing
export const beta = true;

export function calculateTripLengthInDays(start, end) {
  let s = new XDate(start);
  let e = new XDate(end);

  return s.diffDays(e);
}

export function calculateDailyPrice(tripLengthDays) {
  return tripLengthDays * pricePerDay;
}

export function calculateTotalPrice(tripPrice, discounts) {
  if (Array.isArray(discounts)) {
    return tripPrice - discounts.reduce((a, b) => a + b, 0);
  }
  return tripPrice - discounts;
}

export function intToMoney(n){
  return String(n) + '.00';
}


// TODO: need to make several things happen
// 1. when you fail to pay for an itinerary fail the Process and start review over
// 2. write token to backend figure out order of this???
// 3. finish payment thing with stripe api
