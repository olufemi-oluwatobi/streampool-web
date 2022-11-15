import React, { useEffect, useState } from "react";
import BaseApi from "@services/api/new-index";
import axios from "axios";

type BankType = {
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string;
  pay_with_bank: boolean;
  active: boolean;
  is_deleted: boolean;
  country: string;
  currency: string;
  type: string;
  id: string;
  createdAt: string;
  updatedAt: string;
};
let bankMemo: BankType[];

const useBankList = (): BankType[] => {
  const [banks, setBanks] = useState<BankType[] | null>();
  useEffect(() => {
    if (bankMemo) setBanks(bankMemo);
    else {
      const fetchRates = async () => {
        const baseApi = new BaseApi();
        const { data } = await axios("https://api.paystack.co/bank", {
          headers: baseApi.loadHeaders(),
        });
        if (data) {
          setBanks(data.data);
          bankMemo = data.data;
        }
      };
      fetchRates();
    }
  }, []);
  return banks;
};

export default useBankList;
