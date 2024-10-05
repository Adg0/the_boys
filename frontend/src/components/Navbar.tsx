import { useState } from "react";

import { Link, useLocation } from "react-router-dom";
import Logo from "../../images/logo.png";
import { useConnectUI, useIsConnected, useAccounts, useDisconnect } from '@fuels/react';
import { useToast } from '@/hooks/use-toast';
import { shortenAddress } from "@/helpers/formatters";

const copyIcon = <svg version="1.1" width="16" height="16" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 111.07 122.88">
        <g>
            <path className="st0" fill="white" d="M97.67,20.81L97.67,20.81l0.01,0.02c3.7,0.01,7.04,1.51,9.46,3.93c2.4,2.41,3.9,5.74,3.9,9.42h0.02v0.02v75.28 v0.01h-0.02c-0.01,3.68-1.51,7.03-3.93,9.46c-2.41,2.4-5.74,3.9-9.42,3.9v0.02h-0.02H38.48h-0.01v-0.02 c-3.69-0.01-7.04-1.5-9.46-3.93c-2.4-2.41-3.9-5.74-3.91-9.42H25.1c0-25.96,0-49.34,0-75.3v-0.01h0.02 c0.01-3.69,1.52-7.04,3.94-9.46c2.41-2.4,5.73-3.9,9.42-3.91v-0.02h0.02C58.22,20.81,77.95,20.81,97.67,20.81L97.67,20.81z M0.02,75.38L0,13.39v-0.01h0.02c0.01-3.69,1.52-7.04,3.93-9.46c2.41-2.4,5.74-3.9,9.42-3.91V0h0.02h59.19 c7.69,0,8.9,9.96,0.01,10.16H13.4h-0.02v-0.02c-0.88,0-1.68,0.37-2.27,0.97c-0.59,0.58-0.96,1.4-0.96,2.27h0.02v0.01v3.17 c0,19.61,0,39.21,0,58.81C10.17,83.63,0.02,84.09,0.02,75.38L0.02,75.38z M100.91,109.49V34.2v-0.02h0.02 c0-0.87-0.37-1.68-0.97-2.27c-0.59-0.58-1.4-0.96-2.28-0.96v0.02h-0.01H38.48h-0.02v-0.02c-0.88,0-1.68,0.38-2.27,0.97 c-0.59,0.58-0.96,1.4-0.96,2.27h0.02v0.01v75.28v0.02h-0.02c0,0.88,0.38,1.68,0.97,2.27c0.59,0.59,1.4,0.96,2.27,0.96v-0.02h0.01 h59.19h0.02v0.02c0.87,0,1.68-0.38,2.27-0.97c0.59-0.58,0.96-1.4,0.96-2.27L100.91,109.49L100.91,109.49L100.91,109.49 L100.91,109.49z"/>
        </g>
    </svg>

const Navbar = () => {

    const [avatarOpen, setAvatarOpen] = useState(false);

    const location = useLocation();

    const { toast } = useToast();
    const { connect, isConnecting } = useConnectUI();
    const { isConnected } = useIsConnected();
    const { accounts } = useAccounts();
    const { disconnect, isPending } = useDisconnect();
    const HandleConnect = async () => {
        // connect();
        
        try {
            await connect();
            // console.log("Connection state", isConnected);
            // if (isConnected) {
                // toast({
                //     title: 'Success',
                //     description: 'Wallet connected!!!',
                //     variant: 'online'
                //   });
            // } 
            // if (error) 
            //     toast({
            //         description: 'Execution Reverted',
            //         variant: 'destructive'
            //     })
        } catch (error) {
            console.warn("Error occured!")
        }
    }
    const HandleDisconnect = () => {
        toast({
            title: 'Disconnected',
            variant: 'online'
        });
        try {            
            disconnect();
            if (isPending) console.warn('Pending disconnect...');
        } catch (error) {
            console.error(error)
        }
            // else if (error) console.error('Error: ', error)
    }
    
    return (
        <div className="text-white text-xl py-2 px-5 flex justify-between mt-5" style={{backgroundColor: "rgb(8, 19, 31)", color: "rgb(221, 251, 244)"}}>
            <div>
                <img src={Logo} alt="logo" width={40} style={{display: "inline-block"}} className="mr-4"/>
                <Link style={{ border: location?.pathname === "/" ? "1px solid rgba(59, 130, 246, 0.5)" : "none"}} to="/" className="ml-8 mr-4 hover-blue-black">Market</Link>
                <Link style={{ border: location?.pathname === "/leaderboard" ? "1px solid rgba(59, 130, 246, 0.5)" : "none"}} to="/leaderboard" className="mr-4 hover-blue-black">Leaderboard</Link>
            </div>
            <div>
                {!isConnected ? (
                    <button onClick={HandleConnect} className="mr-4">
                        {isConnecting ? 'Connecting...' : 'Connect'}
                    </button>
                )
                // :(
                //     <div className="mr-4 flex-col gap-1">
                //         <button className="mb-1 text-red-600" onClick={HandleDisconnect} >Disconnect</button>
                //         {/* <div>
                //             {accounts ? <>{`${accounts[0]}`}</>: <>fetching</>}                        
                //         </div> */}
                //         <div>
                //             {accounts ? <>{`${shortenAddress(accounts[0])}`}</>: <>fetching</>}                        
                //         </div>
                //     </div>
                // )
                :(<div 
                    style={{backgroundColor: "#2c343e", color: "#9fb2c2", borderRadius: "16px", padding: "4px", position: "relative"}}
                        onMouseEnter={() => setAvatarOpen(true)}
                        onMouseLeave={() => setAvatarOpen(false)}>
                    <p style={{display: "inline-block", padding: "4px 20px"}}>{accounts ? <>{shortenAddress(accounts[0])}</>: <>fetching</>} </p>
                    <div style={{width: "12px", height: "12px", marginRight: "16px", marginBottom: "4px", display: "inline-block", borderBottom: "4px solid #aaa", borderRight: "4px solid #aaa", transform: avatarOpen ? "rotate(45deg)" : "rotate(-135deg)"}}></div>
                    {
                        (avatarOpen && accounts) ?
                        <div style={{height: "164px", width: "225px", borderRadius: "16px", border: "1px solid white", position: "absolute", left: "0", bottom: "-164px", fontSize: "16px", padding: "16px", backgroundColor: "#252e33", zIndex: "100"}}>
                            <p style={{marginBottom: "16px"}}>Connected Wallet</p>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                    <p style={{width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "rgb(80, 240, 120)", }}></p>
                                    <p style={{color: "white", fontWeight: "bold", marginLeft: "8px"}}>{shortenAddress(accounts[0])}</p>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(accounts[0])}>
                                    {copyIcon}
                                </button>
                            </div>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <button
                                    onClick={HandleDisconnect} 
                                    style={{ width: "100%", padding: "8px", margin: "16px 0px", color: "white", fontWeight: "bold", borderRadius: "8px", backgroundColor: "rgb(200, 50, 50)"}}>
                                        Disconnect
                                </button>
                            </div>
                        </div> : ""
                    }
                </div>)
                }
                {/* <Link to="/" className="mr-4">Connect</Link> */}
            </div>
        </div>);
};

export default Navbar;