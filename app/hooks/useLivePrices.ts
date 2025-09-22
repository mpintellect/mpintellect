// hooks/useLivePrices.ts
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

interface PriceData {
  symbol: string;
  price: number;
}

export const useLivePrices = () => {
  const [prices, setPrices] = useState<PriceData[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "prices"), (snapshot) => {
      const liveData: PriceData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        liveData.push({
          symbol: data.symbol,
          price: data.price,
        });
      });
      setPrices(liveData);
    });

    return () => unsubscribe();
  }, []);

  return prices;
};