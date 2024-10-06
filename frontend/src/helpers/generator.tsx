  const supes = ["Homelander", "Stormfront", "Queen Maeve", "Black Noir", "A-Train", "Translucent", "The Deep", "Starlight", "Lamplighter", "Jack from Jupiter", "Eagle the Archer", "Popclaw"];
  const membersOfTheBoys = ["Billy Butcher", "Hughie Campbell", "Frenchie", "Mother's Milk", "Kimiko", "The Female", "Terminator"];

  const getProject = (projects: string[]) => projects[Math.floor(Math.random() * projects.length)];
  const generatePercentage = (max: number) => Math.round(100 * Math.random() * max) / 100;
  const generateMoney = () => {
    const money: number = Math.random() * (2_000_000 - 10_000) + 10_000;
    if(money < 1_000_000) {
        const value: number = Math.round(money * 100) / 100;
        return `$${value.toLocaleString()}`;
    }
    return `$${(Math.round(money / 10_000) / 100).toLocaleString()}M`;
  };

  export function generateMarketRows(projects: string[], size=5){
    const rows: string[][] = [];
    for(let i = 0; i < size; i++){
        const row: string[] = [];

        row.push(getProject(projects));
        // row.push(generateNumber().toString());
        row.push(generatePercentage(1).toString() + "%");
        row.push("--");
        row.push(generateMoney());
        row.push(generateMoney());
        row.push(generatePercentage(1).toString() + "%");
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

  export function generateTheBoysRows(size = 10){
    const rows: string[][] = [];

    for(let i = 0; i < size; i++){
      const row: string[] = [];

      row.push(`${i + 1}`);
      row.push(generateFormattedWalletAddress());
      row.push(membersOfTheBoys[i < membersOfTheBoys.length ? i : membersOfTheBoys.length - 1]);
      row.push(`${Math.ceil(Math.random() * 10)}`);
      row.push(`${Math.random() * 10}`.substring(0, 6));

      rows.push(row);
    }

    return rows;
  };

  export function generateSupesRows(size = 10){
    const rows: string[][] = [];

    for(let i = 0; i < size; i++){
      const row: string[] = [];

      row.push(`${i + 1}`);
      row.push(generateFormattedWalletAddress());
      row.push(supes[i < supes.length ? i : supes.length - 1]);
      row.push(`${Math.random() * 100_000_000}`.slice(0, 11));

      rows.push(row);
    }

    return rows;
  };

  export function generateUseRows(projects: string[], size = 5){
    const rows: string[][] = [];
    
    for(let i = 0; i < size; i++){
      const row: string[] = [];

      row.push(getProject(projects));
      row.push(generatePercentage(100).toString() + "%");
      row.push(generatePercentage(100).toString() + "%");
      row.push(generateFormattedWalletAddress());

      rows.push(row);
    }
    
    return rows;
  };