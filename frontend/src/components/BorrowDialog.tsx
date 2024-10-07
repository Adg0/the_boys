import { useState } from "react";

import useProjectStore from "@/stores/project_store";

import { DialogTitle } from "./ui/dialog";

import { arrayify, BigNumberish, BN, hexlify } from "fuels";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStore, useSetupContracts } from "@/hooks/use-contracts";

interface MyComponentProps {
    product: string,
};

const BorrowDialog:React.FC<MyComponentProps> = ({product}) => {

    const [selectValue, setSelectValue] = useState(product);
    const [onBorrow, setOnBorrow] = useState(true);

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

    const repayAsset = async (amount: BN, assetId: string, borrowAssetId: string) => {}

    const getSender = () => {
        if (!wallet) return alert("Wallet not connected")
        const addressInput = {bits: wallet.address.toB256()}
        const addressIdentityInput = { Address: addressInput };

        return addressIdentityInput
    }

    const HandleBorrow = async () => {
        if (onBorrow) return await borrowAsset(new BN(inputValue), "0x1298fadaa13d3203c686f4f7b4a110d9b5e01ef30a5eed39bc8d439d68106eab", "0x84e5f0e47a98492fb297a607d53e1f3a8e564274b8fd5afa6e53772dd413455a");
        return await repayAsset(new BN(inputValue), "0x1298fadaa13d3203c686f4f7b4a110d9b5e01ef30a5eed39bc8d439d68106eab", "0x84e5f0e47a98492fb297a607d53e1f3a8e564274b8fd5afa6e53772dd413455a");
    }

    return (<div style={{fontSize: "28px"}}>
        
        <DialogTitle>
            <div style={{display: "flex", height: "80px", marginTop: "16px", marginBottom: "16px", padding: "8px"}}>
                <div style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center", fontSize: "32px"}}>
                    <button onClick={() => setOnBorrow(true)} style={{color: onBorrow ? "rgb(100, 220, 80)" : "gray"}}>Borrow</button>
                </div>
                <div style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center", fontSize: "32px", borderLeft: "2px solid white",}}>
                    <button onClick={() => setOnBorrow(false)} style={{color: onBorrow ? "gray" : "rgb(100, 220, 80)"}}>Repay</button>
                </div>
            </div>
        </DialogTitle>

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
                        onChange={handleInputChange}/>
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
                    <p>Total loan value</p>
                    <p>$0.00</p>
                </div>
                <div style={{marginTop: "16px", display: "flex", justifyContent: "space-between"}}>
                    <p>Total supply value</p>
                    <p>0.00</p>
                </div>
                <div style={{marginTop: "24px", display: "flex", justifyContent: "space-between"}}>
                    <p>Borrow APY</p>
                    <p>0.22%</p>
                </div>
                <div style={{padding: "0px 8px", height: "4px", margin: "8px 0px", backgroundColor: "#555"}}></div>
                <div style={{marginTop: "16px", display: "flex", justifyContent: "space-between"}}>
                    <p>Health factor</p>
                    <p>{options[selectValue].healthFactor}</p>
                </div>
            </div>
            <div style={{textAlign: "right"}}>
                <button style={{backgroundColor: "#373", padding: "8px 16px", marginTop: "8px", borderRadius: "8px"}} onClick={HandleBorrow}>{onBorrow ? "Borrow" : "Repay"}</button>
            </div>
        </div>
    </div>);
}

export default BorrowDialog;