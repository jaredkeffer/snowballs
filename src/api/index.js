import UsersAPI from './users';
import ItinerariesAPI from './itineraries';
import ExperiencesAPI from './experiences';

const api =  {
  ...UsersAPI, ...ItinerariesAPI, ...ExperiencesAPI
}

export default api;
