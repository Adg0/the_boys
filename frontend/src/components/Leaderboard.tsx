import { useState } from "react";

import SupesTable from "./SupesTable";
import TempV from "./TempV";
import { generateSupesRows, generateTheBoysRows } from "@/helpers/generator";
import TopGraphics from "./TopGraphics";

export default function Leaderboard(){

    const [onSupes, setOnSupes] = useState(true);

    const supeHeaders: string[] = ["Rank", "Wallet", "Tag", "compV"];
    const theBoysHeaders: string[] = ["Rank", "Wallet", "Tag", "Neutralized supes", "tempV"];

    return (
        <div className="p-4">
            <TopGraphics />
            <div
                style={{fontSize: "20px", borderBottom: "1px solid rgb(100, 100, 100)"}} 
                >
                <button
                    style={{height: "60px", color: onSupes ? "rgba(0, 255, 255, 0.5)" : "rgba(100, 100, 100)", borderBottom: onSupes ? "1px solid rgba(0, 255, 255, 0.8)" : "none", width: "200px"}}
                    onClick={() => setOnSupes(true)}>
                    Supes
                </button>
                <button
                    style={{height: "60px", marginLeft: "96px", color: onSupes ? "rgba(100, 100, 100)" : "rgba(0, 255, 255, 0.5)",  borderBottom: onSupes ? "none" : "1px solid rgba(0, 255, 255, 0.8)", width: "200px"}}
                    onClick={() => setOnSupes(false)}>
                    The Boys
                </button>
            </div>
            <div className="p-4">{
                onSupes ? <SupesTable rows={generateSupesRows()} headers={supeHeaders}/> : <TempV rows={generateTheBoysRows()} headers={theBoysHeaders} />
            }</div>
        </div>);
};