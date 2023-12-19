import { scrapeTeamsAndIds } from "~/server/scraper";

export default defineEventHandler((_) => {
  console.log(`fetching teams`);
  return scrapeTeamsAndIds();
});
