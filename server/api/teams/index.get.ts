import { scrapeTeamsAndIds } from "~/server/scraper";



export default defineEventHandler((event) => {
  console.log(`fetching teams`)
  return scrapeTeamsAndIds()
})