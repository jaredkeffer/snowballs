import ContentAPI from './content';
import ExperiencesAPI from './experiences';
import ItinerariesAPI from './itineraries';
import UsersAPI from './users';
import SystemAPI from './system';

const api =  {
  ...UsersAPI, ...ItinerariesAPI, ...ExperiencesAPI, ...ContentAPI, ...SystemAPI,
}

export default api;
