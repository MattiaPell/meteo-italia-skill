import { fetchLatestBulletin } from "./src/dpc.js";

async function run() {
  const start = Date.now();
  for (let i = 0; i < 5; i++) {
    await fetchLatestBulletin();
  }
  const end = Date.now();
  console.log(`Total time for 5 iterations: ${end - start} ms`);
}

run().catch(console.error);
