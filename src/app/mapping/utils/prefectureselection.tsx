"use client"
import React, { useState, useEffect } from "react";
import { getAllRegions, getPrefectureByRegion, type RegionData } from './region-mapping';
import { MunicipalityData } from '../types';

export interface PrefectureSelectionProps {
  onMunicipalitySelect: (municipality: MunicipalityData | null) => void;
  className?: string;
  placeholder?: string;
}

const getAllPrefectures = (): string[] => {
  return [
    "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
    "岐阜県", "静岡県", "愛知県", "三重県",
    "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
    "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    "徳島県", "香川県", "愛媛県", "高知県",
    "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
  ];
};

export default function PrefectureSelection({
  onMunicipalitySelect,
  className = "",
  placeholder = "選択してください"
}: PrefectureSelectionProps) {
  const [selectedPrefecture, setSelectedPrefecture] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [availablePrefectures, setAvailablePrefectures] = useState<string[]>([]);
  const [regions] = useState<RegionData[]>(getAllRegions());
  const [allPrefectures] = useState<string[]>(getAllPrefectures());

  // 地方選択時に都道府県リストを更新
  useEffect(() => {
    if (selectedRegion) {
      const prefectures = getPrefectureByRegion(selectedRegion);
      setAvailablePrefectures(prefectures);
      setSelectedPrefecture("");
      onMunicipalitySelect(null);
    } else {
      setAvailablePrefectures(allPrefectures);
    }
  }, [selectedRegion, allPrefectures]);

  const handlePrefectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prefecture = e.target.value;
    setSelectedPrefecture(prefecture);
    if (prefecture) {
      onMunicipalitySelect({
        prefecture: prefecture,
        area: 0
      });
    } else {
      onMunicipalitySelect(null);
    }
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
  };

  return (
    <div className={`flex flex-col md:flex-row items-start md:items-center gap-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        {/*地方選択 */}
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 w-full md:w-auto">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">地方:</label>
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">全国</option>
            {regions.map(region => (
              <option key={region.name} value={region.name}>
                {region.description}
              </option>
            ))}
          </select>
        </div>

        {/*都道府県選択 */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">都道府県:</label>
          <select
            value={selectedPrefecture}
            onChange={handlePrefectureChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">{placeholder}</option>
            {availablePrefectures.map(prefecture => (
              <option key={prefecture} value={prefecture}>{prefecture}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}