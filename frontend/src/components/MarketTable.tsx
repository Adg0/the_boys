import Euler from "../../images/euler_prime_usdc.png";
import Tether from "../../images/tether.png";
import Ethereum from "../../images/ethereum.svg";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
import SupplyDialog from "./SupplyDialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import BorrowDialog from "./BorrowDialog";

type ImageMap = {
    [key: string]: string;
};

const imageRef: ImageMap = {
    "USD Coin": Euler,
    "USD Tether": Tether,
    "Ethereum": Ethereum,
};

interface MyComponentProps {
    rows: string[][],
    headers: string[],
};

const barsIcon = <svg aria-hidden="true" width="12px" style={{display: "inline", margin: "0px 0px 4px 8px"}} focusable="false" data-prefix="far" data-icon="bars-filter" className="svg-inline--fa fa-bars-filter icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 88C0 74.7 10.7 64 24 64H424c13.3 0 24 10.7 24 24s-10.7 24-24 24H24C10.7 112 0 101.3 0 88zM64 248c0-13.3 10.7-24 24-24H360c13.3 0 24 10.7 24 24s-10.7 24-24 24H88c-13.3 0-24-10.7-24-24zM288 408c0 13.3-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24h80c13.3 0 24 10.7 24 24z"></path></svg>;
const arrowsIcon = <svg aria-hidden="true" width="18px"  style={{display: "inline", margin: "0px 0px 4px 8px"}} focusable="false" data-prefix="far" data-icon="sliders-simple" className="svg-inline--fa fa-sliders-simple " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M80 336a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm76.3 8L488 344c13.3 0 24 10.7 24 24s-10.7 24-24 24l-331.7 0c-10.2 32.5-40.5 56-76.3 56c-44.2 0-80-35.8-80-80s35.8-80 80-80c35.8 0 66.1 23.5 76.3 56zM400 144a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm-44.3-24c10.2-32.5 40.5-56 76.3-56c44.2 0 80 35.8 80 80s-35.8 80-80 80c-35.8 0-66.1-23.5-76.3-56L24 168c-13.3 0-24-10.7-24-24s10.7-24 24-24l331.7 0z"></path></svg>;

const buttonStyle = {width: "96px", border: "1px solid #10263e", padding: "4px 16px", borderRadius: "16px", backgroundColor: "#10263e"};

const MarketTable: React.FC<MyComponentProps> = ({headers, rows}) => {

    const navigate = useNavigate();
    
    return (
        <div className="w-full flex justify-center text-xl text-left">
            <table style={{borderCollapse: "separate", borderSpacing: "0", borderRadius: "8px"}}>
                <thead style={{backgroundColor: "#0c1d2f", color: "#aaa" }}>
                    <tr className="my-4">{
                        headers.map((header, j) => 
                            <th key={j} className="p-6 py-4 market-heading" style={{borderRadius: j === 0 ? "16px 0px 0px 0px" : "0px"}}>
                                {header}
                                {barsIcon}
                            </th>)
                        }
                        <th className="p-6 py-4 market-heading" style={{borderRadius: "0px 16px 0px 0px"}}>
                            <span style={buttonStyle}>Actions</span>
                            {arrowsIcon}
                        </th>
                    </tr>
                </thead>
                <tbody>{
                    rows.map((row, index) => (
                        <tr key={index}>
                            {
                                row.map((data, i) => 
                                    <td key={i}
                                        className="p-6 py-4 market-data"
                                        style={{borderBottom: "2px solid black", position: "relative", minWidth: "80px", height: "96px"}}>
                                        {i === 0 ? <img src={imageRef[row[0]]} alt="logo" style={{display: "inline", marginRight: "8px", width:"24px", height: "24px", borderRadius: "50%"}}/> : ""}
                                        <span>{i === 0 ? <button onClick={() => navigate("/vault_details", {state: {row}})}>{data}</button> : data}</span>
                                        {i === 6 ? <div style={{width: "24px", height: "24px", display: "inline-block", position: "absolute", right: "16px"}}>
                                            <CircularProgressbar value={parseFloat(row[6].slice(0, row[6].length-1))} text={""} styles={buildStyles({pathColor: "#00ffff", trailColor: "#444"})}/>
                                        </div> : ""}
                                    </td>)
                            }
                            <td
                                className="p-6 py-4 market-data"
                                style={{borderBottom: "2px solid black", minWidth: "80px", height: "96px"}}>
                                <span style={{...buttonStyle, border: "1px solid rgba(0, 255, 255, 0.25)", fontSize: "14px", padding: "8px 16px", fontWeight: "bold"}} className="hover:bg-gray-600 text-sm">
                                    <Dialog>
                                        <DialogTrigger>Supply</DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle><p style={{fontSize: "28px"}}>Supply</p></DialogTitle>
                                            <SupplyDialog product={row[0]} />
                                        </DialogContent>
                                    </Dialog>
                                </span>
                                <span style={{...buttonStyle, border: "1px solid rgba(0, 255, 255, 0.25)", fontSize: "14px", padding: "8px 16px", fontWeight: "bold", marginLeft: "12px"}} className="hover:bg-gray-600 text-sm">
                                    <Dialog>
                                        <DialogTrigger>Borrow</DialogTrigger>
                                        <DialogContent>
                                            <BorrowDialog product={row[0]} />
                                        </DialogContent>
                                    </Dialog>
                                </span>
                            </td>
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

export default MarketTable;

