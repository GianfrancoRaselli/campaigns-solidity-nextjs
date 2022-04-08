const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { mnemonic_phrase, infura_url } = require('./config');
const compiledCampaignFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(mnemonic_phrase, infura_url);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account ', accounts[0]);
  const deployedContract = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({ data: compiledCampaignFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '9999999' });
  console.log('Contract deployed to ', deployedContract.options.address);
  
  provider.engine.stop();
};

deploy();
