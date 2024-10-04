
import { generateMarketRows } from "@/helpers/generator";

import MarketTable from "./MarketTable";
import TopGraphics from "./TopGraphics";
import Drawer from "./Drawer";

export default function Home(){
    const rows = generateMarketRows();
    const headers = ["Asset", "Supply APY", "In Wallet", "Total Supply", "Total Borrow", "Borrow APY", "Utilization"];
    
    return (
        <div className="p-4">
            <Drawer />
            <TopGraphics showLogo={true} />
            <MarketTable rows={rows} headers={headers} />
        </div>
    );
}