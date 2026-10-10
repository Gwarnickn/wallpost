import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { Post } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly database: DatabaseService) {}

  // zdjęcie plakatu (data URL w JPEG) -> dane wydarzenia
  async scanPoster(image: string) {
    const data = image?.split(',')[1];
    if (!data) throw new BadRequestException('Image must be a base64 data URL');

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY ?? '',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { inline_data: { mime_type: 'image/jpeg', data } },
                {
                  text:
                    `To zdjęcie plakatu wydarzenia. Dzisiaj jest ${new Date().toISOString().slice(0, 10)}. ` +
                    'Odczytaj dane i zwróć WYŁĄCZNIE obiekt JSON z polami: ' +
                    'title (nazwa wydarzenia), ' +
                    'startDate i endDate (format YYYY-MM-DDTHH:mm; jeśli brak roku, wybierz najbliższą przyszłą datę; ' +
                    'jeśli brak końca, dodaj 2 godziny do początku; jeśli brak daty, pusty tekst), ' +
                    'description (2-3 zdania po polsku o wydarzeniu, na podstawie plakatu), ' +
                    'place (nazwa miejsca lub adres razem z miastem, tak aby dało się go znaleźć na mapie; pusty tekst, jeśli brak).',
                },
              ],
            },
          ],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      },
    );
    const answer = await response.json();
    const text: string =
      answer.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const result = JSON.parse(
      text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1),
    );
    // nazwa miejsca -> współrzędne (OpenStreetMap Nominatim, bez klucza)
    let lat: number | null = null;
    let lng: number | null = null;
    if (result.place) {
      const geo = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(result.place)}`,
        { headers: { 'User-Agent': 'wallpost-app' } },
      );
      const [hit] = await geo.json();
      if (hit) {
        lat = Number(hit.lat);
        lng = Number(hit.lon);
      }
    }

    // duplikat = ten sam dzień i co najmniej połowa wspólnych słów w tytule
    const words = (value: string): string[] =>
      value.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
    const day = (result.startDate ?? '').slice(0, 10);
    const sameDay = day
      ? await this.database.post.findMany({
          where: { startDate: { startsWith: day } },
          select: { id: true, title: true },
        })
      : [];
    const duplicate =
      sameDay.find((post) => {
        const a = words(result.title ?? '');
        const b = words(post.title);
        const common = a.filter((word) => b.includes(word)).length;
        return common > 0 && common >= Math.min(a.length, b.length) / 2;
      }) ?? null;

    return { ...result, lat, lng, duplicate };
  }

  createPost(data: {
    title: string;
    startDate: string;
    endDate: string;
    description: string;
    image: string;
    lat: number;
    lng: number;
  }) {
    return this.database.post.create({ data });
  }

  findAll() {
    return this.database.post.findMany();
  }

  async likePost(id: bigint) {
    const post = await this.database.post.findUnique({
      where: { id },
      select: { likes: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.database.post.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });
  }

  async unlikePost(id: bigint) {
    const post = await this.database.post.findUnique({
      where: { id },
      select: { likes: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.likes <= 0) {
      return post;
    }

    return this.database.post.update({
      where: { id },
      data: { likes: { decrement: 1 } },
    });
  }

  async slopPost(id: bigint) {
    const post = await this.database.post.findUnique({
      where: { id },
      select: { slop: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.database.post.update({
      where: { id },
      data: { slop: { increment: 1 } },
    });
  }

  async getSelected(ids: bigint[]) {
    const posts = await this.database.post.findMany({
      where: { id: { in: ids } },
    });

    const byId = new Map(posts.map((p) => [p.id.toString(), p]));
    return ids
      .map((id) => byId.get(id.toString()))
      .filter((p): p is Post => !!p);
  }
}
