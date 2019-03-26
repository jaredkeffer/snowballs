import { API, Analytics, Auth, Cache } from 'aws-amplify';

let apiName = 'users';
let path = '/users';

/*
 * Returns user information from Cognito or Cache
 */
async function getUser() {

  let user = await Cache.getItem('authUser');
  if (user) {
    console.debug('cached getUser():', user);
    return user;
  }

  console.debug('fetching user from Cognito');

  // Call cognito to get user
  let authUser = await Auth.currentAuthenticatedUser().catch((error) => {
    console.warn('Error getting Cognito User', error);
    return;
  });

  user = {...authUser.attributes, username:authUser.username};

  // Cache the relevant user info from cognito
  await Cache.setItem('authUser', user, {priority: 1});
  console.debug('getUser():', user);

  return user;
}

/*
 * @param userId {string}
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function getUserDetails(refreshCache) {
  let cachedUser;

  if (refreshCache) await Cache.removeItem('user');
  else cachedUser = await Cache.getItem('user');

  if (cachedUser) return cachedUser;

  // Get user_id from Cognito (primary key for dynamo table)
  console.debug('getUser for getUserDetails()');
  let authUser = await getUser();
  let sub = authUser.sub;
  console.debug('user sub: ', authUser.sub);

  // Create API path to call API GW
  let userPath = `${path}/${sub}`;

  // get user from dynamo
  console.debug('fetching user info from dynamo');
  let response = await API.get(apiName, userPath)
    .catch((error) => {
      console.warn('Error getting Dynamo User', error);
      return;
    });

  // Cache the response
  let cachingUser = await Cache.setItem('user', response, {priority: 2});

  console.debug(`getUserDetails(${sub}):`, response);
  return response;
}

/*
 * @param userId {string}
 * @param preferences {Map}
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function putUserDetails(userId, preferences) {
  let myInit = {
    body: {
      user_id: userId,
      preferences: {...preferences},
    },
    headers: {}
  };

  console.debug('myinit: ', myInit);

  let response = await API.put(apiName, path, myInit);
  return Cache.removeItem('user');
}

const UsersAPI = {
  getUser: getUser,
  getUserDetails: getUserDetails,
  putUserDetails: putUserDetails,
}

export default UsersAPI;
