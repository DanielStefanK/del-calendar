import { scrapeTeamsGames } from "~/server/scraper";

export default defineEventHandler((event) => {
  const teamIdParam = getRouterParam(event, "teamId");
  console.log(`fetching team data for ${teamIdParam}`);

  if (teamIdParam === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "id is required",
    });
  }

  const teamId = Number(teamIdParam);

  if (Number.isNaN(teamId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "id must be a number",
    });
  }

  return scrapeTeamsGames(teamId);
});
