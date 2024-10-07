import { useState } from "react";

import useProjectStore from "@/stores/project_store";

import MySwitch from "./MySwitch";

import { arrayify, BigNumberish, BN, hexlify } from "fuels";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStore, useSetupContracts } from "@/hooks/use-contracts";


interface MyComponentProps {
    product: string,
};

const SupplyDialog:React.FC<MyComponentProps> = ({product}) => {

    const [useCollateralChecked, setUseCollateralChecked] = useState(false);
    const [selectValue, setSelectValue] = useState(product);

    const { options } = useProjectStore();
    const keys: string[] = Object.keys(options);

    const [inputValue, setInputValue] = useState<number | string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value === "" ? "" : parseFloat(value));
    };

    const {toast} = useToast()
    const { connect, isConnecting, isConnected, wallet, balance } = useSetupContracts();
    const {
        setShares,
        setCompv,
        setAssetLib,
        setVault,
        setOracle,
        setTotalAssets,
        reset,
        compv,
        assetLib,
        vault,
        totalAssets
    } = useGlobalStore();

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

    const getSender = () => {
        if (!wallet) return alert("Wallet not connected")
        const addressInput = {bits: wallet.address.toB256()}
        const addressIdentityInput = { Address: addressInput };

        return addressIdentityInput
    }

    const HandleSupply = async () => {
        if (useCollateralChecked) return await depositCollateral(new BN(inputValue), "0x1298fadaa13d3203c686f4f7b4a110d9b5e01ef30a5eed39bc8d439d68106eab");
        
        return await depositAsset(new BN(inputValue), "0x1298fadaa13d3203c686f4f7b4a110d9b5e01ef30a5eed39bc8d439d68106eab")
    }


    return (<div style={{fontSize: "28px"}}>
        <div style={{display: "flex", justifyContent: "end", alignItems: "center", }}>
            <p className="m-2">Use Collateral</p>
            <MySwitch ticked={useCollateralChecked} setTicked={setUseCollateralChecked}/>
        </div>
        <div>
            <p>Amount</p>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #333", padding: "4px"}}>
                <p>
                    <input
                        type="number"
                        placeholder="0.0"
                        style={{width: "200px", height: "52px", color: "black", padding: "4px 8px", borderRadius: "8px"}}
                        className="no-spinner"
                        value={inputValue}
                        onChange={handleInputChange}
                        />
                </p>
                <select
                    value={selectValue}
                    onChange={e => setSelectValue(e.target.value)}
                    style={{width: "240px", color: "#333", padding: "8px", borderRadius: "8px"}}>{
                    keys.map(key => <option value={key} key={key}>{key}</option>)
                }</select>
            </div>
            <div style={{textAlign: "right", padding: "0px 8px"}}>{options[selectValue].walletBalance} USD</div>
            <div style={{padding: "8px", border: "2px solid #333", borderRadius: "16px"}}>
                <h1>Details</h1>
                <div style={{marginTop: "16px", display: "flex", justifyContent: "space-between"}}>
                    <p>Deposit Value</p>
                    <p>${options[selectValue].depositValue}</p>
                </div>
                <div style={{marginTop: "16px", display: "flex", justifyContent: "space-between"}}>
                    <p>Supply APY</p>
                    <p>{options[selectValue].supplyAPY}%</p>
                </div>
                <div style={{padding: "0px 8px", height: "4px", margin: "8px 0px", backgroundColor: "#555"}}></div>
                <div style={{marginTop: "16px", display: "flex", justifyContent: "space-between"}}>
                    <p>Health factor</p>
                    <p>{options[selectValue].healthFactor}</p>
                </div>
                <div style={{marginTop: "16px", display: "flex", justifyContent: "space-between"}}>
                    <p>Time to liquidation</p>
                    <p>{options[selectValue].timeToLiquidation}</p>
                </div>
            </div>
            <div style={{textAlign: "right"}}>
                <button style={{backgroundColor: "#373", padding: "8px 16px", marginTop: "8px", borderRadius: "8px"}} onClick={HandleSupply}>Supply</button>
            </div>
        </div>
    </div>);
}

export default SupplyDialog;