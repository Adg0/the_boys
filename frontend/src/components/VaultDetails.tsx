

import { useLocation } from "react-router-dom";
import TopGraphics from "./TopGraphics";

import Aave from "../../images/aave.png";
import Alpha from "../../images/alpha_homora.png";
import Anchor from "../../images/anchor_protocol.jpg";
import Apostro from "../../images/apostro_lido.png";
import Badger from "../../images/badger_dao.png";
import Euler from "../../images/euler_prime_usdc.png";
import Ren from "../../images/ren_vm.png";
import Stable from "../../images/stable_coin.png";
import Sushi from "../../images/sushi_swap.png";

import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import SupplyDialog from "./SupplyDialog";
import BorrowDialog from "./BorrowDialog";

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

const imageRefKeys = Object.keys(imageRef);

const VaultDetails = () => {

    const location = useLocation();
    const row = location.state?.row;
    const [asset, supplyAPY, inWallet, totalSupply, totalBorrow, borrowAPY, utilization] = row;
    console.log(asset, supplyAPY, inWallet, totalSupply, totalBorrow, borrowAPY, utilization);

    const Contents = () => {
        return (<div style={{marginLeft: "350px", paddingTop: "150px"}}>
            <div style={{display: "inline-flex", alignItems: "center"}}>
                <div>
                    <img src={imageRef[row[0]]} alt="logo" style={{display: "inline", margin: "8px 24px 0px 24px", width:"48px", height: "48px", borderRadius: "50%"}}/>
                </div>
                <p style={{fontSize: "64px"}}>{asset.slice(0, 16)}</p>
            </div>
            <div style={{ position: "absolute", top: "0px", left: "1000px", display: "inline", width: "750px", height: "400px", borderRadius: "24px", border: "2px solid rgba(0, 50, 50, 1)", backgroundColor: "#0c1d2f"}}>
                <div style={{width: "80%", marginLeft: "24px", marginTop: "32px"}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <p style={{color: "rgb(114, 131, 149)", fontSize: "20px"}}>Total Supply</p>
                        <p style={{color: "rgb(114, 131, 149)", fontSize: "20px"}}>Supply APY</p>
                        <p style={{color: "rgb(114, 131, 149)", fontSize: "20px"}}>exposure</p>
                    </div>
                    
                    <div style={{display: "flex", justifyContent: "space-between", marginTop: "16px", color: "rgb(240, 240, 220)"}}>
                        <p style={{fontSize: "24px"}}>{totalSupply}</p>
                        <p style={{fontSize: "24px"}}>{supplyAPY}</p>
                        <p style={{fontSize: "24px"}}>{imageRefKeys.slice(0, 5).map(key => <img key={key} src={imageRef[key]} width="20px" height="20px" style={{display: "inline", borderRadius: "50%"}}/>)}</p>
                    </div>

                    <div style={{display: "flex", justifyContent: "space-between", marginTop: "48px"}}>
                        <p style={{color: "rgb(114, 131, 149)", fontSize: "20px"}}>Total Borrow</p>
                        <p style={{color: "rgb(114, 131, 149)", fontSize: "20px"}}>Borrow APY</p>
                        <p style={{color: "rgb(114, 131, 149)", fontSize: "20px"}}>Utilization</p>
                    </div>
                    
                    <div style={{display: "flex", justifyContent: "space-between", marginTop: "16px", color: "rgb(240, 240, 220)"}}>
                        <p style={{fontSize: "24px"}}>{totalBorrow}</p>
                        <p style={{fontSize: "24px"}}>{borrowAPY}</p>
                        <p style={{fontSize: "24px"}}>{utilization}</p>
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
        </div>);
    };

    return (<div>
        <div className="relative">
            <div style={{position: "absolute", top: "0", left: "0", width: "100%", zIndex: "-1"}}>
                <TopGraphics showLogo={false} />
            </div>
            {row ? <Contents /> : "Error"}
        </div>
    </div>);
};

export default VaultDetails;