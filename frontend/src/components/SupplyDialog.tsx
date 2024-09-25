import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function(){

    const [useCollateralChecked, setUseCollateralChecked] = useState(false);

    return (<div>
        <Switch id="useCollateral" />
        {/* <p>Use as collateral <Switch id="useCollateral" checked={useCollateralChecked} onCheckedChange={setUseCollateralChecked}/></p> */}
    </div>);
}