const XDate = require('xdate');
export const pricePerDay = 7;

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
  if (beta) return '.01';
  return String(n) + '.00';
}


// TODO: need to make several things happen
// 1. when you fail to pay for an itinerary fail the Process and start review over
// 2. write token to backend figure out order of this???
// 3. finish payment thing with stripe api
