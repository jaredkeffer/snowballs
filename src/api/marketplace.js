import { API, Analytics, Cache } from 'aws-amplify';

async function getMarketplaceDetails() {
    console.log('returning some data');
}

const MarketplaceAPI = {
    getMarketplaceDetails,
};

export default MarketplaceAPI;
