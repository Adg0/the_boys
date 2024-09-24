
import { generateMarketRows } from "@/helpers/generator";

import MarketTable from "./MarketTable";
import TopGraphics from "./TopGraphics";
import Drawer from "./Drawer";
import SupplyDialog from "./SupplyDialog";

export default function Home(){
    const rows = generateMarketRows();
    const headers = ["Asset", "Supply APY", "In Wallet", "Total Supply", "Total Borrow", "Total APY", "Utilization"];
    
    return (
        <div className="p-4">
            <TopGraphics />
            <MarketTable rows={rows} headers={headers} />
            <Drawer />
            <SupplyDialog />
        </div>
    );
}