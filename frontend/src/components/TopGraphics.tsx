import Graphics from "../../images/superhero-cape.png";
// import Graphics2 from "../../images/graphics.svg";
import Vaught from '../../images/vaught.png';

interface MyComponentProps {
    showLogo: boolean,
    slogan: string,
};

const TopGraphics: React.FC<MyComponentProps> = ({ showLogo = true, slogan = "" }) => {
	return (
		<div
			style={{
				height: '400px',
				borderWidth: '2px 0px 2px 0px',
				borderColor: 'rgba(0, 255, 255, 0.125)',
				marginBottom: '36px',
				position: 'relative',
			}}
		>
			<div
				className='gradient-div'
				style={{
					position: 'absolute',
					top: '0',
					left: '200px',
					height: '400px',
					width: '400px',
					zIndex: '-1',
					borderRadius: '50%',
				}}
			></div>
            <div
                style={{
                    position: "absolute",
                    fontSize: "20px",
                    top: "200px",
                    left: "650px",
                    zIndex: "-1",
                    width: "400px",
                    display: "flex",
                    justifyContent: "center"}}>
                <p>{slogan}</p>
            </div>

			<div 
				style={{
					height: '400px',
					marginLeft: '200px',
					border: '1px solid rgba(0, 255, 255, 0.05)',
					position: "relative",
				}}>
					<img style={{height: "400px", opacity: "0.25"}} src={Graphics} alt="graphics" />
					{/* <img style={{height: "400px", position: "absolute", top: 0, bottom: 0}} src={Graphics2} alt="graphics2" /> */}
			</div>
			
			{showLogo ? (
				<div className='text-xl'>
					<img
						src={Vaught}
						alt='vaught logo'
						style={{
							position: 'absolute',
							top: '120px',
							left: '320px',
							width: '160px',
						}}
					/>
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default TopGraphics;
