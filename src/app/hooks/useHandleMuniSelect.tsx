import { useState } from "react";
import { MunicipalityData } from "../sdgs/types";

export const useHandleMuniSelect = () => {
    const [currentData, setCurrentData] = useState<MunicipalityData | null>(null);
    const handleCompareSelect = (municipality: MunicipalityData | null) => {
        if (municipality) {
            setCurrentData(municipality);
        } else {
            setCurrentData(null);
        }
    };
    return {currentData}
}