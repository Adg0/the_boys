

import { useLocation } from "react-router-dom";
import TopGraphics from "./TopGraphics";

import Euler from "../../images/euler_prime_usdc.png";
import Tether from "../../images/tether.png";
import Ethereum from "../../images/ethereum.svg";

import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import SupplyDialog from "./SupplyDialog";
import BorrowDialog from "./BorrowDialog";
import CollateralTable from "./CollateralTable";
import VaultConfiguration from "./VaultConfiguration";

type ImageMap = {
    [key: string]: string;
};

const imageRef: ImageMap = {
    "USD Coin": Euler,
    "USD Tether": Tether,
    "Ethereum": Ethereum,
};

const imageRefKeys = Object.keys(imageRef);

const VaultDetails = () => {

    const location = useLocation();
    const row = location.state?.row;
    const [asset, supplyAPY, inWallet, totalSupply, totalBorrow, borrowAPY, utilization] = row;

    const Contents = () => {
        return (<div>
            <div style={{marginLeft: "350px", paddingTop: "150px"}}>
                <div style={{display: "inline-flex", alignItems: "center"}}>
                    <div>
                        <img src={imageRef[row[0]]} alt="logo" style={{display: "inline", margin: "8px 24px 0px 24px", width:"48px", height: "48px", borderRadius: "50%"}}/>
                    </div>
                    <p style={{fontSize: "64px"}}>{asset.slice(0, 16)}</p>
                </div>
                <div style={{ position: "absolute", top: "0px", left: "1000px", display: "inline", width: "750px", height: "400px", borderRadius: "24px", border: "2px solid rgba(0, 50, 50, 1)", backgroundColor: "#0c1d2f"}}>
                    <div style={{ marginLeft: "24px", marginTop: "32px"}}>
                        <div style={{display: "flex", justifyContent: "space-between", fontSize: "20px", color: "rgb(114, 131, 149)"}}>
                            <p style={{flex: 1}}>Total Supply</p>
                            <p style={{flex: 1}}>Supply APY</p>
                            <p style={{flex: 1}}>exposure</p>
                        </div>
                        
                        <div style={{display: "flex", justifyContent: "space-between", marginTop: "16px", color: "rgb(240, 240, 220)", fontSize: "24px"}}>
                            <p style={{flex: 1}}>{totalSupply}</p>
                            <p style={{flex: 1}}>{supplyAPY}</p>
                            <p style={{flex: 1}}>{imageRefKeys.slice(0, 5).map(key => <img key={key} src={imageRef[key]} width="20px" height="20px" style={{display: "inline", borderRadius: "50%"}}/>)}</p>
                        </div>

                        <div style={{display: "flex", justifyContent: "space-between", marginTop: "48px", fontSize: "20px", color: "rgb(114, 131, 149)",}}>
                            <p style={{flex: 1}}>Total Borrow</p>
                            <p style={{flex: 1}}>Borrow APY</p>
                            <p style={{flex: 1}}>Utilization</p>
                        </div>
                        
                        <div style={{display: "flex", justifyContent: "space-between", marginTop: "16px", color: "rgb(240, 240, 220)", fontSize: "24px"}}>
                            <p style={{flex: 1}}>{totalBorrow}</p>
                            <p style={{flex: 1}}>{borrowAPY}</p>
                            <p style={{flex: 1}}>{utilization}</p>
                        </div>
                    </div>
                    <div style={{height: "2px", backgroundColor: "rgba(114, 131, 149, 0.5)", marginTop: "24px"}}></div>
                    <div style={{display: "flex", justifyContent: "space-between", fontSize: "20px", marginTop: "24px"}}>
                        
                            <Dialog>
                                <DialogTrigger style={{width: "40%"}}>
                                    <button style={{width: "100%", margin: "24px", padding: "8px 24px", backgroundColor: "rgb(16, 38, 62)", color: "rgb(221, 251, 244)", fontWeight: "bold", borderRadius: "8px"}}>
                                        Borrow    
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <BorrowDialog product={asset} />
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger style={{width: "40%", marginRight: "20px"}}>
                                    <button style={{width: "100%",  padding: "8px 24px", backgroundColor: "rgb(35, 192, 155)", color: "black", fontWeight: "bold", borderRadius: "8px"}}>
                                        Supply
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle><p style={{fontSize: "28px"}}>Supply</p></DialogTitle>
                                    <SupplyDialog product={asset} />
                                </DialogContent>
                            </Dialog>
                    </div>
                </div>
            </div>
            <div style={{marginTop: "200px"}}>
                <CollateralTable/>
                <VaultConfiguration />
            </div>
        </div>);
    };

    return (<div>
        <div className="relative">
            <div style={{position: "absolute", top: "0", left: "0", width: "100%", zIndex: "-1"}}>
                <TopGraphics showLogo={false} slogan="" />
            </div>
            {row ? <Contents /> : "Error"}
        </div>
    </div>);
};

export default VaultDetails;