import { useState } from "react";

import UsersTable from "./UsersTable";
import VaultCreatorsTable from "./VaultCreatorsTable";
import { generateUsersRows, generateVaultRows } from "@/helpers/generator";

export default function Leaderboard(){

    const [onUsers, setOnUsers] = useState(true);

    const userHeaders: string[] = ["Rank", "Wallet", "Experience Points(XP)"];
    const vaultHeaders: string[] = ["Rank", "Wallet", "Number of vaults", "Vault creator XP(vcXP)"];

    return (
        <div className="p-4">
            <div
                style={{fontSize: "20px", borderBottom: "1px solid rgb(100, 100, 100)"}} 
                >
                <button
                    style={{height: "60px", color: onUsers ? "rgba(0, 255, 255, 0.5)" : "rgba(100, 100, 100)", borderBottom: onUsers ? "1px solid rgba(0, 255, 255, 0.8)" : "none", width: "200px"}}
                    onClick={() => setOnUsers(true)}>
                    Users
                </button>
                <button
                    style={{height: "60px", marginLeft: "96px", color: onUsers ? "rgba(100, 100, 100)" : "rgba(0, 255, 255, 0.5)",  borderBottom: onUsers ? "none" : "1px solid rgba(0, 255, 255, 0.8)", width: "200px"}}
                    onClick={() => setOnUsers(false)}>
                    Vault Creators
                </button>
            </div>
            <div className="p-4">{
                onUsers ? <UsersTable rows={generateUsersRows()} headers={userHeaders}/> : <VaultCreatorsTable rows={generateVaultRows()} headers={vaultHeaders} />
            }</div>
        </div>);
};