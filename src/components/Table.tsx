import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import { SymbolItemProps } from "./Dashboard";

interface Trade {
  id: number;
  price: number;
  qty: number;
  quoteQty: number;
  time: number;
}

interface Ticker24hr {
  priceChangePercent: number;
}

interface FilterOption {
  label: string;
  value: string;
}

interface Props {
  symbolItem: SymbolItemProps;
}

export const Table = ({ symbolItem }: Props) => {
  const [ticker24hr, setTicker24hr] = useState<Ticker24hr | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filter, setFilter] = useState<string | undefined>();
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);

  const filterList: FilterOption[] = [
    { label: "Lowest price", value: "lowestPrice" },
    { label: "Highest price", value: "highestPrice" },
    { label: "Lowest quantity", value: "lowestQuantity" },
    { label: "Highest quantity", value: "highestQuantity" },
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
  ];

  // Get 24hr tickers and last trades
  useEffect(() => {
    const axiosTrades = axios.get("https://api.binance.com/api/v3/trades", {
      params: { symbol: symbolItem.label as string, limit: 10 },
    });

    const axios24hr = axios.get("https://api.binance.com/api/v3/ticker/24hr", {
      params: { symbol: symbolItem.label as string },
    });

    axios
      .all([axiosTrades, axios24hr])
      .then(([resTrades, res24hr]) => {
        setTrades(resTrades.data as Trade[]);
        setTicker24hr(res24hr.data as Ticker24hr);
      })
      .catch((err) => {
        console.error("Error fetching symbols:", err);
      });
  }, [symbolItem]);

  useEffect(() => {
    if (filter === "lowestPrice") {
      const filtered = [...trades].sort((a, b) => a.price - b.price);
      setFilteredTrades(filtered);
    }

    if (filter === "highestPrice") {
      const filtered = [...trades].sort((a, b) => b.price - a.price);
      setFilteredTrades(filtered);
    }

    if (filter === "lowestQuantity") {
      const filtered = [...trades].sort((a, b) => a.qty - b.qty);
      setFilteredTrades(filtered);
    }

    if (filter === "highestQuantity") {
      const filtered = [...trades].sort((a, b) => b.qty - a.qty);
      setFilteredTrades(filtered);
    }

    if (filter === "newest") {
      const filtered = [...trades].sort((a, b) => b.time - a.time);
      setFilteredTrades(filtered);
    }

    if (filter === "oldest") {
      const filtered = [...trades].sort((a, b) => a.time - b.time);
      setFilteredTrades(filtered);
    }
  }, [filter, trades]);

  return (
    <>
      <h3>{symbolItem && symbolItem.label}</h3>
      <div>Ticker: {symbolItem && symbolItem.price}%</div>
      <div>24H Ticker: {ticker24hr && ticker24hr.priceChangePercent}%</div>
      <div>
        <h3>Filter by</h3>
        <Select
          className='search-currency-pair'
          classNamePrefix='select'
          name='search-currency-pair'
          options={filterList}
          onChange={(selectedFilter) => setFilter(selectedFilter!.value)}
        />
      </div>
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
          {filter
            ? filteredTrades.map((trade) => (
                <tr key={trade.id}>
                  <td>{trade.id}</td>
                  <td>{trade.price}</td>
                  <td>{trade.qty}</td>
                  <td>{trade.quoteQty}</td>
                  <td>{trade.time}</td>
                </tr>
              ))
            : trades.map((trade) => (
                <tr key={trade.id}>
                  <td>{trade.id}</td>
                  <td>{trade.price}</td>
                  <td>{trade.qty}</td>
                  <td>{trade.quoteQty}</td>
                  <td>{trade.time}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </>
  );
};
