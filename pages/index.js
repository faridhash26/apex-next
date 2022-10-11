import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { data } from "../data/data";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import axios from "axios";

// import Chart from "react-apexcharts";
const THEChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Home() {
  const [theData, setTheData] = useState([]);
  const [thenewConvertedData, setthenewConvertedData] = useState([]);
  const handleGet = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h"
      );
      setTheData(res.data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    handleGet();
  }, [handleGet]);
  // console.log("data", theData);
  const handleUpdateData = () => {
    let newarr = [];
    if (theData.length != 0) {
      for (let i = 0; i < 20; i++) {
        let convertArr = [
          Number(theData[i][1]),
          Number(theData[i][2]),
          Number(theData[i][3]),
          Number(theData[i][4]),
        ];
        newarr.push({ x: new Date(theData[i][0]), y: convertArr });
      }
    }
    return newarr;
  };
  useEffect(() => {
    setthenewConvertedData(handleUpdateData());
  }, []);

  console.log("new data ", handleUpdateData());
  const theOption = {
    series: [
      {
        data: thenewConvertedData,
      },
    ],
    options: {
      chart: {
        type: "candlestick",
        height: 350,
      },
      title: {
        text: "CandleStick Chart",
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    },
  };
  return (
    <div>
      <THEChart
        options={theOption.options}
        series={[
          {
            data: thenewConvertedData,
          },
        ]}
        type="candlestick"
        height={350}
      />
    </div>
  );
}
