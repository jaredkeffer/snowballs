import ContentAPI from './content';
import ExperiencesAPI from './experiences';
import ItinerariesAPI from './itineraries';
import UsersAPI from './users';
import SystemAPI from './system';
import MarketplaceAPI from './marketplace';

const api =  {
  ...UsersAPI, ...ItinerariesAPI, ...ExperiencesAPI, ...ContentAPI, ...SystemAPI, 
  // ...MarketplaceAPI,
}

export default api;
