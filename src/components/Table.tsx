import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import { SymbolItemProps } from "./Dashboard";
import { PositiveTicker, NegativeTicker } from "../styles/Ticker";
import { OrderList, Td, Th, Tr } from "../styles/OrderList";
import { TickerWrapper } from "../styles/TickerWrapper";
import moment from "moment";

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

export const Table = ({ symbolItem }: Props): JSX.Element => {
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
      <h2>{symbolItem && symbolItem.label}</h2>
      <TickerWrapper>
        {symbolItem && symbolItem.price && parseInt(symbolItem.price) > 0 ? (
          <div>
            <h3>Ticker</h3>
            <PositiveTicker>{symbolItem && symbolItem.price}%</PositiveTicker>
          </div>
        ) : (
          <div>
            <h3>Ticker</h3>
            <NegativeTicker>{symbolItem && symbolItem.price}%</NegativeTicker>
          </div>
        )}

        {ticker24hr && ticker24hr.priceChangePercent > 0 ? (
          <div>
            <h3>24H Ticker</h3>
            <PositiveTicker>
              {ticker24hr && ticker24hr.priceChangePercent}%
            </PositiveTicker>
          </div>
        ) : (
          <div>
            <h3>24H Ticker</h3>
            <NegativeTicker>
              {ticker24hr && ticker24hr.priceChangePercent}%
            </NegativeTicker>
          </div>
        )}
      </TickerWrapper>

      <div>
        <h3>Filter by</h3>
        <Select
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              width: "400px",
              margin: "auto",
            }),
          }}
          name='filter'
          options={filterList}
          onChange={(selectedFilter) => setFilter(selectedFilter!.value)}
        />
      </div>

      <h2>Recent trades</h2>
      <OrderList>
        <thead>
          <Tr>
            <Th>Id</Th>
            <Th>Price</Th>
            <Th>Quantity</Th>
            <Th>Quote Quantity</Th>
            <Th>Time</Th>
          </Tr>
        </thead>
        <tbody>
          {filter
            ? filteredTrades.map((trade) => (
                <Tr key={trade.id}>
                  <Td>{trade.id}</Td>
                  <Td>{trade.price}</Td>
                  <Td>{trade.qty}</Td>
                  <Td>{trade.quoteQty}</Td>
                  <Td>
                    {moment(trade.time).format("MMMM Do YYYY, h:mm:ss a")}
                  </Td>
                </Tr>
              ))
            : trades.map((trade) => (
                <Tr key={trade.id}>
                  <Td>{trade.id}</Td>
                  <Td>{trade.price}</Td>
                  <Td>{trade.qty}</Td>
                  <Td>{trade.quoteQty}</Td>
                  <Td>
                    {moment(trade.time).format("MMMM Do YYYY, h:mm:ss a")}
                  </Td>
                </Tr>
              ))}
        </tbody>
      </OrderList>
    </>
  );
};
