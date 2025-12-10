import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    // URLパラメータから都道府県を取得
    const url = new URL(request.url);
    const prefecture = url.searchParams.get('prefecture');

    if (!prefecture) {
      return new Response(
        JSON.stringify({ error: 'prefecture parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 都道府県別のGeoJSONファイルを読み込む
    const fileName = `${prefecture}.geojson`;
    const filePath = join(process.cwd(), 'data', 'prefectures', fileName);

    console.log(`Loading GeoJSON for: ${prefecture}`);
    const fileContent = await readFile(filePath, 'utf-8');
    const geoJsonData = JSON.parse(fileContent);

    console.log(`Loaded ${geoJsonData.features?.length || 0} features for ${prefecture}`);

    return new Response(JSON.stringify(geoJsonData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to read GeoJSON:', errorMessage);

    return new Response(
      JSON.stringify({
        error: 'Failed to read GeoJSON file',
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
