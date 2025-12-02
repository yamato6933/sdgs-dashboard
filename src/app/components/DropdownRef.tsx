import { getRegionByPrefecture } from "../sdgs/municipality/region-mapping";
import { MunicipalityData } from "../sdgs/types";

export type DropdownRefProps = {
  searchDropdownRef: React.RefObject<HTMLDivElement | null>;
  searchResults: MunicipalityData[];
  handleSearchResultClick: (municipality: MunicipalityData) => void;
};


export function DropdownRef({searchDropdownRef, searchResults, handleSearchResultClick}: DropdownRefProps) {
    return (
        <>
            <div
                ref={searchDropdownRef}
                className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                {searchResults.map((municipality) => (
                    <button
                        key={municipality.id}
                        onClick={() => handleSearchResultClick(municipality)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-medium text-gray-900">
                                    {municipality.prefecture} {municipality.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {getRegionByPrefecture(municipality.prefecture)?.description || "不明"} | SDGsスコア: {municipality.scores.overall}%
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-medium text-blue-600">
                                    {municipality.scores.overall}%
                                </div>
                                <div className="text-xs text-gray-500">総合スコア</div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </>
    )
}