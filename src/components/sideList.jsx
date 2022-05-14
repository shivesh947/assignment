import React, { useState, useEffect } from "react";

import { formatter } from '../utils';

import searchIcon from "../imgs/search.svg";

const SideList = ({
  selectedCoin,
  setSelectedCoin,
  wrapperClass,
  coinList,
  closeModal,
}) => {
  const [filterString, setFilterString] = useState("");
  const [filterList, setFilterList] = useState(coinList);

  useEffect(() => {
    if (filterString) {
      const filter = coinList.filter(({ coinName }) =>
        coinName.startsWith(filterString.toUpperCase())
      );
      setFilterList(filter);
    } else {
      setFilterList(coinList);
    }
  }, [coinList, filterString]);

  return (
    coinList?.length > 0 && (
      <div className={wrapperClass}>
        <div className="p-4">
          <div className="flex border border-gray-400 rounded items-center pl-4 pr-2">
            <input
              type="text"
              placeholder="Search"
              className=" w-full h-8 text-sm pr-2 outline-none focus:outline-none"
              onChange={(e) => {
                setFilterString(e.currentTarget.value);
              }}
            />
            <img src={searchIcon} alt="search" height="18px" width="18px" />
          </div>
        </div>
        <ul
          className="overflow-auto"
          style={{
            maxHeight: "calc(100vh - 140px)",
          }}
        >
          {filterList.length > 0 ? (
            filterList.map((coinData, index) => {
              const { vhl, pair, coinName, change, LAST_PRICE, coin } =
                coinData;
              const { VOLUME } = vhl;
              return (
                <li
                  key={coinName + index}
                  onClick={() => {
                    setSelectedCoin(coinData);
                    if (closeModal) {
                      closeModal();
                    }
                  }}
                >
                  <div
                    className={`flex justify-between px-4 py-2 text-sm cursor-pointer ${
                      selectedCoin.coin === coin
                        ? "bg-gray-300"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div>
                      <p className="font-medium">
                        {coinName} / {pair}
                      </p>
                      <p className="text-gray-600">
                        vol : {formatter.format(VOLUME)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatter.format(LAST_PRICE)}
                      </p>
                      <p
                        className={`text-sm ${
                          change !== 0 &&
                          (change > 0 ? "text-green-500" : "text-red-500")
                        } `}
                      >
                        {change}%
                      </p>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="text-center">No Coins Found</li>
          )}
        </ul>
      </div>
    )
  );
};

export default SideList;
