import { API, Analytics, Auth, Cache } from 'aws-amplify';

let apiName = 'crudUsersAPI';
let path = '/users';

/*
 * Returns user information from Cognito or Cache
 */
async function getUser() {

  let user = await Cache.getItem('authUser');
  if (user) return user;

  console.log('fetching user from Cognito');

  // Call cognito to get user
  let authUser = await Auth.currentAuthenticatedUser().catch((error) => {
    console.error('Error getting Cognito User', error);
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
async function getUserInfo(refreshCache) {
  let cachedUser;

  if (refreshCache) Cache.removeItem('user');
  else cachedUser = await Cache.getItem('user');

  if (cachedUser) return cachedUser;

  // Get user_id from Cognito (primary key for dynamo table)
  console.debug('getUser()');
  let authUser = await getUser();
  let sub = authUser.sub;
  console.debug('user sub: ', authUser.sub);

  // Create API path to call API GW
  let userPath = `/users/${sub}`;

  // get user from dynamo
  let response = await API.get(apiName, userPath)
    .catch((error) => {
      console.error('Error getting Dynamo User', error);
    });

  // Cache the response
  let cachingUser = await Cache.setItem('user', response, {priority: 4});

  console.debug(`getUserInfo(${sub}):`, response);
  return response;
}

/*
 * @param userId {string}
 * @param preferences {Map}
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function putUserInfo(userId, preferences) {
  let myInit = {
    body: {
      user_id: userId,
      preferences: {...preferences},
    },
    headers: {}
  };

  console.log('myinit: ', myInit);

  let response = await API.put(apiName, path, myInit);
  return Cache.removeItem('user');
}

const UserAPI = {
  getUser: getUser,
  getUserInfo: getUserInfo,
  putUserInfo: putUserInfo,
}

export default UserAPI;
