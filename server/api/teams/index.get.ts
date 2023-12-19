import { scrapeTeamsAndIds } from "~/server/scraper";

export default defineEventHandler((_) => {
  // eslint-disable-next-line no-console
  console.log(`fetching teams`);
  return scrapeTeamsAndIds();
});
