import { useEffect, useState } from "react";
import {
  useBalance,
  useConnectUI,
  useIsConnected,
  useWallet,
} from "@fuels/react";
import { CompV } from "../sway-api";
import { BigNumberish, BN } from "fuels";

const CONTRACT_ID = import.meta.env.VITE_COMP_V_ID;
const VAULT_ID = import.meta.env.VITE_VAULT_ID;
const ORACLE_ID = import.meta.env.VITE_ORACLE_ID;

export default function(){
    const [contract, setContract] = useState<CompV>();
  const [totalAssets, setTotalAssets] = useState<number>();
  const { connect, isConnecting } = useConnectUI();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();
  const { balance } = useBalance({
    address: wallet?.address.toAddress(),
    assetId: wallet?.provider.getBaseAssetId(),
  });

  useEffect(() => {
    async function getInitialAssets() {
      if (isConnected && wallet) {
        const compvContract = new CompV(
          CONTRACT_ID,
          wallet
        );
        console.log(CONTRACT_ID);
        await getTotalAssets(compvContract);
        setContract(compvContract);
        
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
  //     const contractIdInput = { bits: contractId.toString() };
  // const contractIdentityInput = { ContractId: contractIdInput };

  const mint = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    
    try {
        if (!wallet) return alert("Wallet not connected")
        const addressInput = {bits: wallet.address.toB256()}
        const addressIdentityInput = { Address: addressInput };

        const subId: string | undefined = "0x2000000000000000000000000000000000000000000000000000000000000000";

        const amount: BigNumberish = new BN(1000);

      // await contract.functions.constructor(addressIdentityInput).call();

      await contract.functions.mint(addressIdentityInput,subId,amount).call();
      await getTotalAssets(contract);
    } catch (error) {
      console.error(error);
    }
  };


    return (<div style={styles.root}>
        <div style={styles.container}>
          {isConnected ? (
            <>
              <h3 style={styles.label}>CompV</h3>
              <div style={styles.counter}>{totalAssets ?? 0}</div>
   
              {balance && balance.toNumber() === 0 ? (
                <p>
                  Get testnet funds from the{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://faucet-testnet.fuel.network/?address=${wallet?.address.toAddress()}`}
                  >
                    Fuel Faucet
                  </a>{" "}
                  to increment the counter.
                </p>
              ) : (
                <button onClick={mint} style={styles.button}>
                  Mint CompV
                </button>
              )}
   
              <p>Your Fuel Wallet address is:</p>
              <p>{wallet?.address.toAddress()}</p>
            </>
          ) : (
            <button
              onClick={() => {
                connect();
              }}
              style={styles.button}
            >
              {isConnecting ? "Connecting" : "Connect"}
            </button>
          )}
        </div>
      </div>
    );
  }
   
  const styles = {
    root: {
      display: "grid",
      placeItems: "center",
      height: "100vh",
      width: "100vw",
      backgroundColor: "black",
    } as React.CSSProperties,
    container: {
      color: "#ffffffec",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    } as React.CSSProperties,
    label: {
      fontSize: "28px",
    },
    counter: {
      color: "#a0a0a0",
      fontSize: "48px",
    },
    button: {
      borderRadius: "8px",
      margin: "24px 0px",
      backgroundColor: "#707070",
      fontSize: "16px",
      color: "#ffffffec",
      border: "none",
      outline: "none",
      height: "60px",
      padding: "0 1rem",
      cursor: "pointer",
    },
  };