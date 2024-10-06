import { useState } from "react";

import useProjectStore from "@/stores/project_store";

import { DialogTitle } from "./ui/dialog";

interface MyComponentProps {
    product: string,
};

const BorrowDialog:React.FC<MyComponentProps> = ({product}) => {

    const [selectValue, setSelectValue] = useState(product);
    const [onBorrow, setOnBorrow] = useState(true);

    const { options } = useProjectStore();
    const keys: string[] = Object.keys(options);

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
                <button style={{backgroundColor: "#373", padding: "8px 16px", marginTop: "8px", borderRadius: "8px"}}>{onBorrow ? "Borrow" : "Repay"}</button>
            </div>
        </div>
    </div>);
}

export default BorrowDialog;