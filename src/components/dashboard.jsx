import React, { useEffect, useState, useMemo, useRef } from "react";
import Modal from "react-modal";
import axios from "axios";

import SideList from "./sideList";
import CoinDetails from "./coinDetails";

import menuIcon from "../imgs/menu.svg";

const customStyles = {
  content: {
    padding: 0,
    maxWidth: "300px",
    left: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, 0%)",
  },
};

const Dashboard = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [coinList, setCoinList] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState({});

  const timmer = useRef(null);

  const getCoinsDetails = () => {
    axios("tickers?symbols=ALL").then(function (response) {
      const filterData = [];
      response?.data?.filter((coin) => {
        if (coin[0].startsWith("t") && coin.length > 9) {
          const CoinObj = {
            coin: coin[0],
            coinName: coin[0].slice(1, -3),
            pair: coin[0].slice(-3),
            change: (coin[6] * 100).toFixed(2),
            LAST_PRICE: coin[7],
            vhl: {
              VOLUME: coin[8],
              HIGH: coin[9],
              LOW: coin[10],
            },
          };

          filterData.push(CoinObj);
          return true;
        }
        return false;
      });
      setCoinList(filterData);
    });
    return true;
  };

  useEffect(() => {
    getCoinsDetails();
    timmer.current = setInterval(() => {
      getCoinsDetails();
    }, 5000);
    return () => {
      if (timmer.current) {
        clearInterval(timmer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (coinList.length > 0 && Object.keys(selectedCoin).length === 0) {
      setSelectedCoin(coinList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinList]);

  const showCoinDetails = useMemo(
    () => <CoinDetails selectedCoin={selectedCoin} />,
    [selectedCoin]
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 flex">
        {coinList.length > 0 && (
          <button className="sm:hidden" onClick={() => setIsOpen(true)}>
            <img src={menuIcon} alt="menu" />
          </button>
        )}
        <p className="text-center flex-grow text-2xl text-gray-700 font-medium">
          React js Assignment
        </p>
      </div>
      {coinList.length > 0 && (
        <div className="flex border-t border-black flex-grow">
          <SideList
            selectedCoin={selectedCoin}
            setSelectedCoin={setSelectedCoin}
            wrapperClass="hidden sm:block w-[250px] min-h-full border-r border-black"
            coinList={coinList}
          />
          {showCoinDetails}
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <p className="flex justify-between p-2 border-b border-gray-300 align-middle items-center text-gray-900 bg-gray-100">
          <span>Coin List</span>
          <button onClick={() => setIsOpen(false)} className="text-xl p-2">
            <svg
              width="18"
              height="18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.825 9 .917 2.09A.833.833 0 0 1 2.092.916L9 7.825 15.908.908a.837.837 0 1 1 1.184 1.183L10.175 9l6.916 6.908a.832.832 0 0 1-.574 1.466.832.832 0 0 1-.6-.29L9 10.173l-6.908 6.91a.833.833 0 0 1-1.175-1.176L7.825 9Z"
                fill="#000"
              />
            </svg>
          </button>
        </p>
        <SideList
          selectedCoin={selectedCoin}
          setSelectedCoin={setSelectedCoin}
          coinList={coinList}
          closeModal={() => setIsOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
