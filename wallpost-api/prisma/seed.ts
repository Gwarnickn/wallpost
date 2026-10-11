import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

interface SeedEvent {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  image: string;
  lat: number;
  lng: number;
}

// The scraper stores dates as "DD:MM:YYYY_HH:mm"; the app expects ISO-like
// "YYYY-MM-DDTHH:mm" strings.
const toIsoDate = (value: string) => {
  const match = /^(\d{2}):(\d{2}):(\d{4})_(\d{2}):(\d{2})$/.exec(value);
  if (!match) return value;
  const [, day, month, year, hour, minute] = match;
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const eventsPath = fileURLToPath(new URL('./events.json', import.meta.url));

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const events = JSON.parse(
    await readFile(eventsPath, 'utf8'),
  ) as SeedEvent[];

  // Seeding is a clean slate: drop every existing post first.
  const { count: removed } = await prisma.post.deleteMany();

  await prisma.post.createMany({
    data: events.map((event) => ({
      title: event.title,
      startDate: toIsoDate(event.startDate),
      endDate: toIsoDate(event.endDate),
      description: event.description,
      image: event.image,
      lat: event.lat,
      lng: event.lng,
    })),
  });

  console.log(
    `Seed complete: removed ${removed} post(s), inserted ${events.length}.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
