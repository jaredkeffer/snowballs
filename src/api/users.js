import { API, Analytics, Auth, Cache } from 'aws-amplify';
import { DATA_TYPE } from '../constants/DataTypes';

let apiName = 'users';
let path = '/users';

/*
 * Returns user information from Cognito or Cache
 */
async function getUser(refreshCache) {
  let cachedUser;

  if (refreshCache) await Cache.removeItem('user');
  else cachedUser = await Cache.getItem('user');

  if (cachedUser) return cachedUser;

  console.debug('fetching user from Cognito');

  // Call cognito to get user
  let authUser = await Auth.currentAuthenticatedUser().catch((error) => {
    console.warn('Error getting Cognito User', error);
    return;
  });

  let { given_name, email, sub, phone_number } = authUser.attributes;
  let user = { given_name, email, sub, phone_number };

  console.log(user);

  // Cache the relevant user info from cognito
  await Cache.setItem('user', user, {priority: 1});
  console.debug('getUser():', user);

  return user;
}

/*
 * @param userId {string}
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function getUserPreferences(refreshCache) {
  let cachedUser;

  if (refreshCache) await Cache.removeItem('user.preferences');
  else cachedUser = await Cache.getItem('user.preferences');

  if (cachedUser) return cachedUser;

  // Get user_id from Cognito (primary key for dynamo table)
  console.debug('getUser for getUserPreferences()');
  let authUser = await getUser();
  let sub = authUser.sub;
  console.debug('user sub: ', sub);

  // Create API path to call API GW
  // let userPath = `${path}/${sub}`;
  let userPath = path + ['/object', sub, DATA_TYPE.PREFERENCES].join('/');

  // get user from dynamo
  console.debug('fetching user info from dynamo');
  let response = await API.get(apiName, userPath)
    .catch((error) => {
      console.warn('Error getting Dynamo User', error);
    });

  if (!response) return undefined;

  // Cache the response
  let cachingUser = await Cache.setItem('user.preferences', response, {priority: 2});

  console.debug(`getUserPreferences(${sub}):`, response);
  return response;
}

/*
 * @param userId {string}
 * @param preferences {Map}
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function putUserPreferences(userId, preferences) {
  let myInit = {
    body: {
      user_id: userId,
      data_type: DATA_TYPE.PREFERENCES,
      [DATA_TYPE.PREFERENCES]: {...preferences},
      last_updated: new Date().getTime(),
    },
    headers: {}
  };

  console.debug('myinit: ', myInit);

  let response = await API.put(apiName, path, myInit);
  console.log(response);
  return Cache.removeItem('user');
}

const users = {
  getUser,
  getUserPreferences,
  putUserPreferences,
}

export default users;
