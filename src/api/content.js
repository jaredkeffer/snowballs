import { API, Analytics, Cache } from 'aws-amplify';

let apiName = 'content';
let path = '/content';
const fakeFeaturedContent = {
  articles: [
    {
      "activity_slot": "n/a",
      "city": "New York City",
      "description": "...like life, this food tour is a marathon not a sprint. But in the off chance you do sprint marathons, or don’t, make sure to remember the golden rules of food tours",
      "details": {
        "duration": {
          "end": "3:30pm",
          "start": "9:30am"
        },
        "location": {
          "end": "Chelsea",
          "start": "East Village"
        }
      },
      "experience_id": "test-featured-article-1",
      "featured": true,
      "img": "https://images.unsplash.com/photo-1507961455425-0caef37ef6fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
      "overview": [
        "As our inaugural post, the team here at Odyssey would like to take a minute to explain what an Unofficial Food Tour is. An Unofficial Food Tour quite simply is our imagination of how a half day food tour of a city should play out. Food is such an integral yet personal part of every travel experience, so we thought it would be helpful to create a guide that gives any traveler a sense of what the food is like in a city, as well as the best places to go. Use this food tour as a source of inspiration, as a guide on some of our favorite in the moment places, or a full-fledged itinerary on how to spend a half day in New York.  Whatever you do just keep in mind, that every Unofficial Food Tour guide is made with you, your stomach, and a full day of fun in mind.  Keep an open mind, safe travels, and never stop exploring.",
        "So much food, so little time. Let’s get right into it. Here’s our Unofficial Food Tour of New York City.",
        "The one thing that we want to remind you of throughout this food tour, is that like life, this food tour is a marathon not a sprint. But in the off chance you do sprint marathons, or don’t, make sure to remember the golden rules of food tours: 1) Sharing is caring 2) Split the food, split the check 3) Nothing new? No fun for you 4) Walk it Off."
      ],
      "steps": [
        {
          "address": "120 Essex St.",
          "location": "Shopsin’s",
          "text": "Part of the reason you come to New York is for everything it has to offer, the same can be said about Shopsin’s. With 900 items on the menu, you’re bound to find something you’re going to love. Just remember, as a start to the day – don’t over do it! We recommend the slutty pancakes, yes, you heard us right slutty pancakes. (P.S – You’re in the Lower East Side, AKA the post-college nightlife center of NY. This area is completely different at night, and never not a good time).",
          "title": "Breakfast",
        },
        {
          "address": "120 Rivington St.",
          "location": "Supermoon Bakehouse",
          "text": "Second breakfast is basically religion on Unofficial Food Tours, and Supermoon Bakehouse, or just Bakehouse is one of the best bakeries in New York. These guys and gals serve up some the most original, tasty, inventive baked goods we’ve ever come across. Exhibit A, as of our posting this article, they’re currently whipping up a HOT APPLE PIE TWICE-BAKED CROISSSANT. DO YOU LOVE, OR DO YOU LOVE? Go be a weirdough at Bakehouse, you won’t regret it.",
          "title": "Second Breakfast"
        },
        {
          "address": "176 1st Avenue",
          "location": "Black Seed Bagel",
          "text": "Black Seed Bagel is a spot in the East Village that will make you truly question the quality of your local bagel shop back home. If New York had a food mascot it would probably be a bagel, and Black Seed Bagel’s bagels hang with the best of them. Our take? Get the B.E.C, it’s the best hangover cure this side of the Mississippi. Or so we’ve heard.",
          "title": "Third Breakfast"
        },
        {
          "address": "189 Spring Street",
          "location": "Dominique Ansel Bakery",
          "text": "Ever heard of the Cronut? Yep, started here. Stop by this bakery to 1) Kill some time 2) Stuff your face. If it’s nice out, head to the patio in the back to get some fresh air. Fair warning though, the cronuts are notorious for selling out before noon. Keep that in mind as you’re pacing yourself throughout this tour.",
          "title": "SNACK TIME"
        },
        {
          "address": "75 9th Ave",
          "location": "Chelsea Market",
          "text": "Still sharing? Still caring? We hope so. You’re more than halfway through the day and we’ve only now made it to the West side of the city. Chelsea Market may be the pinnacle of urban food halls, but don’t get intimidated once you’re there.  A couple of our favorites are: Los Tacos No. 1 (Great for sharing), Dougnuttery (For those of you who didn’t get enough sweets at Dominique Ansel Bakery), and Num Pang (Fantastic Banh Mi’s)",
          "title": "Pre – Lunch"
        },
        {
          "text": "How’s that food baby looking? Are we at Easter Brunch, Christmas Dinner, or full on Thanksgiving? No matter where that food baby is at, we’re invoking Article 4 of the Unofficial Food Tour: Walk it Off. Lucky for you, you’re in Chelsea and you’ve got options feel free to walk around the area in general, The Highline which is right above Chelsea Market, or step into The Whitney and get your NYU undergrad art student on.",
          "title": "Break"
        },
        {
          "address": "232 8th Ave",
          "location": "Momofuku Nishi",
          "text": "Two of the major benefits of New York, we think, are the city’s density and diversity. The combination of contrasts that consistently create the unexpected, help us justify living in this rude, overpriced, yet wonderfully devilish jungle masking as a city. Momofuku Nishi is one of those curious combinations endemic to New York, and by extension a reason why we love New York.",
          "title": "Real Lunch"
        },
        {
          "address": "152 W 10th Street",
          "location": "Van Leuween’s",
          "text": "And that’s a wrap, 10,000 steps and roughly 10,000 calories later. You’ve done it. You’ve completed the Unofficial Food Tour of NYC. You’ve already made it this far, so might as well get the icing on the top. Literally. See you next time",
          "title": "Way Too Early Dessert"
        }
      ],
      "title": "Unofficial Food Tour",
      "type": "article"
    },
    {
      "activity_slot": "n/a",
      "city": "New York City",
      "description": "...like life, this food tour is a marathon not a sprint. But in the off chance you do sprint marathons, or don’t, make sure to remember the golden rules of food tours",
      "details": {
        "duration": {
          "end": "3:30pm",
          "start": "9:30am"
        },
        "location": {
          "end": "Chelsea",
          "start": "East Village"
        }
      },
      "experience_id": "test-featured-article-1",
      "featured": true,
      "img": "https://www.tours-italy.com/application/files/cache/319f9463c2e5b582dc9f00ac7a50b5d2.jpg",
      "overview": [
        "As our inaugural post, the team here at Odyssey would like to take a minute to explain what an Unofficial Food Tour is. An Unofficial Food Tour quite simply is our imagination of how a half day food tour of a city should play out. Food is such an integral yet personal part of every travel experience, so we thought it would be helpful to create a guide that gives any traveler a sense of what the food is like in a city, as well as the best places to go. Use this food tour as a source of inspiration, as a guide on some of our favorite in the moment places, or a full-fledged itinerary on how to spend a half day in New York.  Whatever you do just keep in mind, that every Unofficial Food Tour guide is made with you, your stomach, and a full day of fun in mind.  Keep an open mind, safe travels, and never stop exploring.",
        "So much food, so little time. Let’s get right into it. Here’s our Unofficial Food Tour of New York City.",
        "The one thing that we want to remind you of throughout this food tour, is that like life, this food tour is a marathon not a sprint. But in the off chance you do sprint marathons, or don’t, make sure to remember the golden rules of food tours: 1) Sharing is caring 2) Split the food, split the check 3) Nothing new? No fun for you 4) Walk it Off."
      ],
      "steps": [
        {
          "address": "120 Essex St.",
          "location": "Shopsin’s",
          "text": "Part of the reason you come to New York is for everything it has to offer, the same can be said about Shopsin’s. With 900 items on the menu, you’re bound to find something you’re going to love. Just remember, as a start to the day – don’t over do it! We recommend the slutty pancakes, yes, you heard us right slutty pancakes. (P.S – You’re in the Lower East Side, AKA the post-college nightlife center of NY. This area is completely different at night, and never not a good time).",
          "title": "Breakfast"
        },
        {
          "address": "120 Rivington St.",
          "location": "Supermoon Bakehouse",
          "text": "Second breakfast is basically religion on Unofficial Food Tours, and Supermoon Bakehouse, or just Bakehouse is one of the best bakeries in New York. These guys and gals serve up some the most original, tasty, inventive baked goods we’ve ever come across. Exhibit A, as of our posting this article, they’re currently whipping up a HOT APPLE PIE TWICE-BAKED CROISSSANT. DO YOU LOVE, OR DO YOU LOVE? Go be a weirdough at Bakehouse, you won’t regret it.",
          "title": "Second Breakfast"
        },
        {
          "address": "176 1st Avenue",
          "location": "Black Seed Bagel",
          "text": "Black Seed Bagel is a spot in the East Village that will make you truly question the quality of your local bagel shop back home. If New York had a food mascot it would probably be a bagel, and Black Seed Bagel’s bagels hang with the best of them. Our take? Get the B.E.C, it’s the best hangover cure this side of the Mississippi. Or so we’ve heard.",
          "title": "Third Breakfast"
        },
        {
          "address": "189 Spring Street",
          "location": "Dominique Ansel Bakery",
          "text": "Ever heard of the Cronut? Yep, started here. Stop by this bakery to 1) Kill some time 2) Stuff your face. If it’s nice out, head to the patio in the back to get some fresh air. Fair warning though, the cronuts are notorious for selling out before noon. Keep that in mind as you’re pacing yourself throughout this tour.",
          "title": "SNACK TIME"
        },
        {
          "address": "75 9th Ave",
          "location": "Chelsea Market",
          "text": "Still sharing? Still caring? We hope so. You’re more than halfway through the day and we’ve only now made it to the West side of the city. Chelsea Market may be the pinnacle of urban food halls, but don’t get intimidated once you’re there.  A couple of our favorites are: Los Tacos No. 1 (Great for sharing), Dougnuttery (For those of you who didn’t get enough sweets at Dominique Ansel Bakery), and Num Pang (Fantastic Banh Mi’s)",
          "title": "Pre – Lunch"
        },
        {
          "text": "How’s that food baby looking? Are we at Easter Brunch, Christmas Dinner, or full on Thanksgiving? No matter where that food baby is at, we’re invoking Article 4 of the Unofficial Food Tour: Walk it Off. Lucky for you, you’re in Chelsea and you’ve got options feel free to walk around the area in general, The Highline which is right above Chelsea Market, or step into The Whitney and get your NYU undergrad art student on.",
          "title": "Break"
        },
        {
          "address": "232 8th Ave",
          "location": "Momofuku Nishi",
          "text": "Two of the major benefits of New York, we think, are the city’s density and diversity. The combination of contrasts that consistently create the unexpected, help us justify living in this rude, overpriced, yet wonderfully devilish jungle masking as a city. Momofuku Nishi is one of those curious combinations endemic to New York, and by extension a reason why we love New York.",
          "title": "Real Lunch"
        },
        {
          "address": "152 W 10th Street",
          "location": "Van Leuween’s",
          "text": "And that’s a wrap, 10,000 steps and roughly 10,000 calories later. You’ve done it. You’ve completed the Unofficial Food Tour of NYC. You’ve already made it this far, so might as well get the icing on the top. Literally. See you next time",
          "title": "Way Too Early Dessert"
        }
      ],
      "title": "Unofficial Food Tour",
      "type": "article"
    },
    // {subtitle: 'This is a subtitle for the ages about this city', title:'Venice, Italy', key:'15', source:'https://www.tours-italy.com/application/files/cache/319f9463c2e5b582dc9f00ac7a50b5d2.jpg'},
    // {subtitle: 'This is a subtitle about this city aka Venice, Italy', title:'Tokyo, Japan', key:'13', source:'https://cdn.cnn.com/cnnnext/dam/assets/170606110126-tokyo-skyline.jpg'},
    // {subtitle: 'This is an unbelievably simple and great subtitle for the ages about this city', title:'San Francisco, CA', key:'14', source:'https://www.sftravel.com/sites/sftraveldev.prod.acquia-sites.com/files/SanFrancisco_0.jpg'},
    // {subtitle: 'This is an unbelievably simple and great subtitle for the ages about this city', title:'New York City, NY', key:'1', source:'https://cdn.shopify.com/s/files/1/1629/2509/products/1304_NYC_Skyline_2048x@2x.jpg?v=1488902880'},
  ],
  cities: [
    {
      subtitle: 'This is an unbelievably simple and great subtitle for the ages about this city, This is an unbelievably simple and great subtitle for the ages about this city',
      city:'Some Mountains',
      country: 'USA',
      key:'111233',
      img:'https://images.unsplash.com/photo-1555985202-12975b0235dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1049&q=80',
      experience_id: 'qwerASDFasdf',
      overview: [
        'Part of the reason you come to New York is for everything it has to offer, the same can be said about Shopsin’s. With 900 items on the menu, you’re bound to find something you’re going to love. Just remember, as a start to the day – don’t over do it! We recommend the slutty pancakes, yes, you heard us right slutty pancakes. (P.S – You’re in the Lower East Side, AKA the post-college nightlife center of NY. This area is completely different at night, and never not a good time).',
        'Second breakfast is basically religion on Unofficial Food Tours, and Supermoon Bakehouse, or just Bakehouse is one of the best bakeries in New York. These guys and gals serve up some the most original, tasty, inventive baked goods we’ve ever come across. Exhibit A, as of our posting this article, they’re currently whipping up a HOT APPLE PIE TWICE-BAKED CROISSSANT. DO YOU LOVE, OR DO YOU LOVE? Go be a weirdough at Bakehouse, you won’t regret it.',
        'Still sharing? Still caring? We hope so. You’re more than halfway through the day and we’ve only now made it to the West side of the city. Chelsea Market may be the pinnacle of urban food halls, but don’t get intimidated once you’re there.  A couple of our favorites are: Los Tacos No. 1 (Great for sharing), Dougnuttery (For those of you who didn’t get enough sweets at Dominique Ansel Bakery), and Num Pang (Fantastic Banh Mi’s)',
        'Part of the reason you come to New York is for everything it has to offer, the same can be said about Shopsin’s. With 900 items on the menu, you’re bound to find something you’re going to love. Just remember, as a start to the day – don’t over do it! We recommend the slutty pancakes, yes, you heard us right slutty pancakes. (P.S – You’re in the Lower East Side, AKA the post-college nightlife center of NY. This area is completely different at night, and never not a good time).',
        'Second breakfast is basically religion on Unofficial Food Tours, and Supermoon Bakehouse, or just Bakehouse is one of the best bakeries in New York. These guys and gals serve up some the most original, tasty, inventive baked goods we’ve ever come across. Exhibit A, as of our posting this article, they’re currently whipping up a HOT APPLE PIE TWICE-BAKED CROISSSANT. DO YOU LOVE, OR DO YOU LOVE? Go be a weirdough at Bakehouse, you won’t regret it.',
        'Still sharing? Still caring? We hope so. You’re more than halfway through the day and we’ve only now made it to the West side of the city. Chelsea Market may be the pinnacle of urban food halls, but don’t get intimidated once you’re there.  A couple of our favorites are: Los Tacos No. 1 (Great for sharing), Dougnuttery (For those of you who didn’t get enough sweets at Dominique Ansel Bakery), and Num Pang (Fantastic Banh Mi’s)',
      ]
    }, {
      subtitle: 'This is an unbelievably simple and great subtitle for the ages about this city, This is an unbelievably simple and great subtitle for the ages about this city',
      city: 'Tokyo',
      country: 'Japan',
      key:'113',
      img:'https://cdn.cnn.com/cnnnext/dam/assets/170606110126-tokyo-skyline.jpg',
      experience_id: 'asdf',
      overview: 'Second breakfast is basically religion on Unofficial Food Tours, and Supermoon Bakehouse, or just Bakehouse is one of the best bakeries in New York. These guys and gals serve up some the most original, tasty, inventive baked goods we’ve ever come across. Exhibit A, as of our posting this article, they’re currently whipping up a HOT APPLE PIE TWICE-BAKED CROISSSANT. DO YOU LOVE, OR DO YOU LOVE? Go be a weirdough at Bakehouse, you won’t regret it.'+
        'Part of the reason you come to New York is for everything it has to offer, the same can be said about Shopsin’s. With 900 items on the menu, you’re bound to find something you’re going to love. Just remember, as a start to the day – don’t over do it! We recommend the slutty pancakes, yes, you heard us right slutty pancakes. (P.S – You’re in the Lower East Side, AKA the post-college nightlife center of NY. This area is completely different at night, and never not a good time).'
    },

  ],
};
let fakeExperiences = [
  {
    experience_id: 'test-exp-1',
    img: 'https://www.sftravel.com/sites/sftraveldev.prod.acquia-sites.com/files/SanFrancisco_0.jpg',
    title: 'Some Experience',
    subtitle: 'a great fancy subtitle',
  }
];

