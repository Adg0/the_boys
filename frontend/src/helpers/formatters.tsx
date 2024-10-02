export const shortenAddress = (addressStr: string) => {
    if(!addressStr) return "";
    return `0x${addressStr.slice(5, 10)}...${addressStr.slice(-5)}`;
};