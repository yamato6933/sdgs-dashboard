import { MunicipalityData } from "../mapping/types";
import { JapanMapWithClustering } from "./JapanMapWithClustering";

type DataInfoProps = {
    currentData: MunicipalityData | null;
    onReset: () => void;
    };

export function DataInfo({ currentData, onReset }: DataInfoProps) {
    return <JapanMapWithClustering prefecture={currentData?.prefecture || ''} onReset={onReset} />;
}