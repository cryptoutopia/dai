import Web3 from 'web3'
import fs from 'fs'
import Contract  from "web3-eth-contract"; // option 1
import { exit } from 'process';

class Transfer {
    txHash;
    source;
    destination;
    wad;
    usd;
    //timestamp;

    constructor(txHash, source, destination, wad) {
        this.txHash = txHash;
        this.source = source;
        this.destination = destination;
        this.wad = wad;
        //this.timestamp = timestamp
    }
}




//Contract.setProvider('wss://mainnet.infura.io/v3/8eecc1a9e33d49648dc2d9be03281f6e')

const etherscantxlink = 'https://etherscan.io/tx/';
const cstr = 'wss://mainnet.infura.io/ws/v3/8eecc1a9e33d49648dc2d9be03281f6e'

const web3ws = new Web3(new Web3.providers.WebsocketProvider(cstr));
const blockNumber = await web3ws.eth.getBlockNumber()




// Contract stuff
const abi = JSON.parse(fs.readFileSync('dai.abi'))
const daiContract = new Contract(abi, '0x6B175474E89094C44Da98b954EedeAC495271d0F');
daiContract.setProvider(cstr);
const transferSig = Web3.utils.sha3('Transfer(address indexed src, address indexed dst, uint wad)');
const topics = [
    transferSig
]


const daiTransfers = await daiContract.getPastEvents("Transfer", {
    fromBlock: blockNumber - 100,
    toBlock: blockNumber
}, (err, evt) => {
    if (err) { console.log(err); exit(); }
    if (evt) {
        return evt
    }
});

let transfers = [];
daiTransfers.forEach((event) => {
    transfers.push(
        new Transfer(
            event.transactionHash,
            event.returnValues.src,
            event.returnValues.destination,
            event.returnValues.wad,
        )
    );
});


console.log("Got " + transfers.length + " DAI transactions ...");
console.log("Listening for new Transactions ... ");

/*
daiContract.once('Transfer', (er, e) => {
    console.log(etherscantxlink + e.transactionHash)
})
*/



let x = 5;


daiContract.events.Transfer()
    .on('data', event => {
        const t = new Transfer(
            event.transactionHash,
            event.returnValues.src,
            event.returnValues.destination,
            event.returnValues.wad,
        );

        daiTransfers.push(t);
        console.log(etherscantxlink + t.txHash)
        console.log("In memory " + daiTransfers.length +  " transactions")

    })





class DaiWatcher {
    web3;
    web3ws;
    sub;

    constructor (api_key) {
        this.web3ws = new Web3(new Web3.providers.WebsocketProvider('https://mainnet.infura.io/v3/' + api_key));
        this.web3 = new Web3(new Web3.providers.HttpProvider('ss://mainnet.infura.io/v3/' + api_key));   
    }


    getTransactions() {

    }

    subscribe(){}
    readEvents() {}
}









class DaiChecker {
    web3;
    account;

    constructor (api, account) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(api))
        this.account = account.toLowerCase()
    }

    async checkBlock() {
        let block = await this.web3.eth.getBlock('latest');
        let number = block.number;
        console.log('searching block ' + number)

        if (block != null && block.transactions != null) {
            for(let txHash of block.transactions) {
                let tx = await this.web3.eth.getTransaction(txHash);
                console.log(tx)
            }
        }
    }
}
//let dai = new DaiChecker('https://mainnet.infura.io/v3/8eecc1a9e33d49648dc2d9be03281f6e', 'kokot');
//await dai.checkBlock() 


class DaiCheckerSub {
    web3;
    web3ws;
    account;
    subscription;

    constructor (apiws, apihttp) {
        this.web3ws = new Web3(new Web3.providers.WebsocketProvider(apiws));
        this.web3 = new Web3(new Web3.providers.HttpProvider(apihttp))
    }

    subscribe(topic) {
        this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
            if (err) {
                console.error(err);
            }
        });
    }

    watchTransactions() {
        this.subscription.on('data', (txHash) =>  {
            setTimeout(async () => {
                try {
                    let tx = await this.web3.eth.getTransaction(txHash)
                    if(tx) {
                        console.log(tx.from)
                    }
                } catch(err) {
                    console.log(err)
                }
            }, 60 * 1000)
        });
    }
}




/*
web3.eth.getBlockNumber().then((result) => {
  console.log("Latest Ethereum Block is ",result);
});
*/