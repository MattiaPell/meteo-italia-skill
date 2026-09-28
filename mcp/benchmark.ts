import { climatologyData } from "./src/climatology_data.js";
import { getDistance } from "./src/geo.js";

const cityName = "Mi";
const region = undefined;
const latitude = undefined;
const longitude = undefined;

function runOld() {
    let matchedCity: any = null;
    let minDistance = Infinity;
    let results: any[] = [];

    const keys = Object.keys(climatologyData);
    const filteredKeys = region ? keys.filter((k) => k.toLowerCase().includes(region.toLowerCase())) : keys;

    for (const regKey of filteredKeys) {
    const cities = climatologyData[regKey] ?? [];
    for (const city of cities) {
        let matchesName = true;
        if (cityName) {
        matchesName = city.name.toLowerCase().includes(cityName.toLowerCase());
        }
        if (matchesName) {
        if (latitude !== undefined && longitude !== undefined) {
            const d = getDistance(latitude, longitude, city.lat, city.lon);
            if (d < minDistance) {
            minDistance = d;
            matchedCity = { ...city, region: regKey, distanceKm: Math.round(d * 10) / 10 };
            }
        } else {
            results.push({ ...city, region: regKey });
        }
        }
    }
    }
    return results.length;
}

function runNew() {
    let matchedCity: any = null;
    let minDistance = Infinity;
    let results: any[] = [];

    const keys = Object.keys(climatologyData);
    const filteredKeys = region ? keys.filter((k) => k.toLowerCase().includes(region.toLowerCase())) : keys;

    const searchCityName = cityName ? cityName.toLowerCase() : undefined;
    for (const regKey of filteredKeys) {
    const cities = climatologyData[regKey] ?? [];
    for (const city of cities) {
        let matchesName = true;
        if (searchCityName) {
        matchesName = city.name.toLowerCase().includes(searchCityName);
        }
        if (matchesName) {
        if (latitude !== undefined && longitude !== undefined) {
            const d = getDistance(latitude, longitude, city.lat, city.lon);
            if (d < minDistance) {
            minDistance = d;
            matchedCity = { ...city, region: regKey, distanceKm: Math.round(d * 10) / 10 };
            }
        } else {
            results.push({ ...city, region: regKey });
        }
        }
    }
    }
    return results.length;
}

const ITERATIONS = 100000;

console.log("Warming up...");
for (let i = 0; i < 1000; i++) {
    runOld();
    runNew();
}

console.log("Running old...");
const startOld = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
    runOld();
}
const endOld = Date.now();

console.log("Running new...");
const startNew = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
    runNew();
}
const endNew = Date.now();

console.log(`Old time: ${endOld - startOld}ms`);
console.log(`New time: ${endNew - startNew}ms`);
