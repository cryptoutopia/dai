import logo from './logo.svg';
import './App.css';
import React from 'react';

// web3js reqs
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


function DisplayDaiTxs() {


  //const initState = daiTransfers

  const [state, setState] = React.useState(initState);

  return (
    <table>
      {state.map((item) => (
        <tr>
          {Object.values(item).map((val) => (
            <td>{val.txHash}</td>
          ))}
        </tr>
      ))}
    </table>
  )
}



export default DisplayDaiTxs;