/*
 * @param id {string} the experience id you're looking for
 * @param city {string} the city name you're looking for
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function getFeaturedExperiencesForCity(id, city, refreshCache) {
  let cachedCityExperiences,
      cityId = (city) ? city.toLowerCase().replace(' ', '_') : id + 'cityExp',
      cacheId = `content-city-experiences-${cityId}`;

  if (refreshCache) await Cache.removeItem(cacheId);
  else cachedCityExperiences = await Cache.getItem(cacheId);

  if (cachedCityExperiences) {
    console.log('got from cache', cachedCityExperiences);
    return cachedCityExperiences;
  }

  // Create API path to call API GW
  let cityFeatuerdExperiences = `${path}/cities/${id}/experiences`;

  // get experience from dynamo
  console.debug('calling api ', cityFeatuerdExperiences);
  let response = await API.get(apiName, cityFeatuerdExperiences)
    .catch((error) => {
      console.warn('Error getting experience: ', id, error);
    });

  response = response[0];

  // Cache the response
  if (response) await Cache.setItem(cacheId, response, {priority: 4});

  // return response;
  return fakeExperiences;
}

/*
 * @param id {string} the experience id you're looking for
 * @param city {string} the city name you're looking for
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function getFeaturedExperiences(refreshCache) {
  let cachedFeaturedContent,
      cacheId = `featured-experiences`;

  if (refreshCache) await Cache.removeItem(cacheId);
  else cachedFeaturedContent = await Cache.getItem(cacheId);

  if (cachedFeaturedContent) {
    console.log('got from cache', cachedFeaturedContent);
    return cachedFeaturedContent;
  }
  let apiPath = `${path}/experiences`;

  // call api to get featured content
  console.debug('calling api', apiPath);
  let response = await API.get(apiName, apiPath)
    .catch((error) => {
      console.warn('Error getting featured experiences', error);
    });

  // Cache the response
  if (response) await Cache.setItem(cacheId, response, {priority: 5});

  // return response;
  return fakeExperiences;
}

/*
 * @param id {string} the experience id you're looking for
 * @param city {string} the city name you're looking for
 * @returns {*} response from Lambda (aka Dynamo)
 */
async function getFeaturedContent(refreshCache) {
  let cachedFeaturedContent,
      cacheId = `featured-content`;

  if (refreshCache) await Cache.removeItem(cacheId);
  else cachedFeaturedContent = await Cache.getItem(cacheId);

  if (cachedFeaturedContent) {
    console.log('got from cache', cachedFeaturedContent);
    return cachedFeaturedContent;
  }

  console.debug('calling api', path);

  // call api to get featured content
  let response = await API.get(apiName, path)
    .catch((error) => {
      console.warn('Error getting featured content', error);
    });

  // Cache the response
  if (response) await Cache.setItem(cacheId, response, {priority: 5});

  // return response;
  return fakeFeaturedContent;
}

const ExperiencesAPI = {
  getFeaturedExperiencesForCity,
  getFeaturedExperiences,
  getFeaturedContent,
};

export default ExperiencesAPI;