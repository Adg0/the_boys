import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer";
import { X } from 'lucide-react'
import { Button } from "./ui/button";


const threeDots = <svg viewBox="0 0 24 24" fill="none" width="40px" height="40px" xmlns="http://www.w3.org/2000/svg" stroke="#aaaaaa">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <path d="M18 12H18.01M12 12H12.01M6 12H6.01M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12ZM19 12C19 12.5523 18.5523 13 18 13C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11C18.5523 11 19 11.4477 19 12ZM7 12C7 12.5523 6.55228 13 6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11C6.55228 11 7 11.4477 7 12Z" stroke="#aaaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        </g>
    </svg>

export default function(){
    return (<div style={{display: "relative"}}>
        <Drawer>
            <DrawerHeader><DrawerTitle></DrawerTitle></DrawerHeader>
            <div style={{display: "flex", justifyContent: "center"}}>
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