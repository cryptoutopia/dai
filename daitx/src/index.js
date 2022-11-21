import React from 'react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Web3 from 'web3';
import Contract from 'web3-eth-contract';
import './index.css';

class Transfer {
  txHash;
  src;
  dst;
  wad;

  constructor(txHash, source, destination, wad) {
      this.txHash = txHash;
      this.src = source;
      this.dst = destination;
      this.wad = wad;
      //this.timestamp = timestamp
  }
}

class DaiTxSpy {
  web3ws;
  contract;
  blockNumber;
  transfers;

  constructor (apiurl) {
      this.web3ws = new Web3(new Web3.providers.WebsocketProvider(apiurl));
      this.contract = new Contract(JSON.parse(DaiTxSpy.DaiAbi), DaiTxSpy.DaiContractAddr);
      this.contract.setProvider(apiurl);
      this.transfers = [];
  }

  async loadTransfers(count = 10, window = 1) {
      await this.getbn();

      let from = this.blockNumber - window
      let to = this.blockNumber;
      let transfers = [];

      while (transfers.length < count) { 
          let tmp = await this.contract.getPastEvents("Transfer", {
              fromBlock: from,
              toBlock: to
          }, (err, evt) => {
              if (err) { console.log(err);}
              if (evt) { return evt }
          });

          let n = tmp.length;
          let x = count - transfers.length;

          if (n > x) {
              tmp.splice(0, n-(n-x))
          }

          await tmp.forEach((event) => {
                  transfers.push(
                      new Transfer(
                          event.transactionHash,
                          event.returnValues.src,
                          event.returnValues.dst,
                          event.returnValues.wad,
                      )
                  );
          });

          if (transfers.length >= count) { break; }

          to = from - 1;
          from = from - window - 1;
      }
      
      return this.transfers = transfers;
  }

  async loadTransfersReact(callback, count = 10, window = 1) {
      let txn = await this.loadTransfers(count, window);
      callback(txn);
  }

  async Spy(callback = false) {
      console.log("Dai TX spy is running ...")
      this.contract.events.Transfer()
          .on('data', event => {
              console.log("New Tx:")
              const t = new Transfer(
                  event.transactionHash,
                  event.returnValues.src,
                  event.returnValues.dst,
                  event.returnValues.wad,
              );

              this.transfers.push(t);

              if (callback) {
                  callback(this.transfers);
              }
          });
  }

  async getbn() {
      this.blockNumber = await this.web3ws.eth.getBlockNumber();
  }

  static get DaiContractAddr() { return '0x6B175474E89094C44Da98b954EedeAC495271d0F' }
  static get DaiAbi() {
      return '[{"inputs":[{"internalType":"uint256","name":"chainId_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"guy","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":true,"inputs":[{"indexed":true,"internalType":"bytes4","name":"sig","type":"bytes4"},{"indexed":true,"internalType":"address","name":"usr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"arg1","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"arg2","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"LogNote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"deny","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"move","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"bool","name":"allowed","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"pull","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"push","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"rely","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]';   
  }
}

function DaiTxn() {
  const [txn, setTxn] = useState([]);
  const daiTxSpy = new DaiTxSpy('wss://mainnet.infura.io/ws/v3/8eecc1a9e33d49648dc2d9be03281f6e');
  const max = 3;

  useEffect(() => {
    daiTxSpy.loadTransfers(max, 1).then(transfers => {
      setTxn(transfers);
    });

    daiTxSpy.Spy((result) => {
      if (result.length > max) {
        for (let i = result.length; i > 0; --i) {
          result.pop();
        }
      }
      setTxn(result);
    });
  }, [])

  if (!txn.length) {
      return (
        <h2>Loading ...</h2>
      );

  } else {
    let listTxn = txn.map(tx => 
      <tr>
        <td className='border border-slate-700'>{tx.txHash}</td>
        <td className='border border-slate-700'>{tx.src}</td>
        <td className='border border-slate-700'>{tx.dst}</td>
        <td className='border border-slate-700'>{tx.wad}</td>
      </tr>
    );

    return (
      <table className='border-collapse border border-slate-500'>
        <thead>
        <tr>
          <th className='border border-slate-600'>Transaction Hash</th>
          <th className='border border-slate-600'>Source</th>
          <th className='border border-slate-600'>Destination</th>
          <th className='border border-slate-600'>Amount</th>
        </tr>
        </thead>
        {listTxn}
      </table>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DaiTxn />
  </React.StrictMode>
);
