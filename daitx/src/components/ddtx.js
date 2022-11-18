import { React, useEffect, useState } from 'react';
import DaiTxSpy from '../objects/dai.js';

function DaiTxn() {
  const [txn, setTxn] = useState([]);
  const daiTxSpy = new DaiTxSpy('secret');
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

export default DaiTxn;