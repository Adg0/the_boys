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

  export function generateMarketRows(size=10){
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

  const generateFormattedWalletAddress = () => {
    const randomHex = () => Math.floor(Math.random() * 16).toString(16);
    let start = '0x';

    // Generate the first 4 characters
    for (let i = 0; i < 4; i++) {
        start += randomHex();
    }

    // Generate the last 4 characters
    let end = '';
    for (let i = 0; i < 4; i++) {
        end += randomHex();
    }

    return `${start}...${end}`;
  };

  export function generateVaultRows(size = 10){
    const rows: string[][] = [];

    for(let i = 0; i < size; i++){
      const row: string[] = [];

      row.push(`${i + 1}`);
      row.push(generateFormattedWalletAddress());
      row.push(`${Math.ceil(Math.random() * 10)}`);
      row.push(`${Math.random() * 10}`.substring(0, 6));

      rows.push(row);
    }

    return rows;
  };

  export function generateUsersRows(size = 10){
    const rows: string[][] = [];

    for(let i = 0; i < size; i++){
      const row: string[] = [];

      row.push(`${i + 1}`);
      row.push(generateFormattedWalletAddress());
      row.push(`${Math.random() * 100_000_000}`.slice(0, 11));

      rows.push(row);
    }

    return rows;
  };