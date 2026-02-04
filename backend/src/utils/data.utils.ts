export const getLast12Months = (): { name: string; count: number }[] => {
  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const now = new Date();
  const months: { name: string; count: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const name = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    months.push({ name, count: 0 });
  }

  return months; 
};

export const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];
