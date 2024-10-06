import Homelander from "../../images/homelander.png";
import Stormfront from "../../images/storm.jpg";
import QueenMaeve from "../../images/queen_maeve.png";
import BlackNoir from "../../images/black_noir.png";
import ATrain from "../../images/a_train.png";
import Translucent from "../../images/translucent.png";
import TheDeep from "../../images/the_deep.jpg";
import Starlight from "../../images/start_light.png";
import Lamplighter from "../../images/lamplighter.png";
import Jupiter from "../../images/jupiter.png";
import Eagle from "../../images/eagle.png";
import Popclaw from "../../images/popclaw.jpg";

type ImageMap = {
    [key: string]: string;
};

const imageRef: ImageMap = {
    "Homelander": Homelander,
    "Stormfront": Stormfront,
    "Queen Maeve": QueenMaeve,
    "Black Noir": BlackNoir,
    "A-Train": ATrain,
    "Translucent": Translucent,
    "The Deep": TheDeep,
    "Starlight": Starlight,
    "Lamplighter": Lamplighter,
    "Jack from Jupiter": Jupiter,
    "Eagle the Archer": Eagle,
    "Popclaw":  Popclaw
};


const barsIcon = <svg aria-hidden="true" width="12px" style={{display: "inline", margin: "0px 0px 4px 8px"}} focusable="false" data-prefix="far" data-icon="bars-filter" className="svg-inline--fa fa-bars-filter icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 88C0 74.7 10.7 64 24 64H424c13.3 0 24 10.7 24 24s-10.7 24-24 24H24C10.7 112 0 101.3 0 88zM64 248c0-13.3 10.7-24 24-24H360c13.3 0 24 10.7 24 24s-10.7 24-24 24H88c-13.3 0-24-10.7-24-24zM288 408c0 13.3-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24h80c13.3 0 24 10.7 24 24z"></path></svg>;

interface MyComponentProps {
    rows: string[][],
    headers: string[],
};

const SupesTable: React.FC<MyComponentProps> = ({rows, headers}) => {
    return (
        <div className="w-full flex justify-center text-xl text-left">
            <table style={{borderCollapse: "separate", borderSpacing: "0", borderRadius: "8px"}}>
                <thead style={{backgroundColor: "#0c1d2f", color: "#aaa" }}>
                    <tr className="my-4">{
                        headers.map((header, j) => 
                            <th key={j} className="p-6 py-4" style={{borderRadius: j === 0 ? "16px 0px 0px 0px" : "0px"}}>
                                {header}
                                {j !== 1 ? barsIcon : ""}
                            </th>)
                        }
                    </tr>
                </thead>
                <tbody>{
                    rows.map((row, index) => (
                        <tr key={index}>
                            {
                                row.map((data, i) => 
                                    <td key={i} style={{borderBottom: "2px solid black", padding: "16px 48px", position: "relative", minWidth: "80px", height: "96px"}}>
                                        {i === 2 ? <img src={imageRef[row[2]]} alt="logo" style={{display: "inline", marginRight: "8px", width:"28px", height: "28px", borderRadius: "50%"}}/> : ""}
                                        <span>{data}</span>
                                    </td>)
                            }
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

export default SupesTable;