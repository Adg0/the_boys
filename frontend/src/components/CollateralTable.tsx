import { generateUseRows } from "@/helpers/generator";
import { useState } from "react";

import Aave from "../../images/aave.png";
import Alpha from "../../images/alpha_homora.png";
import Anchor from "../../images/anchor_protocol.jpg";
import Apostro from "../../images/apostro_lido.png";
import Badger from "../../images/badger_dao.png";
import Euler from "../../images/euler_prime_usdc.png";
import Ren from "../../images/ren_vm.png";
import Stable from "../../images/stable_coin.png";
import Sushi from "../../images/sushi_swap.png";

type ImageMap = {
    [key: string]: string;
};

const imageRef: ImageMap = {
    "Euler Prime USDC": Euler,
    "Stablecoin Maxi USDC": Stable,
    "Apostro Lido Ecosystem": Apostro,
    "Aave": Aave,
    "SushiSwap": Sushi,
    "RenVM": Ren,
    "Anchor Protocol": Anchor,
    "Badger DAO": Badger,
    "Alpha Homora": Alpha
};

const commonHeaders = ["LLTV", "Max LTV", "Vault address"];
const usedByHeaders = ["Collateral", ...commonHeaders];
const usingHeaders = ["Lend", ...commonHeaders];

const usedByRows: string[][] = generateUseRows();
const usingRows: string[][] = generateUseRows();

const UsedByThisVault = () => {
    return (<div className="w-full flex justify-center text-xl text-left">
        <table style={{borderCollapse: "separate", borderSpacing: "0", borderRadius: "16px", border: "2px solid rgb(0, 50, 50)", width: "90%"}}>
            
            <thead style={{backgroundColor: "#0c1d2f", color: "#aaa" }}>
                <tr className="my-4">{
                    usedByHeaders.map((header, j) => 
                        <th key={j} className="p-6 py-4" style={{padding: "16px 48px", borderRadius: j === 0 ? "16px 0px 0px 0px" : "0px", width: j === 0 ? "500px" : "auto"}}>
                            {header}
                        </th>)
                    }
                </tr>
            </thead>
            <tbody>{
                usedByRows.map((row, index) => (
                    <tr key={index}>
                        {
                            row.map((data, i) => 
                                <td key={i} style={{borderBottom: "2px solid black", padding: "16px 48px", position: "relative", minWidth: "80px", height: "96px", color: i === 3 ? "rgb(32, 192, 155)" : "white"}}>
                                    {i === 0 ? <img src={imageRef[row[0]]} alt="logo" style={{display: "inline", marginRight: "8px", width:"24px", height: "24px", borderRadius: "50%"}}/> : ""}
                                    <span>{data}</span>
                                </td>)
                        }
                    </tr>
                ))
            }</tbody>
            <tfoot>
                <tr>
                    <td colSpan={9} style={{height: "72px", backgroundColor: "#0c1d2f", border: "1px solid transparent", borderRadius: "0px 0px 24px 24px"}}></td>
                </tr>
            </tfoot>
        </table>
    </div>);
};

const UsingThisVault = () => {
    return (<div className="w-full flex justify-center text-xl text-left">
        <table style={{borderCollapse: "separate", borderSpacing: "0", borderRadius: "16px", border: "2px solid rgb(0, 50, 50)", width: "90%"}}>
            
            <thead style={{backgroundColor: "#0c1d2f", color: "#aaa" }}>
                <tr className="my-4">{
                    usingHeaders.map((header, j) => 
                        <th key={j} className="p-6 py-4" style={{padding: "16px 48px", borderRadius: j === 0 ? "16px 0px 0px 0px" : "0px", width: j === 0 ? "500px" : "auto"}}>
                            {header}
                        </th>)
                    }
                </tr>
            </thead>
            <tbody>{
                usingRows.map((row, index) => (
                    <tr key={index}>
                        {
                            row.map((data, i) => 
                                <td key={i} style={{borderBottom: "2px solid black", padding: "16px 48px", position: "relative", minWidth: "80px", height: "96px", color: i === 3 ? "rgb(32, 192, 155)" : "white"}}>
                                    {i === 0 ? <img src={imageRef[row[0]]} alt="logo" style={{display: "inline", marginRight: "8px", width:"24px", height: "24px", borderRadius: "50%"}}/> : ""}
                                    <span>{data}</span>
                                </td>)
                        }
                    </tr>
                ))
            }</tbody>
            <tfoot>
                <tr>
                    <td colSpan={9} style={{height: "72px", backgroundColor: "#0c1d2f", border: "1px solid transparent", borderRadius: "0px 0px 24px 24px"}}></td>
                </tr>
            </tfoot>
        </table>
    </div>);
};

const buttonStyle: {[key: string]: string} = { display: "flex", flexDirection: "row", gap: "4px", alignItems: "center", justifyContent: "center", padding: "4px 12px", fontSize: "16px", borderRadius: "16px"};

const CollateralTable = () => {

    const [usedByThisVaultSelected, setUsedByThisValultSelected] = useState(true);

    return (<div style={{backgroundColor: "rgb(12, 29, 47)", margin: "32px", borderRadius: "16px", border: "1px solid rgb(20, 48, 78", }}>
        <div style={{  padding: "16px 8px", }}>
            <p style={{fontSize: "24px", margin: "8px", padding: "8px"}}>Collateral</p>
        </div>
        <div style={{height: "2px", backgroundColor: "rgb(20, 48, 78)"}}></div>
        <div style={{height: "100px"}}>
            <div style={{display: "inline-flex", margin: "24px 0px 0px 16px", padding: "8px", background: "rgb(4, 10, 16)", borderRadius: "40px", outline: "rgb(12, 29, 47) solid 1px", marginBottom: "12px"}}>
                <button
                    style={{ ...buttonStyle, backgroundColor: usedByThisVaultSelected ? "#23384d" : "transparent",}}
                    onClick={() => setUsedByThisValultSelected(true)}>
                    Used by this vault
                    <span style={{display: "inline-flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", width: "24px", height: "24px", background: "white", borderRadius: "50%", color: "black"}}>6</span>
                </button>
                <button
                    style={{...buttonStyle, backgroundColor: usedByThisVaultSelected ? "transparent" : "#23384d",}}
                    onClick={() => setUsedByThisValultSelected(false)}>
                    Using this vault
                    <span style={{display: "inline-flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", width: "24px", height: "24px", background: "white", borderRadius: "50%", color: "black"}}>4</span>
                </button>
            </div>
        </div>
        <div style={{marginBottom: "40px"}}>{usedByThisVaultSelected ? <UsedByThisVault /> : <UsingThisVault /> }</div>
    </div>);
};

export default CollateralTable;