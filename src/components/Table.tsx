import axios from "axios";
import { useEffect, useState } from "react";

export const Table = (symbolItem) => {
  const [ticker24hr, setTicker24hr] = useState([]);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const axiosTrades = axios.get("https://api.binance.com/api/v3/trades", {
      params: { symbol: "ETHBTC", limit: 10 },
    });

    const axios24hr = axios.get("https://api.binance.com/api/v3/ticker/24hr", {
      params: { symbol: "ETHBTC" },
    });

    axios
      .all([axiosTrades, axios24hr])
      .then(
        axios.spread((resTrades, res24hr) => {
          setTrades(resTrades.data);
          setTicker24hr(res24hr.data);
        })
      )
      .catch((err) => {
        console.error("Error fetching symbols:", err);
      });
  }, [symbolItem]);

  return (
    <>
      <h3>{symbolItem && symbolItem.symbol && symbolItem.symbol.label}</h3>
      <div>
        Ticker: {symbolItem && symbolItem.symbol && symbolItem.symbol.price}%
      </div>
      <div>24H Ticker: {ticker24hr.priceChangePercent}%</div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Quote Quantity</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => {
            return (
              <tr key={trade.id}>
                <td>{trade.id}</td>
                <td>{trade.price}</td>
                <td>{trade.qty}</td>
                <td>{trade.quoteQty}</td>
                <td>{trade.time}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
