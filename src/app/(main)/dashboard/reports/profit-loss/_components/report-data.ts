export interface ProfitReportRow {
  id: string;
  name: string;
  detail: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  transactions: number;
}

export const reportData = {
  products: [
    ["prd-1", "Classic Leather Tote", "SKU BAG-1042", 18420, 10131, 8289, 45, 186],
    ["prd-2", "Everyday Canvas Sneaker", "SKU SHOE-2210", 15860, 9516, 6344, 40, 142],
    ["prd-3", "Linen Weekend Shirt", "SKU TOP-0834", 12940, 7117, 5823, 45, 211],
    ["prd-4", "Minimal Steel Watch", "SKU ACC-3401", 11350, 6243, 5107, 45, 89],
    ["prd-5", "Ribbed Travel Bottle", "SKU HOME-1190", 8920, 4460, 4460, 50, 264],
    ["prd-6", "Merino Crew Sweater", "SKU TOP-0955", 7810, 4686, 3124, 40, 76],
  ],
  categories: [
    ["cat-1", "Apparel", "24 active products", 48250, 27985, 20265, 42, 584],
    ["cat-2", "Footwear", "18 active products", 36180, 22432, 13748, 38, 302],
    ["cat-3", "Accessories", "31 active products", 31420, 16967, 14453, 46, 391],
    ["cat-4", "Home & Living", "16 active products", 22150, 11297, 10853, 49, 446],
    ["cat-5", "Personal Care", "12 active products", 14360, 8185, 6175, 43, 227],
    ["cat-6", "Seasonal", "9 active products", 9840, 6002, 3838, 39, 118],
  ],
  brands: [
    ["brd-1", "Northstar Goods", "42 products", 38560, 21594, 16966, 44, 396],
    ["brd-2", "Field & Form", "28 products", 31240, 17807, 13433, 43, 342],
    ["brd-3", "Atelier No. 8", "16 products", 27810, 14461, 13349, 48, 184],
    ["brd-4", "Common Thread", "35 products", 24420, 14896, 9524, 39, 311],
    ["brd-5", "Morrow Studio", "19 products", 19680, 10824, 8856, 45, 225],
    ["brd-6", "Sunday Supply", "21 products", 14030, 8278, 5752, 41, 198],
  ],
  locations: [
    ["loc-1", "Downtown Flagship", "Phnom Penh", 68420, 38315, 30105, 44, 768],
    ["loc-2", "Riverside Store", "Phnom Penh", 49180, 29016, 20164, 41, 532],
    ["loc-3", "BKK1 Studio", "Phnom Penh", 37650, 20331, 17319, 46, 389],
    ["loc-4", "Siem Reap Market", "Siem Reap", 28940, 17075, 11865, 41, 304],
    ["loc-5", "Online Store", "All regions", 52180, 26612, 25568, 49, 641],
  ],
  invoices: [
    ["inv-1", "INV-2026-05841", "May 31 - Downtown", 2840, 1534, 1306, 46, 8],
    ["inv-2", "INV-2026-05837", "May 31 - Online", 2180, 1090, 1090, 50, 6],
    ["inv-3", "INV-2026-05822", "May 30 - BKK1", 1960, 1137, 823, 42, 9],
    ["inv-4", "INV-2026-05811", "May 30 - Riverside", 1740, 974, 766, 44, 5],
    ["inv-5", "INV-2026-05798", "May 29 - Online", 1520, 790, 730, 48, 4],
    ["inv-6", "INV-2026-05784", "May 29 - Downtown", 1380, 842, 538, 39, 7],
  ],
  dates: [
    ["date-1", "May 31, 2026", "Sunday", 8940, 4828, 4112, 46, 96],
    ["date-2", "May 30, 2026", "Saturday", 11280, 6317, 4963, 44, 121],
    ["date-3", "May 29, 2026", "Friday", 9720, 5346, 4374, 45, 104],
    ["date-4", "May 28, 2026", "Thursday", 7640, 4355, 3285, 43, 82],
    ["date-5", "May 27, 2026", "Wednesday", 7180, 4093, 3087, 43, 78],
    ["date-6", "May 26, 2026", "Tuesday", 6820, 3956, 2864, 42, 73],
  ],
  customers: [
    ["cus-1", "Sophea Lim", "VIP - 24 orders", 12840, 6677, 6163, 48, 24],
    ["cus-2", "Dara Holdings", "Business - 18 orders", 10360, 6010, 4350, 42, 18],
    ["cus-3", "Malis Chan", "Regular - 31 orders", 8720, 4622, 4098, 47, 31],
    ["cus-4", "The Workshop Co.", "Business - 12 orders", 7940, 4605, 3335, 42, 12],
    ["cus-5", "Nita Sok", "VIP - 19 orders", 6580, 3422, 3158, 48, 19],
    ["cus-6", "Walk-in customers", "Unregistered sales", 28640, 17470, 11170, 39, 428],
  ],
  days: [
    ["day-1", "Monday", "4 trading days", 24780, 14125, 10655, 43, 276],
    ["day-2", "Tuesday", "4 trading days", 23140, 13421, 9719, 42, 258],
    ["day-3", "Wednesday", "4 trading days", 25860, 14482, 11378, 44, 287],
    ["day-4", "Thursday", "4 trading days", 27920, 15635, 12285, 44, 301],
    ["day-5", "Friday", "5 trading days", 36480, 20429, 16051, 44, 398],
    ["day-6", "Saturday", "5 trading days", 42160, 23188, 18972, 45, 452],
    ["day-7", "Sunday", "5 trading days", 31840, 18149, 13691, 43, 354],
  ],
  staff: [
    ["stf-1", "Sreyneang Touch", "Downtown - Senior", 28640, 15752, 12888, 45, 284],
    ["stf-2", "Vuthy Heng", "Riverside - Senior", 25180, 14353, 10827, 43, 251],
    ["stf-3", "Sokha Meas", "BKK1 - Associate", 21940, 12067, 9873, 45, 226],
    ["stf-4", "Rachana Keo", "Downtown - Associate", 19420, 11264, 8156, 42, 203],
    ["stf-5", "Piseth Chhun", "Siem Reap - Associate", 17360, 10069, 7291, 42, 181],
    ["stf-6", "Online sales", "Unassigned channel", 52180, 26612, 25568, 49, 641],
  ],
} satisfies Record<string, Array<[string, string, string, number, number, number, number, number]>>;

export function toProfitRows(rows: (typeof reportData)[keyof typeof reportData]): ProfitReportRow[] {
  return rows.map(([id, name, detail, revenue, cost, profit, margin, transactions]) => ({
    id,
    name,
    detail,
    revenue,
    cost,
    profit,
    margin,
    transactions,
  }));
}
