import { useEffect, useState } from "react";
import {
  useBalance,
  useConnectUI,
  useIsConnected,
  useWallet,
} from "@fuels/react";
import { CompV, Oracle, Src6VaultConnector } from "../sway-api";
import { arrayify, BigNumberish, BN, hexlify } from "fuels";
import { useToast } from "@/hooks/use-toast";

const ASSET_ID = import.meta.env.VITE_ASSET_ID;
const COMPV_ID = import.meta.env.VITE_COMP_V_ID;
const VAULT_ID = import.meta.env.VITE_VAULT_ID;
const ORACLE_ID = import.meta.env.VITE_ORACLE_ID;

export default function(){
  const {toast} = useToast()
  const [compv, setCompv] = useState<CompV>();
  const [assetLib, setAssetLib] = useState<CompV>();
  const [vault, setVault] = useState<Src6VaultConnector>();
  const [oracle, setOracle] = useState<Oracle>()
  const [shares, setShares] = useState<number>()
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
        const assetContract = new CompV(
          ASSET_ID,
          wallet
        );
        setAssetLib(assetContract);

        const compvContract = new CompV(
          COMPV_ID,
          wallet
        );
        await getTotalAssets(assetContract);
        setCompv(compvContract);

        const oracleContract = new Oracle(
          ORACLE_ID,
          wallet
        )
        setOracle(oracleContract)

        const vaultContract = new Src6VaultConnector(
          VAULT_ID,
          wallet
        )
        setVault(vaultContract)
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

  const depositAsset = async (amount: BN, assetId: string) => {
    if (!vault) {
      return alert("Contract not loaded");
    }
    try {
      let assets = await wallet!.getBalances();
      console.log(assets);
      
      const addressIdentityInput = getSender();
      const vault_sub_id: Uint8Array = new Uint8Array(32).fill(1);
      const subId: string = hexlify(vault_sub_id);

      // const response  = await vault.functions.max_depositable(addressIdentityInput!, {bits: assetId},subId)
      const response  = await vault.functions
      .deposit(addressIdentityInput!,subId)//{bits: assetId},
      .txParams({ 
        variableOutputs: 1,
      })
      .callParams({
        forward: {
          amount: amount,
          assetId: arrayify(assetId),
        },
      })
      .call();

      const share = await response.waitForResult();
      console.log(share);
      setShares(share.value.toNumber());
      toast({
            title: 'Transaction Success',
            description: response.transactionId,
            variant: 'online'
          });
    } catch (error) {
      console.error(error);
    }
  }

  const depositCollateral = async (amount: BN, assetId: string) => {
    if (!vault) {
      return alert("Contract not loaded");
    }
    try {
      let assets = await wallet!.getBalances();
      console.log(assets);
      
      const addressIdentityInput = getSender();      

      // const response  = await vault.functions.max_depositable(addressIdentityInput!, {bits: assetId},subId)
      const response  = await vault.functions
      .deposit_collateral(addressIdentityInput!)//{bits: assetId},
      .txParams({ 
        variableOutputs: 1,
      })
      .callParams({
        forward: {
          amount: amount,
          assetId: arrayify(assetId),
        },
      })
      .call();

      const deposited = await response.waitForResult();
      console.log(deposited);
      setShares(deposited.value.toNumber());
      toast({
            title: 'Transaction Success',
            description: response.transactionId,
            variant: 'online'
          });
    } catch (error) {
      console.error(error);
    }
  }

  const borrowAsset = async (amount: BN, assetId: string, borrowAssetId: string) => {
    if (!vault || !compv) {
      return alert("Contract not loaded");
    }
    try {
      // let assets = await wallet!.getBalances();
      // console.log(assets);
      
      const addressIdentityInput = getSender();
      // const vault_sub_id: Uint8Array = new Uint8Array(32).fill(1);
      // const subId: string = hexlify(vault_sub_id);

      // const response  = await vault.functions.max_depositable(addressIdentityInput!, {bits: assetId},subId)
      const response  = await vault.functions
      .borrow_a(addressIdentityInput!,{bits: borrowAssetId})
      .txParams({ 
        variableOutputs: 1,
      })
      .callParams({
        forward: {
          amount: amount,
          assetId: arrayify(assetId),
        },
      })
      .addContracts([compv])
      .call();

      const share = await response.waitForResult();
      console.log(share);
      // setShares(share.value.toNumber());
      toast({
            title: 'Transaction Success',
            description: response.transactionId,
            variant: 'online'
          });
    } catch (error) {
      console.error(error);
    }
  }
  //     const contractIdInput = { bits: contractId.toString() };
  // const contractIdentityInput = { ContractId: contractIdInput };

  const mint = async () => {
    if (!assetLib) {
      return alert("Contract not loaded");
    }
    
    try {
        
      const addressIdentityInput = getSender();

      const sub_id: Uint8Array = new Uint8Array(32).fill(2);
      const subId: string = hexlify(sub_id);
        // const subId: string | undefined = "0x2000000000000000000000000000000000000000000000000000000000000000";

      const amount: BigNumberish = new BN(1000000);

      // await assetLib.functions.constructor(addressIdentityInput).call();

      await assetLib.functions.mint(addressIdentityInput!,subId,amount).call();
      await getTotalAssets(assetLib);
    } catch (error) {
      console.error(error);
    }
  };

  const getSender = () => {
    if (!wallet) return alert("Wallet not connected")
      const addressInput = {bits: wallet.address.toB256()}
      const addressIdentityInput = { Address: addressInput };

      return addressIdentityInput
  }


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
                <div>
                  <p>Balance: {balance?.toNumber()}</p>
                  {/* <button onClick={mint} style={styles.button}>
                    Mint CompV
                  </button> */}
                  <button style={styles.button} onClick={async ()=>await depositAsset(new BN(1000),"0x1298fadaa13d3203c686f4f7b4a110d9b5e01ef30a5eed39bc8d439d68106eab")}>
                    Deposit 1k
                  </button>
                  <button style={styles.button} onClick={async () => await depositCollateral(new BN(1000), "0x1298fadaa13d3203c686f4f7b4a110d9b5e01ef30a5eed39bc8d439d68106eab")}>
                    DepositCollateral 1k
                  </button>
                  <button style={styles.button} onClick={async () => await borrowAsset(new BN(100), "0x1298fadaa13d3203c686f4f7b4a110d9b5e01ef30a5eed39bc8d439d68106eab", "0x84e5f0e47a98492fb297a607d53e1f3a8e564274b8fd5afa6e53772dd413455a")}>
                    Borrow 100
                  </button>
                </div>
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