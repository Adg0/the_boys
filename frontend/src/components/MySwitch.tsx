interface MyComponentProps {
    checked: boolean,
    setChecked: any,
};

const MySwitch:React.FC<MyComponentProps> = ({checked, setChecked}) => {
    return (<>
        <label className="switch">
        <input type="checkbox" checked />
        <span className="slider round"></span>
        </label>
    </>);
};

export default MySwitch;