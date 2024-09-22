
import { generateRows } from "@/helpers/generator";
// import {
//     Table,
//     TableBody,
//     TableCaption,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
//   } from "@/components/ui/table";
// import { Button } from "./ui/button";

import MarketTable from "./MarketTable";

export default function Home(){
    const rows = generateRows();
    const headers = ["Lend", "Points", "Supply APY", "In Wallet", "Total Supply", "Total Borrow", "Utilization"];
    
    return (
        <div className="p-4">

            {/* <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader style={{backgroundColor: "#0c1d2f"}}>
                    <TableRow>
                        <TableHead>Lend</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Suppy APY</TableHead>
                        <TableHead>In Wallet</TableHead>
                        <TableHead>Total Supply</TableHead>
                        <TableHead>Total Borrow</TableHead>
                        <TableHead>Utilization</TableHead>
                        <TableHead>
                            <Button> Edit Table </Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        rows.map((row, i) => (
                            <TableRow key={i}>
                                {
                                    row.map((data, j) => <TableCell key={j}>{data}</TableCell>)
                                }
                                <TableCell>
                                    <Button>Supply</Button>
                                    <Button className="ml-2">Borrow</Button>
                                </TableCell>
                            </TableRow>))
                    }
                </TableBody>
            </Table> */}
            <MarketTable rows={rows} headers={headers} />
        </div>
    );
}