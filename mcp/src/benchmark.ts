import { filterZones, BulletinZone } from "./dpc.js";

function generateZones(numZones: number, comuniPerZone: number): BulletinZone[] {
  const zones: BulletinZone[] = [];
  for (let i = 0; i < numZones; i++) {
    const comuni: string[] = [];
    for (let j = 0; j < comuniPerZone; j++) {
      comuni.push(`Comune_${i}_${j}`);
    }
    // Add the target in the last zone
    if (i === numZones - 1) {
      comuni.push("TargetComune");
    }
    zones.push({
      zona: `Zona_${i}`,
      regione: "Lombardia",
      comuni,
      normalizedComuni: new Set(comuni.map((c) => c.toLowerCase())),
      livelli: { idraulico: 0, temporali: 0, idrogeologico: 0 },
      testi: { idraulico: "", temporali: "", idrogeologico: "" },
      mappa: "",
    });
  }
  return zones;
}

const zones = generateZones(100, 1000); // 100 zones, 1000 comuni each = 100,000 comuni

console.time("Baseline");
for (let i = 0; i < 100; i++) {
  filterZones(zones, "TargetComune");
}
console.timeEnd("Baseline");
