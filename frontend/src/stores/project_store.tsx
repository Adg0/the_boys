import { create } from "zustand";

type OptionDetails = {
    option: string;
    amount: number;
    walletBalance: number;
    depositValue: number;
    supplyAPY: number;
    healthFactor: number;
    timeToLiquidation: number;
};

type optionsType = {
    [key: string]: OptionDetails;
};

const options:optionsType = {
    "USD Coin": {
        option: "USD Coin", amount: 10.50, walletBalance: 500, depositValue: 0, supplyAPY: 0.22, healthFactor: 50, timeToLiquidation: 10_000
    },
    "USD Tether": {
        option: "USD Tether", amount: 0.50, walletBalance: 1500, depositValue: 1000, supplyAPY: 71.54, healthFactor: 150, timeToLiquidation: 50_000
    },
    "Ethereum": {
        option: "Ethereum", amount: 2000, walletBalance: 50, depositValue: 125, supplyAPY: 0.01, healthFactor: -40, timeToLiquidation: 400
    },
};

const useProjectStore = create(() => ({
    projects: [ "USD Coin", "USD Tether", "Ethereum", ],
    options,
}));

export default useProjectStore;