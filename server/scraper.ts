import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedTableEntry{
  date?: Date;
  matchDay: number;
  homeTeam: string;
  awayTeam: string;
}

const BASE_URL = 'https://www.penny-del.org/spiele/team/';

const columnIds = {
  'date': 0,
  'time': 1,
  'gameDay': 2,
  'homeTeam': 3,
  'awayTeam': 4
}


async function scrapeTeamsGames (teamId: number) : Promise<Array<ScrapedTableEntry>> {
  const response = await axios.get(BASE_URL + teamId)
  const html = response.data;
  const $ = cheerio.load(html);

  const entries : Array<ScrapedTableEntry> = []

  $('table tbody tr').each((i, elem) => {
    const rowTds = $(elem).find('td:nth-child(-n+5)');
    const columns = rowTds.map((colIndex, colElement) => $(colElement).text().trim()).get();

    entries.push({
      date: parseDate(columns[columnIds.date] + ' ' + columns[columnIds.time]),
      matchDay: Number(columns[columnIds.gameDay]),
      homeTeam: columns[columnIds.homeTeam],
      awayTeam: columns[columnIds.awayTeam],
    })
  })

  return entries
}

async function scrapeTeamsAndIds () : Promise<Array<{id: number, name: string}>> {
  const response = await axios.get(BASE_URL)
  const html = response.data;

  const $ = cheerio.load(html);

  const teams : Array<{id: number, name: string}> = []

  $('select[name="select-team"] option').each((i, elem) => {
    const urlparts = $(elem).attr('value')?.split('/')
    if (urlparts === undefined || urlparts.length < 3) {
      return;
    }
    const teamId = Number (urlparts[3])

    if (Number.isNaN(teamId)) {
      return;
    }

    teams.push({
      id: teamId,
      name: $(elem).text()
    })
  });

  return teams
}


function parseDate(dateString: String): Date | undefined {
  const matchResult = dateString.match(/(\w+), (\d+\.\d+\.\d+) (\d+:\d+)/);

  if (matchResult !== null) {
    const [, , date, time] = matchResult;
    const [day, month, year] = date.split('.');
    const [hours, minutes] = time.split(':');

    return new Date(Number (year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
  }

  return undefined
}


export { scrapeTeamsGames, scrapeTeamsAndIds, ScrapedTableEntry };