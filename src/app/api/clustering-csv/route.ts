import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    const filePath = join(process.cwd(), 'data', 'cityClustering.csv');
    console.log('Attempting to read CSV from:', filePath);
    
    const fileContent = await readFile(filePath, 'utf-8');
    console.log('CSV file read successfully, size:', fileContent.length);

    return new Response(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to read CSV:', errorMessage);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to read CSV file',
      details: errorMessage
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
