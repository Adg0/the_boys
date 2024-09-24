import Graphics from "../../images/graphics.svg"
import Vaught from "../../images/vaught.png";

export default function TopGraphics(){
    return <div style={{height: "400px", borderWidth: "2px 0px 2px 0px", borderColor: "rgba(0, 255, 255, 0.125)", marginBottom: "36px", position: "relative"}}>
        <img src={Graphics} alt="graphics" style={{height: "400px", marginLeft: "200px", border: "1px solid rgba(0, 255, 255, 0.05)"}}/>
        <img src={Vaught} alt="vaught logo" style={{position: "absolute", top: "120px", left: "320px", width: "160px"}} />
    </div>;
}