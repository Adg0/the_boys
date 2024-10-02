interface MyComponentProps {
    ticked: boolean,
    setTicked: any,
};

const MySwitch:React.FC<MyComponentProps> = ({ticked, setTicked}) => {

    return (<div>
        <div>
            <label className="switch">
            <input type="checkbox" checked={ticked} onChange={e => setTicked(e.target.ticked)} />
            <span className="slider round"></span>
            </label>
        </div>
    </div>);
};

export default MySwitch;