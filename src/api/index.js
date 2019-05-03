import ContentAPI from './content';
import ExperiencesAPI from './experiences';
import ItinerariesAPI from './itineraries';
import UsersAPI from './users';

const api =  {
  ...UsersAPI, ...ItinerariesAPI, ...ExperiencesAPI, ...ContentAPI
}

export default api;
