import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { getPrefectureFromMunicipality } from './complete_prefecture_mapping';


interface SdgsScore {
  id: number;
  municipality: string;
  goal_1: number;
  goal_2: number;
  goal_3: number;
  goal_4: number;
  goal_5: number;
  goal_6: number;
  goal_7: number;
  goal_8: number;
  goal_9: number;
  goal_10: number;
  goal_11: number;
  goal_12: number;
  goal_13: number;
  goal_14: number;
  goal_15: number;
  goal_16: number;
  goal_17: number;
}

interface MunicipalityData {
  id: string;
  name: string;
  population: number;
  area: number;
  prefecture: string;
  scores: {
    overall: number;
    goals: number[];
  };
}

//GET関数で全市区町村のリストを取得する
export async function GET(request:Request) {
    try{
        const {searchParams} = new URL(request.url);
        const search = searchParams.get("search");
        const municipality = searchParams.get('municipality');

        const dbPath = path.resolve(process.cwd(), 'data', 'sdgs_scores.db');
        const db = new Database (dbPath,{readonly:true});

        if (municipality) {
            //特定の市区町村データを取得するためのSQL分の準備
            const stmt = db.prepare('SELECT * FROM sdgs_scores WHERE municipality = ?');
            const result = stmt.get(municipality) as SdgsScore | undefined;

            if (!result){
                return NextResponse.json({error: 'Municipality not found'},{status:404});
            }

            const goals = [
                result.goal_1, result.goal_2, result.goal_3, result.goal_4, result.goal_5,
                result.goal_6, result.goal_7, result.goal_8, result.goal_9, result.goal_10,
                result.goal_11, result.goal_12, result.goal_13, result.goal_14, result.goal_15,
                result.goal_16, result.goal_17
            ];

            const overall = Math.round(goals.reduce((sum, score) => sum + score,0)/goals.length);
            const prefecture = getPrefectureFromMunicipality(result.municipality);

            const municipalityData: MunicipalityData ={
                id: result.id.toString(),
                name: result.municipality,
                population: 100000, // デフォルト値（データベースに人口データがないため）
                area: 100.0, // デフォルト値（データベースに面積データがないため）
                prefecture,
                scores:{
                    overall,
                    goals
                }
            };

            return NextResponse.json(municipalityData);
        }

        let stmt;
        let results : SdgsScore[];

        if (search) {
            stmt = db.prepare('SELECT * FROM sdgs_scores WHERE municipality LIKE ? ORDER BY municipality LIMIT 200');
            results = stmt.all(`%${search}%`) as SdgsScore[];
        } else{
            stmt = db.prepare('SELECT * FROM sdgs_scores ORDER BY municipality');
            results = stmt.all() as SdgsScore[];
        }

        const municipalities: MunicipalityData[] = results.map(result => {
            const goals = [
                result.goal_1, result.goal_2, result.goal_3, result.goal_4, result.goal_5,
                result.goal_6, result.goal_7, result.goal_8, result.goal_9, result.goal_10,
                result.goal_11, result.goal_12, result.goal_13, result.goal_14, result.goal_15,
                result.goal_16, result.goal_17
            ];

            const overall = Math.round(goals.reduce((sum, score) => sum + score, 0) / goals.length);
            const prefecture = getPrefectureFromMunicipality(result.municipality);

                return {
                    id: result.id.toString(),
                    name: result.municipality,
                    population: 100000, // デフォルト値（データベースに人口データがないため）
                    area: 100.0, // デフォルト値（データベースに面積データがないため）
                    prefecture,
                    scores: {
                    overall,
                    goals
                }
            };
        });
        db.close();
        return NextResponse.json(municipalities);   
    } catch(error){
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
        }
    }