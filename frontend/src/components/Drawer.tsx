import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTrigger,
  } from "@/components/ui/drawer";
import { X } from 'lucide-react'


export default function(){
    return (<div style={{display: "relative"}}>
        <Drawer>
            {/* <DrawerHeader><DrawerTitle></DrawerTitle></DrawerHeader> */}
            <div style={{display: "flex", justifyContent: "center", marginTop: "-20px"}}>
                <DrawerTrigger>
                    {/* {threeDots} */}
                    <button className="hover-blue-black" style={{fontSize: "20px"}}>Net Gains 🙏</button>
                </DrawerTrigger>
            </div>
            <DrawerContent>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "300px", fontSize: "24px"}}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div style={{display: "inline-block", textAlign: "center", marginRight: "100px",}}>
                            <p style={{color: "rgb(100, 255, 100)", fontWeight: "bold"}}>Supply Balance</p>
                            <p>$0</p>
                        </div>
                        <div style={{width: "150px", height: "150px", border: "4px solid rgb(100, 255, 100)", borderRadius: "50%", display: "inline-flex", justifyContent: "center", alignItems: "center"}}>
                            <div style={{textAlign: "center", fontSize: "20px"}}>
                                <p>Net APY</p>
                                <p>...</p>
                            </div>
                        </div>
                        
                        <div style={{display: "inline-block", textAlign: "center", marginLeft: "100px"}}>
                            <p style={{color: "rgb(255, 80, 255)", fontWeight: "bold"}}>Borrow Balance</p>
                            <p>$0</p>
                        </div>
                    </div>
                </div>
                <DrawerClose style={{position: "absolute", top: "10px", right: "10px"}}>
                    <X className="h-6 w-6" />
                </DrawerClose>
            </DrawerContent>
        </Drawer>
    </div>)
}