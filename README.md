# odyssey
in the end, our experiences will be our ultimate possession

# Architecture
## Backend
### API
1. users API - CRUD for user information including preferences, demographics, etc. in DynamoDB
1. experiences API - (a) CRUD for experiences in DynamoDB with geo-hashing

### Auth
1. Cognito User things

### Lambda (function)
1. itineraryLambda -- called when a user wants to create a new itinerary
1. crudUsersLambda -- crud to DynamoDB for users
1. experiencesLambda -- crud to DynamoDB for experiences
1. experiencesGeoLambda -- enable geo-querying on experiences DynamoDB

### Storage
1. users -- DynamoDB table for user information
1. experiences -- DynamoDB table for experience information - will include GSI with geo-hash


## Frontend
1. `api/` -- API Gateway calls wrapper
1. `assets/` -- images, app icon, etc.
1. `components/` -- custom components and component wrappers used to construct screens
1. `constants/` -- a place to store constants e.g. colors
1. `navigation/` -- navigation in app (right now super simple)
1. `screens/` -- where the magic happens and it all comes together
1. `styles/` -- some generic styles that are used in multiple places
1. `util/` -- anything else needed to make the app run
