const nwpCurrentTemp = 20;

// Create dummy icaoList
const icaoList = Array.from({ length: 1000 }, (_, i) => ({ icao: `ICAO${i}`, distKm: i }));

// Create dummy list
const list = Array.from({ length: 5000 }, (_, i) => ({ icao: `ICAO${i % 1000}`, someData: 'data' }));

function parseMetarStation(s: any, temp: any) {
  return { icao: s.icao, data: s.someData };
}

// 1. Original
function original() {
  const start = performance.now();
  for(let i=0; i<100; i++) {
    list.map((s: any) => {
      const parsed = parseMetarStation(s, nwpCurrentTemp);
      const dist = icaoList.find((i) => i.icao === parsed.icao)?.distKm ?? null;
      return { ...parsed, distKm: dist };
    });
  }
  return performance.now() - start;
}

// 2. Optimized
function optimized() {
  const start = performance.now();
  for(let i=0; i<100; i++) {
    const icaoMap = new Map<string, number>();
    for (const item of icaoList) {
      icaoMap.set(item.icao, item.distKm);
    }
    list.map((s: any) => {
      const parsed = parseMetarStation(s, nwpCurrentTemp);
      const dist = icaoMap.get(parsed.icao) ?? null;
      return { ...parsed, distKm: dist };
    });
  }
  return performance.now() - start;
}

console.log("Original: ", original(), "ms");
console.log("Optimized: ", optimized(), "ms");
