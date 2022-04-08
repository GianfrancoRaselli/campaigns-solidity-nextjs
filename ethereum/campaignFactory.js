import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const address = '0x4a5B2c830038c5e16d463Dc891EcE117c2d87164';

const instance = new web3.eth.Contract(CampaignFactory.abi, address);

export default instance;
