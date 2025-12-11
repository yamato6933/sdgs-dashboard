import { readFile } from 'fs/promises';
import { join } from 'path';

let cachedGeoJsonText: string | null = null;
let cacheLoadStarted = false;

export async function GET(request: Request) {
  try {
    // キャッシュから返す（テキスト版）
    if (cachedGeoJsonText) {
      console.log('Returning cached GeoJSON text, size:', cachedGeoJsonText.length);
      return new Response(cachedGeoJsonText, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=86400',
          'Content-Length': cachedGeoJsonText.length.toString(),
        },
      });
    }

    // キャッシュ読み込み中の場合は待機
    if (cacheLoadStarted) {
      console.log('Cache loading in progress, waiting...');
      // 最大120秒待機
      for (let i = 0; i < 240; i++) {
        await new Promise(r => setTimeout(r, 500));
        if (cachedGeoJsonText) {
          console.log('Cache loaded after waiting');
          return new Response(cachedGeoJsonText, {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Cache-Control': 'public, max-age=86400',
              'Content-Length': cachedGeoJsonText.length.toString(),
            },
          });
        }
      }
      throw new Error('Cache loading timeout');
    }

    cacheLoadStarted = true;
    const filePath = join(process.cwd(), 'data', 'N03-20_200101.geojson');
    console.log('Attempting to read GeoJSON from:', filePath);
    
    const fileContent = await readFile(filePath, 'utf-8');
    console.log('GeoJSON file read successfully, size:', fileContent.length);
    
    // 簡単なバリデーション
    if (!fileContent.startsWith('{')) {
      throw new Error('Invalid GeoJSON format');
    }

    // キャッシュに保存（テキスト版）
    cachedGeoJsonText = fileContent;
    cacheLoadStarted = false;

    console.log('GeoJSON cached, returning response');
    return new Response(cachedGeoJsonText, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
        'Content-Length': cachedGeoJsonText.length.toString(),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to read GeoJSON:', errorMessage);
    cacheLoadStarted = false;
    
    return new Response(JSON.stringify({ 
      error: 'Failed to read GeoJSON file',
      details: errorMessage
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
