"use client";

import { useTranslations, useLocale } from "next-intl";
import { Search, X, ArrowDownUp } from "lucide-react";
import { useState } from "react";

interface ToolbarProps {
  onSearch: (query: string) => void;
  onSort: (sort: string) => void;
}

export function ProductToolbar({ onSearch, onSort }: ToolbarProps) {
  const t = useTranslations("SpareParts");
  const [search, setSearch] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 -translate-y-1/2 start-4 text-muted" size={18} />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={handleSearchChange}
          className="w-full h-11 ps-11 pe-4 bg-surface border border-border rounded-md text-sm focus:outline-none focus:border-primary transition-colors"
        />
        {search && (
          <button onClick={() => { setSearch(""); onSearch(""); }} className="absolute top-1/2 -translate-y-1/2 end-4 text-muted hover:text-foreground">
            <X size={16} />
          </button>
        )}
      </div>
      
      <div className="relative md:w-56">
        <ArrowDownUp className="absolute top-1/2 -translate-y-1/2 start-4 text-muted pointer-events-none" size={16} />
        <select 
          onChange={(e) => onSort(e.target.value)}
          className="w-full h-11 ps-11 pe-4 bg-surface border border-border rounded-md text-sm appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer"
        >
          <option value="newest">{t("sortNewest")}</option>
          <option value="price_asc">{t("sortPriceAsc")}</option>
          <option value="price_desc">{t("sortPriceDesc")}</option>
          <option value="name">{t("sortName")}</option>
        </select>
      </div>
    </div>
  );
}