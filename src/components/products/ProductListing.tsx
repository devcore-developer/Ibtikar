"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types/product";
import { ProductGrid } from "./ProductGrid";
import { ProductToolbar } from "./ProductToolbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLocale } from "next-intl";

export function ProductListing({ products }: { products: Product[] }) {
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.partNumber?.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case "price_asc": result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "name": result.sort((a, b) => locale === "ar" ? a.nameAr.localeCompare(b.nameAr) : a.nameEn.localeCompare(b.nameEn)); break;
    }

    return result;
  }, [products, searchQuery, sort, locale]);

  return (
    <>
      <ProductToolbar onSearch={setSearchQuery} onSort={setSort} />
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <EmptyState />
      )}
    </>
  );
}