import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Table } from "./Table";

export interface SymbolItem {
  label: string;
  price: string;
}

export const Dashboard = (): JSX.Element => {
  const [currencyPairs, setCurrencyPairs] = useState<SymbolItem[]>([]);
  const [selectedPair, setSelectedPair] = useState<SymbolItem | null>(null);
  const [validatedPair, setValidatedPair] = useState<SymbolItem | null>(null);

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    axios
      .get("https://api.binance.com/api/v3/ticker/price")
      .then((res) => {
        setCurrencyPairs(res.data);
      })
      .catch((err) => {
        console.error("Error fetching symbols:", err);
      });
  }, []);

  const getMappedCurrencyPairs: SymbolItem[] = currencyPairs.map(
    (symbol: SymbolItem) => ({
      label: symbol.symbol,
      price: symbol.price,
    })
  );

  return (
    <>
      <div>
        <h2>Select the currency pair</h2>
        <Select
          className='search-currency-pair'
          classNamePrefix='select'
          isDisabled={isDisabled}
          isLoading={isLoading}
          isClearable={isClearable}
          isRtl={isRtl}
          isSearchable={isSearchable}
          name='search-currency-pair'
          options={getMappedCurrencyPairs}
          onChange={(selectedOption) => setSelectedPair(selectedOption)}
        />

        <button
          onClick={() => {
            setValidatedPair(selectedPair);
            if (!selectedPair) {
              alert("You need to select a currency pair");
            }
          }}
        >
          Search
        </button>
      </div>

      {validatedPair && <Table symbol={validatedPair} />}
    </>
  );
};
