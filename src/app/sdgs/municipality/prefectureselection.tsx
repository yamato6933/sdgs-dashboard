"use client"
import React, { useState,useEffect,useRef} from "react";
import { getAllRegions, getPrefectureByRegion, getRegionByPrefecture, type RegionData } from './region-mapping';
import { MunicipalityData } from '../types';
import { InputRegion } from "@/app/components/InputRegion";
import { DropdownRef } from "@/app/components/DropdownRef";

export type PrefectureData = Record<string,MunicipalityData[]>;

export interface PrefectureSelectionProps {
  onMunicipalitySelect: (municipality: MunicipalityData | null) => void;
  selectedPrefecture?: string;
  selectedMunicipality?: string;
  className?: string;
  placeholder?: string;
  searchPlaceholder?: string;
}

//APIから市区町村のデータを取得
const fetchMunicipality = async(search?:string): Promise<MunicipalityData[]> =>{
  try{
    const url = search
      ? `/sdgs/municipality?search=${encodeURIComponent(search)}`
      : "/sdgs/municipality";
      const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch municipalities');
    return response.json();
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    return [];
  }
}

//市区町ごとの配列を都道府県ごとにグループ分け
const groupByPrefecture = (municipalities:MunicipalityData[]): PrefectureData =>{
  return municipalities.reduce((acc,municipality) => {
    if(!acc[municipality.prefecture]){
      acc[municipality.prefecture] = [];
    }
    acc[municipality.prefecture].push(municipality);
    return acc
  }, {} as PrefectureData);
}

