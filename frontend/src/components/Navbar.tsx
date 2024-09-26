import { Link } from "react-router-dom";
import Logo from "../../images/logo.png";
import { useConnectUI, useIsConnected, useAccounts, useDisconnect } from '@fuels/react';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
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
                toast({
                    title: 'Success',
                    description: 'Wallet connected!!!',
                    variant: 'online'
                  });
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
                <Link to="/" className="mr-4">Market</Link>
                <Link to="/leaderboard" className="mr-4">Leaderboard</Link>
            </div>
            <div>
                {!isConnected ? (
                    <button onClick={HandleConnect} className="mr-4">
                        {isConnecting ? 'Connecting...' : 'Connect'}
                    </button>
                ):(
                    <div className="mr-4 flex-col gap-1">
                        <button className="mb-1 text-red-600" onClick={HandleDisconnect} >Disconnect</button>
                        <div>
                            {accounts ? <>{`${accounts[0]}`}</>: <>fetching</>}                        
                        </div>
                    </div>
                )}
                {/* <Link to="/" className="mr-4">Connect</Link> */}
            </div>
        </div>);
};

export default Navbar;