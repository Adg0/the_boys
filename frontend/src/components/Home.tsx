
import { generateMarketRows } from "@/helpers/generator";

import MarketTable from "./MarketTable";

export default function Home(){
    const rows = generateMarketRows();
    const headers = ["Asset", "Supply APY", "In Wallet", "Total Supply", "Total Borrow", "Total APY", "Utilization"];
    
    return (
        <div className="p-4">
            <MarketTable rows={rows} headers={headers} />
        </div>
    );
}