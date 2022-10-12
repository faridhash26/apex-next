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
  const [isLoading, setIsLoading] = useState(false);
  const [theData, setTheData] = useState([]);
  const [thenewConvertedData, setthenewConvertedData] = useState([]);
  const handleGet = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h"
      );
      setTheData(handleUpdateData(res.data ? res.data : []));
      setIsLoading(false);
    } catch (error) {}
  }, []);

  useEffect(() => {
    handleGet();
  }, [handleGet]);
  // console.log("data", theData);
  const handleUpdateData = (originalData = []) => {
    let newarr = [];
    if (originalData != 0) {
      for (let i = 0; i < 20; i++) {
        let convertArr = [
          Number(originalData[i][1]),
          Number(originalData[i][2]),
          Number(originalData[i][3]),
          Number(originalData[i][4]),
        ];
        newarr.push({ x: new Date(originalData[i][0]), y: convertArr });
      }
    }
    return newarr;
  };

  console.log("new data ", theData);
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
            data: theData,
          },
        ]}
        type="candlestick"
        height={350}
      />
    </div>
  );
}
