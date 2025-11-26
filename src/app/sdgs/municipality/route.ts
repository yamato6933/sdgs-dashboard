import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { getPrefectureFromMunicipality } from './complete_prefecture_mapping';
import { MunicipalityData, SdgsScore, extractGoalsArray, calculateOverallScore } from '../types';

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

            const goals = extractGoalsArray(result);
            const overall = calculateOverallScore(goals);
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
            const goals = extractGoalsArray(result);
            const overall = calculateOverallScore(goals);
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