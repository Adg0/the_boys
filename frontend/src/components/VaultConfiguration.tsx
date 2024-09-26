const VaultConfiguration = () => {
    return (<div style={{backgroundColor: "rgb(12, 29, 47)", margin: "32px", borderRadius: "16px", border: "1px solid rgb(20, 48, 78", }}>
        <div style={{  padding: "16px 8px", }}>
            <p style={{fontSize: "24px", margin: "8px", padding: "8px"}}>Vault Configuration</p>
        </div>
        
        <div style={{height: "2px", backgroundColor: "rgb(20, 48, 78)"}}></div>
        <div style={{marginBottom: "48px", marginTop: "12px"}}>
            <div style={{display: "flex", justifyContent: "space-between", fontSize: "20px", padding: "16px 0px 8px 32px", width: "90%"}}>
                <p style={{color: "rgb(114, 131, 149)", flex: 1}}>Liquidation penality</p>
                <p style={{color: "rgb(114, 131, 149)", flex: 1 }}>Available liquidity</p>
                <p style={{color: "rgb(114, 131, 149)", flex: 1 }}>Supply cap</p>
                <p style={{color: "rgb(114, 131, 149)", flex: 1 }}>Vault fee</p>
            </div>

            <div style={{display: "flex", justifyContent: "space-between", padding: "16px 0px 8px 32px", width: "90%", color: "rgb(240, 240, 220)", fontSize: "24px"}}>
                <p style={{flex: 1}}>9-15%</p>
                <p style={{flex: 1}}>$1.86M</p>
                <p style={{flex: 1}}>--</p>
                <p style={{flex: 1}}>10%</p>
            </div>
            
            <div style={{display: "flex", justifyContent: "space-between", fontSize: "20px", padding: "16px 0px 8px 32px", width: "90%"}}>
                <p style={{color: "rgb(114, 131, 149)", flex: 1}}>Share token exchange rate</p>
                <p style={{color: "rgb(114, 131, 149)", flex: 1 }}>Bad debt socialization</p>
                <p style={{color: "rgb(114, 131, 149)", flex: 1 }}>Borrow cap</p>
                <p style={{color: "rgb(114, 131, 149)", flex: 1 }}></p>
            </div>

            <div style={{display: "flex", justifyContent: "space-between", padding: "16px 0px 8px 32px", width: "90%", color: "rgb(240, 240, 220)", fontSize: "24px"}}>
                <p style={{flex: 1}}>1.00</p>
                <p style={{flex: 1}}>Yes</p>
                <p style={{flex: 1}}>--</p>
                <p style={{flex: 1}}></p>
            </div>
        </div>
    </div>)
};

export default VaultConfiguration;