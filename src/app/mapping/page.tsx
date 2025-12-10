'use client';
import { useState } from 'react';
import { MunicipalityData } from './types';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Sidebar } from '../components/Sidebar';
import { SelectRegion } from '../components/SelectRegionPrefecture';
import { DataInfo } from '../components/drawMap';

export default function MappingPage(){
    const [currentData, setCurrentData] = useState<MunicipalityData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleMunicipalitySelect = (municipality: MunicipalityData | null) => {
        if (municipality) {
            setIsLoading(true);
            setCurrentData(municipality);
            setIsLoading(false);
        } else {
            setCurrentData(null);
        }
     };

     return(
     <>
     <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-green-50">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen">
          <Header />

          <main className="flex-1 flex flex-col">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                    <SelectRegion currentData={currentData} onMunicipalitySelect={handleMunicipalitySelect}/>
               </div>
               
               <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
                    <DataInfo currentData={currentData} onReset={() => setCurrentData(null)} />
               </div>
          </main> 
          </div>
     </div>
     <Footer />
     </>
     )
}
