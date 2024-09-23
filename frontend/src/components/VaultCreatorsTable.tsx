import { Button } from "./ui/button";

const barsIcon = <svg aria-hidden="true" width="12px" style={{display: "inline", margin: "0px 0px 4px 8px"}} focusable="false" data-prefix="far" data-icon="bars-filter" className="svg-inline--fa fa-bars-filter icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 88C0 74.7 10.7 64 24 64H424c13.3 0 24 10.7 24 24s-10.7 24-24 24H24C10.7 112 0 101.3 0 88zM64 248c0-13.3 10.7-24 24-24H360c13.3 0 24 10.7 24 24s-10.7 24-24 24H88c-13.3 0-24-10.7-24-24zM288 408c0 13.3-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24h80c13.3 0 24 10.7 24 24z"></path></svg>;
const buttonStyle = {width: "120px", border: "1px solid #10263e", padding: "4px 16px", borderRadius: "16px", backgroundColor: "#10263e"};

interface MyComponentProps {
    rows: string[][],
    headers: string[],
};

const VaultCreatorsTable: React.FC<MyComponentProps> = ({rows, headers}) => {
    return (
        <div className="w-full flex justify-center text-lg text-left">
            <table style={{borderCollapse: "separate", borderSpacing: "0", borderRadius: "8px"}}>
                <thead style={{backgroundColor: "#0c1d2f", color: "#aaa" }}>
                    <tr className="my-4">{
                        headers.map((header, j) => 
                            <th key={j} className="p-12 py-4" style={{borderRadius: j === 0 ? "16px 0px 0px 0px" : "0px"}}>
                                {header}
                                {j !== 1 ? barsIcon : ""}
                            </th>)
                        }
                        <th className="p-12 py-4" style={{borderRadius: "0px 16px 0px 0px"}}>
                        </th>
                    </tr>
                </thead>
                <tbody>{
                    rows.map((row, index) => (
                        <tr key={index}>
                            {
                                row.map((data, i) => 
                                    <td key={i} style={{borderBottom: "2px solid black", padding: "16px 48px", position: "relative", minWidth: "80px", height: "96px"}}>
                                        <span>{data}</span>
                                    </td>)
                            }
                            <td style={{borderBottom: "2px solid black", padding: "16px 48px",  minWidth: "80px", height: "96px"}}>
                                <Button style={{...buttonStyle, border: "1px solid rgba(0, 255, 255, 0.25)"}} className="hover:bg-gray-600">Vidw Portfolio</Button>
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

export default VaultCreatorsTable;