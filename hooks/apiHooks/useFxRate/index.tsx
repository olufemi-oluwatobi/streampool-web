import React, { useEffect, useState } from "react";
import { GiftCardService } from "../../../services";

let currentFx: number;

const useFxRate = (): number => {
    const [rate, setRate] = useState(0);
    useEffect(() => {
        if (currentFx) setRate(currentFx);
        else {
            const fetchRates = async () => {
                const { data } = await GiftCardService.getFXRates();
                if (data) {
                    const { exchange_rate } = data?.data?.fx_rate[0];
                    const rate = parseInt(exchange_rate);
                    currentFx = rate;
                    setRate(rate);
                }
            };
            fetchRates();
        }
    }, []);
    return rate;
};

export default useFxRate