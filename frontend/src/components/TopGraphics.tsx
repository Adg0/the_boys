import Graphics from "../../images/graphics.svg"
import Vaught from "../../images/vaught.png";

interface MyComponentProps{
    showLogo: boolean,
};

 const TopGraphics: React.FC<MyComponentProps> = ({showLogo = true}) => {
    return <div style={{height: "400px", borderWidth: "2px 0px 2px 0px", borderColor: "rgba(0, 255, 255, 0.125)", marginBottom: "36px", position: "relative"}}>
        <div  className="gradient-div" style={{position: "absolute", top: "0", left: "200px", height: "400px", width: "400px", zIndex: "-1", borderRadius: "50%"}}></div>
        <img src={Graphics} alt="graphics" style={{height: "400px", marginLeft: "200px", border: "1px solid rgba(0, 255, 255, 0.05)"}}/>
        {showLogo ? <img src={Vaught} alt="vaught logo" style={{position: "absolute", top: "120px", left: "320px", width: "160px"}} /> : ""}
    </div>;
}

export default TopGraphics