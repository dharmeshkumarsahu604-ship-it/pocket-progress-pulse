import { useState, useMemo } from "react";

export function useSearch<T>(
  items: T[],
  searchFields: (keyof T)[]
) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    const lowerSearch = searchTerm.toLowerCase();
    return items.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (Array.isArray(value)) {
          return value.some((v) => 
            String(v).toLowerCase().includes(lowerSearch)
          );
        }
        return String(value).toLowerCase().includes(lowerSearch);
      })
    );
  }, [items, searchTerm, searchFields]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
  };
}
