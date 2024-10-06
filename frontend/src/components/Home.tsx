
import { generateMarketRows } from "@/helpers/generator";

import MarketTable from "./MarketTable";
import TopGraphics from "./TopGraphics";
import Drawer from "./Drawer";

import useProjectStore from "@/stores/project_store";

export default function Home(){

    const { projects } = useProjectStore();

    const rows = generateMarketRows(projects, 5);
    const headers = ["Asset", "Supply APY", "In Wallet", "Total Supply", "Total Borrow", "Borrow APY", "Utilization"];
    
    return (
        <div className="p-4">
            <Drawer />
            <TopGraphics showLogo={true} slogan="Join the DeFi Revolution (Before It's Over)" />
            <MarketTable rows={rows} headers={headers} />
        </div>
    );
}