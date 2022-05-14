import React, { useEffect, useState } from "react";

import { formatter } from '../utils';

const wss = new WebSocket("wss://api.bitfinex.com/ws/2");

const CoinDetails = ({ selectedCoin }) => {
  const [coinDetails, setCoinDetails] = useState(selectedCoin);

  useEffect(() => {
    setCoinDetails(selectedCoin);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCoin.coin]);

  useEffect(() => {
    if (selectedCoin?.coin) {
      wss.onmessage = (msg) => {
        const parsed = JSON.parse(msg.data);
        const coinData = parsed?.[1] || [];
        if (coinData.length > 9) {
          setCoinDetails({
            change: (coinData[5] * 100).toFixed(2),
            LAST_PRICE: coinData[6],
            vhl: {
              VOLUME: coinData[7],
              HIGH: coinData[8],
              LOW: coinData[9],
            },
          });
        }
      };

      let trade = JSON.stringify({
        event: "subscribe",
        channel: "ticker",
        symbol: selectedCoin.coin,
      });

      wss.onopen = () => {
        wss.send(trade);
      };
    }
    return () => {
      if (wss.readyState === 1) {
        wss.close();
      }
    };
  }, [selectedCoin.coin]);

  const { pair, coinName } = selectedCoin;
  const { vhl, change, LAST_PRICE } = coinDetails;

  return (
    <div className="flex-grow p-6 sm:p-10">
      <div className="border-b border-black mb-6 pb-6">
        <p className="text-4xl font-medium">
          {coinName} / {pair}
        </p>
        <p>
          {formatter.format(LAST_PRICE)}
          <span
            className={`ml-6 text-sm ${
              change !== 0 && (change > 0 ? "text-green-500" : "text-red-500")
            } `}
          >
            {change}%
          </span>
        </p>
      </div>
      <div className="sm:flex">
        {vhl &&
          Object.keys(vhl).map((key, index) => (
            <div key={index} className="mr-6 mb-6">
              <p className="uppercase text-xs text-gray-600">{key}</p>
              <p className="font-medium">{formatter.format(vhl[key])}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CoinDetails;