export default function PrefectureSelection({
  onMunicipalitySelect,
  selectedPrefecture = "",
  selectedMunicipality = "",
  className = "",
  placeholder = "選択してください",
  searchPlaceholder = "例: 渋谷区、横浜市、大阪..."

}:PrefectureSelectionProps){
  const [internalSelectedPrefecture, setInternalSelectedPrefecture] = useState(selectedPrefecture);
  const [internalSelectedMunicipality, setInternalSelectedMunicipality] = useState(selectedMunicipality);

  //データ管理用state
  const [municipalityData, setMunicipalityData] = useState<PrefectureData>({});
  const [isLoading, setIsLoading] = useState(false);

  //地方選択用state
  const [selectedRegion, setSelectedRegion] = useState("");
  const [availablePrefectures, setAvailablePrefectures] = useState<string[]>([]);
  const [regions] = useState<RegionData[]>(getAllRegions());

  // 検索機能用のstate
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MunicipalityData[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchMethod, setSearchMethod] = useState<"select" | "search">("select");

  //Refを使った検索ボックス
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);


  //APIから初期データを取得
  useEffect(() => {
    const loadMunicipalities = async () => {
      setIsLoading(true);
      try{
        const municipalities = await fetchMunicipality();
        setMunicipalityData(groupByPrefecture(municipalities));
      } catch(error) {
        console.error('Failed to load municipalities:', error);
      } finally{
        setIsLoading(false);
      }
    };

    loadMunicipalities();
  }, []);

  //デバウンス付きの検索機能
  useEffect(() => {
    const handler = setTimeout( async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      // 既に選択済みの市区町村の場合は検索しない
      if (internalSelectedMunicipality && searchQuery.includes(internalSelectedPrefecture)) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      try{
        const results = await fetchMunicipality(searchQuery);
        console.log(`検索結果 "${searchQuery}":`, results.length, '件');
        setSearchResults(results.slice(0,10));
        // 検索クエリがある場合は常にドロップダウンを表示（結果があってもなくても）
        setShowSearchResults(true);

      }  catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
        setShowSearchResults(false);
      }
    },300);

    return () => clearTimeout(handler);
  }, [searchQuery, internalSelectedMunicipality, internalSelectedPrefecture]);

  // 外部クリックで検索結果を非表示にする. //要注意
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchDropdownRef.current && 
        !searchDropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // 地方選択時に都道府県リストを更新
  useEffect(() => {
    if(selectedRegion){
      const prefectures = getPrefectureByRegion(selectedRegion);
      setAvailablePrefectures(prefectures);
      setInternalSelectedPrefecture("");
      setInternalSelectedMunicipality("");
      onMunicipalitySelect(null);
    } else{
      setAvailablePrefectures(Object.keys(municipalityData));
    }
  },[selectedRegion,municipalityData]);

  //都道府県変更時に市区町村をリセット
  useEffect(() => {
    if(searchMethod==="select"){
      setInternalSelectedMunicipality("");
      onMunicipalitySelect(null);
    }
  },[internalSelectedPrefecture,searchMethod]);


  //市区町村を選択した後の処理
  const handleMunicipalityChange = (municipalityId:string) => {
    setInternalSelectedMunicipality(municipalityId);
    if (municipalityId){
      const municipalityList = municipalityData[internalSelectedPrefecture];
      const municipality = municipalityList?.find(m => m.id === municipalityId);
      if (municipality){
        onMunicipalitySelect(municipality);
      }
    } else{
      onMunicipalitySelect(null);
    }
  };


  //市区町村が選択されたことをstateに報告
  const handleSearchResultClick = (municipality:MunicipalityData) =>{
    setInternalSelectedPrefecture(municipality.prefecture);
    setInternalSelectedMunicipality(municipality.id);
    setSearchQuery(`${municipality.prefecture} ${municipality.name}`);
    setSearchResults([]); // 検索結果をクリア
    setShowSearchResults(false);
    onMunicipalitySelect(municipality);
  };

  //地方が選択された時にstateに伝える
  const handleRegionChange = (regionName:string) =>{
    setSelectedRegion(regionName);
  };

  //検索方法の切り替え
  const handleSearchMethodChange = (method:"select"|"search") =>{
    setSearchMethod(method);
    if (method ==="search"){
      setSearchQuery("");
      setSearchResults([]);
      setShowSearchResults(false);
      setInternalSelectedMunicipality("");
      onMunicipalitySelect(null);
    } else{
      setSearchQuery("");
      setSearchResults([]);
      setShowSearchResults(false);
      onMunicipalitySelect(null);
    }
  };

  if(isLoading){
    return(
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="text-gray-600">データを読み込み中です...</div>
      </div>
    );
  }

  return(
    <div className={`flex items-center space-x-4 ${className}`}>
      {/*表示方法の切り替え*/}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleSearchMethodChange("select")}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            searchMethod ==="select" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`} >
            選択
        </button>
        <button
          onClick={() => handleSearchMethodChange("search")}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            searchMethod ==="search" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`} >
            検索
        </button>
      </div>

      {searchMethod ==="search" && (
        <div className="relative">
          <InputRegion {...{searchInputRef, searchQuery, setSearchQuery, showSearchResults, setShowSearchResults, searchPlaceholder}} />
          {showSearchResults && searchResults.length > 0 &&(
          <DropdownRef {...{searchDropdownRef,searchResults,handleSearchResultClick}}/>
          )}
          {showSearchResults && searchQuery && searchResults.length === 0 &&(
            <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 text-center text-gray-500">
              「{searchQuery}」に一致する市区町村が見つかりませんでした
            </div>
          )}
        </div>
      )}

      {/*選択モード */}
      {searchMethod === "select" &&(
        <>
        {/*地方選択 */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">地方:</label>
          <select
          value={selectedRegion}
          onChange={(e) => handleRegionChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
            value={internalSelectedPrefecture}
            onChange={(e) => setInternalSelectedPrefecture(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!selectedRegion && Object.keys(municipalityData).length ===0}>
              <option value="">{placeholder}</option>
              {(selectedRegion ? availablePrefectures: Object.keys(municipalityData))
              .filter(prefecture => municipalityData[prefecture])
              .map(prefecture => (
                <option key={prefecture} value={prefecture}>{prefecture}</option>
              ))}
            </select>
        </div>

        {/*市区町村選択 */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">市区町村:</label>
          <select 
            value={internalSelectedMunicipality}
            onChange={(e) => handleMunicipalityChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!internalSelectedPrefecture}>
              <option value="">{placeholder}</option>
              {municipalityData[internalSelectedPrefecture]?.map(municipality => (
                <option key={municipality.id} value={municipality.id}>
                  {municipality.name}
                </option>
              ))}
            </select>
        </div>
        </>
      )}
    </div>
  );
}