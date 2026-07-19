"use client";

import { useState, type ChangeEvent } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onSearch: (value: string) => void;
}

export default function SearchBox({ value, onSearch }: SearchBoxProps) {
  const [query, setQuery] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // Keep local input state in sync when the `value` prop changes externally
  // (e.g. tag/page navigation, browser back/forward). Adjusting state during
  // render — instead of in a useEffect — avoids the extra commit-then-effect
  // render pass. See https://react.dev/learn/you-might-not-need-an-effect
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value);
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setQuery(newValue);
    onSearch(newValue);
  };

  return (
    <input
      className={css.input}
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Search notes..."
    />
  );
}
