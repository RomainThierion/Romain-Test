import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

interface GetCurrencyPairs {
  label: string;
  value: string;
}

interface SymbolItem {
  symbol: string;
}

export const Form = () => {
  const [symbols, setSymbols] = useState<SymbolItem[]>([]);

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    axios
      .get("https://api.binance.com/api/v3/exchangeInfo")
      .then((res) => {
        const data = res.data as { symbols: SymbolItem[] };
        setSymbols(data.symbols);
      })
      .catch((err) => {
        console.error("Error fetching symbols:", err);
      });
  }, []);

  const getCurrencyPairs: GetCurrencyPairs[] = symbols.map(
    (symbol: SymbolItem) => ({
      label: symbol.symbol,
      value: symbol.symbol,
    })
  );
  console.log(getCurrencyPairs);

  return (
    <div>
      <h2>Select the currency pair</h2>
      <Select
        className='basic-single'
        classNamePrefix='select'
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        isSearchable={isSearchable}
        name='color'
        options={getCurrencyPairs}
      />
      <button>Search</button>
    </div>
  );
};
