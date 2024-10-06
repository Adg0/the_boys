import { useState } from "react";

import useProjectStore from "@/stores/project_store";

import MySwitch from "./MySwitch";

interface MyComponentProps {
    product: string,
};

const SupplyDialog:React.FC<MyComponentProps> = ({product}) => {

    const [useCollateralChecked, setUseCollateralChecked] = useState(false);
    const [selectValue, setSelectValue] = useState(product);

    const { options } = useProjectStore();
    const keys: string[] = Object.keys(options);

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
                        className="no-spinner"/>
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
                <button style={{backgroundColor: "#373", padding: "8px 16px", marginTop: "8px", borderRadius: "8px"}}>Supply</button>
            </div>
        </div>
    </div>);
}

export default SupplyDialog;