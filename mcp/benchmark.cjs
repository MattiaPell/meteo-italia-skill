const { performance } = require('perf_hooks');

const n = 30;
const m = 30;

const era5Dates = Array.from({length: n}, (_, i) => `2024-01-${(i%31+1).toString().padStart(2, '0')}T00:00:00Z`);
const fDates = Array.from({length: m}, (_, i) => `2024-01-${(i%31+1).toString().padStart(2, '0')}T00:00:00Z`);
// shuffle fDates a bit to make it less trivial
for (let i = fDates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fDates[i], fDates[j]] = [fDates[j], fDates[i]];
}

function original() {
    let matches = 0;
    for (let i = 0; i < era5Dates.length; i++) {
        const fi = fDates.indexOf(era5Dates[i]);
        if (fi < 0) continue;
        matches++;
    }
    return matches;
}

function optimized() {
    let matches = 0;
    const fDatesIndex = new Map();
    for (let i = 0; i < fDates.length; i++) {
        if (!fDatesIndex.has(fDates[i])) {
            fDatesIndex.set(fDates[i], i);
        }
    }
    for (let i = 0; i < era5Dates.length; i++) {
        const fi = fDatesIndex.get(era5Dates[i]);
        if (fi === undefined) continue;
        matches++;
    }
    return matches;
}

const iters = 10000;

const t0 = performance.now();
for (let i = 0; i < iters; i++) original();
const t1 = performance.now();
console.log(`Original: ${t1 - t0}ms`);

const t2 = performance.now();
for (let i = 0; i < iters; i++) optimized();
const t3 = performance.now();
console.log(`Optimized: ${t3 - t2}ms`);
