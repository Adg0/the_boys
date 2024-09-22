import Aave from "../../images/aave.png";
import Alpha from "../../images/alpha_homora.png";
import Anchor from "../../images/anchor_protocol.jpg";
import Apostro from "../../images/apostro_lido.png";
import Badger from "../../images/badger_dao.png";
import Euler from "../../images/euler_prime_usdc.png";
import Ren from "../../images/ren_vm.png";
import Stable from "../../images/stable_coin.png";
import Sushi from "../../images/sushi_swap.png";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

import { Button } from "./ui/button";

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

interface MyComponentProps {
    rows: string[][],
    headers: string[],
};

const barsIcon = <svg aria-hidden="true" width="12px" style={{display: "inline", margin: "0px 0px 4px 8px"}} focusable="false" data-prefix="far" data-icon="bars-filter" className="svg-inline--fa fa-bars-filter icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 88C0 74.7 10.7 64 24 64H424c13.3 0 24 10.7 24 24s-10.7 24-24 24H24C10.7 112 0 101.3 0 88zM64 248c0-13.3 10.7-24 24-24H360c13.3 0 24 10.7 24 24s-10.7 24-24 24H88c-13.3 0-24-10.7-24-24zM288 408c0 13.3-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24h80c13.3 0 24 10.7 24 24z"></path></svg>;

const MarketTable: React.FC<MyComponentProps> = ({headers, rows}) => {
    
    return (
        <div className="w-full flex justify-center text-lg text-left">
            <table style={{borderCollapse: "separate", borderSpacing: "0", borderRadius: "8px"}}>
                <thead style={{backgroundColor: "#0c1d2f", color: "#aaa" }}>
                    <tr className="my-4">{
                        headers.map((header, j) => 
                            <th className="p-12 py-4" style={{borderRadius: j === 0 ? "16px 0px 0px 0px" : "0px"}}>
                                {header}{j !== 1 ? barsIcon : ""}
                            </th>)
                        }
                        <th className="p-12 py-4" style={{borderRadius: "0px 16px 0px 0px"}}>Edit Table</th>
                    </tr>
                </thead>
                <tbody>{
                    rows.map(row => (
                        <tr >
                            {
                                row.map((data, i) => 
                                    <td style={{borderBottom: "2px solid black", padding: "16px 48px", position: "relative", minWidth: "80px", height: "96px"}}>
                                        {i === 0 ? <img src={imageRef[row[0]]} alt="logo" style={{display: "inline", marginRight: "8px", width:"24px", height: "24px", borderRadius: "50%"}}/> : ""}
                                        <span>{data}</span>
                                        {i === 6 ? <div style={{width: "24px", height: "24px", display: "inline-block", position: "absolute", right: "16px"}}>
                                            <CircularProgressbar value={parseFloat(row[6].slice(0, row[6].length-1))} text={""} styles={buildStyles({pathColor: "#00ffff", trailColor: "#444"})}/>
                                        </div> : ""}
                                    </td>)
                            }
                            <td style={{borderBottom: "2px solid black", padding: "16px 48px",  minWidth: "80px", height: "96px"}}>
                                <Button>Supply</Button>
                                <Button>Borrow</Button>
                            </td>
                        </tr>
                    ))
                }</tbody>
            </table>
        </div>);
};

export default MarketTable;