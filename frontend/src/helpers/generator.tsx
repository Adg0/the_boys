const projects = [
    "Euler Prime USDC",
    "Stablecoin Maxi USDC",
    "Apostro Lido Ecosystem",
    "Aave",
    "SushiSwap",
    "RenVM",
    "Anchor Protocol",
    "Badger DAO",
    "Alpha Homora"
  ];

  const getProject = () => projects[Math.floor(Math.random() * projects.length)];
  const generateNumber = () => Math.round(Math.random() * 101);
  const generatePercentage = (max: number) => Math.round(100 * Math.random() * max) / 100;
  const generateMoney = () => {
    const money: number = Math.random() * (2_000_000 - 10_000) + 10_000;
    if(money < 1_000_000) {
        const value: number = Math.round(money * 100) / 100;
        return `$${value.toLocaleString()}`;
    }
    return `$${(Math.round(money / 10_000) / 100).toLocaleString()}M`;
  };

  export function generateRows(size=10){
    const rows: string[][] = [];
    for(let i = 0; i < size; i++){
        const row: string[] = [];

        row.push(getProject());
        row.push(generateNumber().toString());
        row.push(generatePercentage(1).toString() + "%");
        row.push("--");
        row.push(generateMoney());
        row.push(generateMoney());
        row.push(generatePercentage(100).toString() + "%");

        rows.push(row);
    }
    return rows;
  };