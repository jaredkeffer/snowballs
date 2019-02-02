# Odyssey
In the end, our experiences will be our ultimate possession

## Architecture
### Backend
#### API
1. `/users` - CRUD for user information including preferences, demographics, etc. in DynamoDB
1. `/experiences` - (a) CRUD for experiences in DynamoDB
1. `/experiences/geo` - (a) experiences search using geo-hashing (later ordering by preferences)
1. `/itineraries` - (a) CRUD for itineraries in DynamoDB with geo-hashing
1. `/itineraries/new` - create a new itinerary based on parameters

#### Auth
1. Cognito User things

#### Lambda (function)
1. users -- crud to DynamoDB for users
1. experiences -- crud to DynamoDB for experiences
1. experiencesGeo -- enable geo-querying on experiences DynamoDB
1. itineraries -- crud to DynamoDB for itineraries
1. itinerariesNew -- enables user to create a new itinerary

#### Storage
1. users -- DynamoDB table for user information
1. experiences -- DynamoDB table for experience information - will include GSI with geo-hash
1. itineraries -- DynamoDB table for itineraries information


#### Frontend
1. `api/` -- API Gateway calls wrapper
1. `assets/` -- images, app icon, etc.
1. `components/` -- custom components and component wrappers used to construct screens
1. `constants/` -- a place to store constants e.g. colors
1. `navigation/` -- navigation in app (right now super simple)
1. `screens/` -- where the magic happens and it all comes together
1. `styles/` -- some generic styles that are used in multiple places
1. `util/` -- anything else needed to make the app run


### Amplify Resources
| Category | Resource name  |
| -------- | -------------- |
| Auth     | users          |
| Storage  | users          |
| Storage  | experiences    |
| Storage  | itineraries    |
| Function | users          |
| Function | experiences    |
| Function | experiencesGeo |
| Function | itineraries    |
| Function | itinerariesNew |
| Api      | users          |
| Api      | experiences    |
| Api      | itineraries    |
