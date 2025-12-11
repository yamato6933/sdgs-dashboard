import { MunicipalityData } from "../mapping/types";
import { getRegionByPrefecture } from "../sdgs/municipality/region-mapping";
import PrefectureSelection from "../mapping/utils/prefectureselection";

export function SelectRegion({ currentData, onMunicipalitySelect }: { currentData: MunicipalityData | null; onMunicipalitySelect: (municipality: MunicipalityData | null) => void }) {
    return(
        <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">都道府県を選択</h2>
                            <p className="text-sm text-gray-600">マップで可視化したい都道府県を選択してください。</p>
                        </div>
                    </div>
                    {/*PrefectureSelectコンポーネントを表示 */}
                    <div className="w-full">
                        <PrefectureSelection
                            onMunicipalitySelect={onMunicipalitySelect}
                            placeholder="選択してください"
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}