
import { generateRows } from "@/helpers/generator";

import MarketTable from "./MarketTable";

export default function Home(){
    const rows = generateRows();
    const headers = ["Lend", "Points", "Supply APY", "In Wallet", "Total Supply", "Total Borrow", "Utilization"];
    
    return (
        <div className="p-4">
            <MarketTable rows={rows} headers={headers} />
        </div>
    );
}