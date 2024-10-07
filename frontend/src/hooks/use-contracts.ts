import {create} from "zustand";
import { useEffect } from "react";
import {
  useBalance,
  useConnectUI,
  useIsConnected,
  useWallet,
} from "@fuels/react";
import { CompV, Oracle, Src6VaultConnector } from "../sway-api";
import { arrayify, BN, hexlify } from "fuels";
import { useToast } from "@/hooks/use-toast";

// Environment variables
const ASSET_ID = import.meta.env.VITE_ASSET_ID;
const COMPV_ID = import.meta.env.VITE_COMP_V_ID;
const VAULT_ID = import.meta.env.VITE_VAULT_ID;
const ORACLE_ID = import.meta.env.VITE_ORACLE_ID;

interface GlobalStoreState {
    compv: CompV | null;
    assetLib: CompV | null;
    vault: Src6VaultConnector | null;
    oracle: Oracle | null;
    shares: number;
    totalAssets: number;
    setCompv: (compv: CompV) => void;
    setAssetLib: (assetLib: CompV) => void;
    setVault: (vault: Src6VaultConnector) => void;
    setOracle: (oracle: Oracle) => void;
    setShares: (shares: number) => void;
    setTotalAssets: (totalAssets: number) => void;
    reset: () => void;
}

// Define Zustand store
export const useGlobalStore = create<GlobalStoreState>((set) => ({
  compv: null,
  assetLib: null,
  vault: null,
  oracle: null,
  shares: 0,
  totalAssets: 0,
  setCompv: (compv: CompV) => set({ compv }),
  setAssetLib: (assetLib: CompV) => set({ assetLib }),
  setVault: (vault: Src6VaultConnector) => set({ vault }),
  setOracle: (oracle: Oracle) => set({ oracle }),
  setShares: (shares: number) => set({ shares }),
  setTotalAssets: (totalAssets: number) => set({ totalAssets }),
  reset: () => set({ compv: null, assetLib: null, vault: null, oracle: null }),
}));

// The hook to manage wallet and connect the contracts
export const useSetupContracts = () => {
  const { toast } = useToast();
  const { connect, isConnecting } = useConnectUI();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();
  const { balance } = useBalance({
    address: wallet?.address.toAddress(),
    assetId: wallet?.provider.getBaseAssetId(),
  });

  const {
    setCompv,
    setAssetLib,
    setVault,
    setOracle,
    setTotalAssets,
    reset,
    compv,
    assetLib,
    vault,
  } = useGlobalStore();

  useEffect(() => {
    async function getInitialAssets() {
      if (isConnected && wallet) {
        const assetContract = new CompV(ASSET_ID, wallet);
        setAssetLib(assetContract);

        const compvContract = new CompV(COMPV_ID, wallet);
        // await getTotalAssets(assetContract);
        setCompv(compvContract);

        const oracleContract = new Oracle(ORACLE_ID, wallet);
        setOracle(oracleContract);

        const vaultContract = new Src6VaultConnector(VAULT_ID, wallet);
        setVault(vaultContract);
      } else {
        reset();
      }
    }

    getInitialAssets();
  }, [isConnected, wallet]);

  const getTotalAssets = async (compvContract: CompV) => {
    try {
      const { value } = await compvContract.functions.total_assets().get();
      setTotalAssets(value.toNumber());
    } catch (error) {
      console.error(error);
    }
  };

  return { connect, isConnecting, isConnected, wallet, balance };
};
