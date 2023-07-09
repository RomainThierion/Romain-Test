import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Table } from "./Table";

export interface SymbolItemProps {
  label?: string;
  price?: string;
  symbol?: string;
}

export const Dashboard = (): JSX.Element => {
  const [currencyPairs, setCurrencyPairs] = useState<SymbolItemProps[]>([]);
  const [selectedPair, setSelectedPair] = useState<SymbolItemProps | null>(
    null
  );
  const [validatedPair, setValidatedPair] = useState<SymbolItemProps | null>(
    null
  );

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get("https://api.binance.com/api/v3/ticker/price")
      .then((res: { data: SymbolItemProps[] }) => {
        setCurrencyPairs(res.data);
      })
      .catch((err) => {
        console.error("Error fetching symbols:", err);
      });
  }, []);

  const getMappedCurrencyPairs: SymbolItemProps[] = currencyPairs.map(
    (symbol: SymbolItemProps) => ({
      label: symbol.symbol,
      price: symbol.price,
    })
  );

  console.log(getMappedCurrencyPairs);

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
          isSearchable={isSearchable}
          name='search-currency-pair'
          options={getMappedCurrencyPairs}
          onChange={(selectedOption) =>
            setSelectedPair(selectedOption as SymbolItemProps)
          }
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

      {validatedPair && <Table symbolItem={validatedPair} />}
    </>
  );
};
