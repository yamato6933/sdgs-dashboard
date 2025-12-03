'use client';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { SdgsGoalGrid } from './components/SdgsGoalGrid';
import { introData } from './store/IntroData';
import { IntroImage } from './components/IntroImage';
import { IntroContents } from './components/IntroContents';

export default function Home(){
  return(
    <>
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-green-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* SDGsダッシュボードの紹介セクション */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-20">
              <IntroContents introData={introData} id={1} />
              <IntroImage introData={introData} id={1} />
          </div>
          

          {/* 政策効果ページの紹介セクション */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-20">
            <IntroImage introData={introData} id={2} />
            <IntroContents introData={introData} id={2} />
          </div>

          <SdgsGoalGrid />
        </main> 
      </div>
    </div>
    <Footer />
    </>
  )
}