'use client';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

let L: any;

type JapanMapProps = {
  prefecture: string;
  onReset: () => void;
};

type MapData = {
  geoJsonGroup: any;
  clusteringData: Map<string, number>;
};

// クラスター色定義
const CLUSTER_COLORS: Record<number, string> = {
  0: '#FFB6C1',  // ライトピンク
  1: '#FF69B4',  // ホットピンク
  2: '#FF1493',  // ディープピンク
};

export function JapanMapWithClustering({ prefecture, onReset }: JapanMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const dataRef = useRef<MapData>({ geoJsonGroup: null, clusteringData: new Map() });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CSVデータを読み込む
  useEffect(() => {
    const loadClusteringData = async () => {
      try {
        console.log('Loading clustering data...');
        const res = await fetch('/api/clustering-csv');
        if (!res.ok) throw new Error('Failed to load CSV');
        
        const csv = await res.text();
        const lines = csv.split('\n');
        const clusterMap = new Map<string, number>();
        
        // ヘッダー行をスキップ
        for (let i = 1; i < lines.length; i++) {
          const [city_code, value] = lines[i].trim().split(',');
          if (city_code && value !== undefined) {
            clusterMap.set(city_code, parseInt(value, 10));
          }
        }
        
        dataRef.current.clusteringData = clusterMap;
        console.log('Clustering data loaded, total records:', clusterMap.size);
      } catch (err) {
        console.error('Failed to load clustering data:', err);
      }
    };

    loadClusteringData();
  }, []);

  // マップを初期化（一度だけ）
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // 既に初期化済みならスキップ
    if (map.current !== null) {
      console.log('Map already initialized, skipping');
      return;
    }

    const initializeMap = async () => {
      if (!L) {
        L = (await import('leaflet')).default;
      }

      try {
        console.log('Initializing map');
        
        // コンテナ内に既にマップが存在する場合は削除
        const container = mapContainer.current as any;
        if (container?._leaflet_id) {
          delete container._leaflet_id;
        }
        
        map.current = L.map(mapContainer.current).setView([36.5, 137.0], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map.current);

        dataRef.current.geoJsonGroup = L.layerGroup().addTo(map.current);

        // デフォルトで最初の都道府県（北海道）を表示
        await loadPrefectureData('北海道');

        console.log('Map rendered successfully');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('Failed to load map:', err);
        setError('地図の読み込みに失敗しました: ' + errorMsg);
      }
    };

    initializeMap();

    // クリーンアップ関数
    return () => {
      if (map.current) {
        try {
          map.current.remove();
          map.current = null;
        } catch (err) {
          console.error('Error removing map:', err);
        }
      }
    };
  }, []);

  // 都道府県が変わったときにGeoJSONレイヤーの色を更新
  useEffect(() => {
    if (!map.current || !prefecture) return;

    const updatePrefectureColors = async () => {
      console.log('Updating prefecture colors for:', prefecture);
      await loadPrefectureData(prefecture);
    };

    updatePrefectureColors();
  }, [prefecture]);

  // 都道府県データを読み込んでレイヤーを更新
  const loadPrefectureData = async (prefectureName: string) => {
    try {
      console.log('Loading GeoJSON for:', prefectureName);
      const res = await fetch(`/api/geojson-filtered?prefecture=${encodeURIComponent(prefectureName)}`);

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const geoJsonData = await res.json();
      console.log('GeoJSON loaded, features:', geoJsonData.features?.length);

      // 既存レイヤーをクリア
      dataRef.current.geoJsonGroup.clearLayers();

      // 新しいレイヤーを追加
      const geoJsonLayer = L.geoJSON(geoJsonData, {
        style: (feature: any) => {
          const cityCode = feature.properties.N03_007 || '';
          const clusterValue = dataRef.current.clusteringData.get(cityCode) ?? 0;
          const fillColor = CLUSTER_COLORS[clusterValue] || CLUSTER_COLORS[0];
          
          return {
            fillColor: fillColor,
            weight: 1,
            opacity: 1,
            color: '#333',
            fillOpacity: 0.7,
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          const name = feature.properties.N03_004 || '不明';
          const cityCode = feature.properties.N03_007 || '不明';
          const clusterValue = dataRef.current.clusteringData.get(cityCode) ?? 'N/A';
          layer.bindPopup(
            `<strong>${name}</strong><br/>` +
            `コード: ${cityCode}<br/>` +
            `クラスター: ${clusterValue}`
          );
        },
      });

      geoJsonLayer.addTo(dataRef.current.geoJsonGroup);
      console.log('Updated GeoJSON layer');
    } catch (err) {
      console.error('Failed to load prefecture data:', err);
    }
  };


  if (error) {
    console.error('Map error:', error);
  }

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '600px',
      }}
    />
  );
}
