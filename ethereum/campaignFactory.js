import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const address = '0xB1Bf0a8Ca393B5B22D21B201A8124E0C3B39a4cE';

const instance = new web3.eth.Contract(CampaignFactory.abi, address);

export default instance;
