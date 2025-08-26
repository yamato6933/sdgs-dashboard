'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { SDGS_GOALS } from './sdgs/sdgs-data';


export default function Home(){
  const [hoveredGoal, setHoveredGoal] = useState<number | null>(null);
  
  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">JYR. ポータル</h1>
              <nav className="hidden md:flex space-x-8">
                <Link href="/sdgs" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  ダッシュボード
                </Link>
                <Link href="/policy" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  政策効果
                </Link>
              </nav>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* VS Code風のレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-20">
          {/* 左側: ダッシュボードの説明 */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  SDGs 可視化プラットフォーム
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                JYR. ポータル
              </h1>
            </div>
            <div className="space-y-6">
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                日本全国の市区町村ごとのSDGs（持続可能な開発目標）の達成度をスコアとして可視化し、
                それぞれの地域における政策の効果や課題を一目で把握できるダッシュボードです。
              </p>
              
              {/* 機能ハイライト */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800">データ分析</h3>
                  </div>
                  <p className="text-sm text-gray-600">全国1,700以上の市区町村のSDGsスコアを比較</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800">可視化</h3>
                  </div>
                  <p className="text-sm text-gray-600">17の目標ごとの詳細な分析とレーダーチャート</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800">AI洞察</h3>
                  </div>
                  <p className="text-sm text-gray-600">AIによる洞察と改善提案</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800">政策効果</h3>
                  </div>
                  <p className="text-sm text-gray-600">政策の効果測定と課題の特定</p>
                </div>
              </div>
              
              <div className="pt-6">
                <Link 
                  href="/sdgs" 
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  ダッシュボードを見る
                  <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* 右側: クリックでダッシュボードへ遷移する実画像 */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <Link href="/sdgs" className="block group">
              <img 
                src="/sdgs_dashboard.png"
                alt="SDGs ダッシュボード"
                className="w-full max-w-lg h-auto rounded-2xl shadow-2xl transition-transform duration-300 group-hover:-translate-y-1"
              />
              <p className="text-center text-gray-600 mt-4 text-sm group-hover:text-blue-600 transition-colors">
                クリックしてダッシュボードを表示
              </p>
            </Link>
          </div>
        </div>

        {/* 政策効果ページの紹介セクション */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-20">
          {/* 左側: クリックで政策効果ページへ遷移する実画像 */}
          <div className="flex justify-center lg:justify-start order-1 lg:order-1">
            <Link href="/policy" className="block group">
              <img 
                src="/policy_image.png"
                alt="政策効果 分析ページ"
                className="w-full max-w-lg h-auto rounded-2xl shadow-2xl transition-transform duration-300 group-hover:-translate-y-1"
              />
              <p className="text-center text-gray-600 mt-4 text-sm group-hover:text-blue-600 transition-colors">
                クリックして政策効果ページを表示
              </p>
            </Link>
          </div>

          {/* 右側: 政策効果の説明 */}
          <div className="space-y-8 order-2 lg:order-2">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                  政策効果分析モジュール
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                政策効果の可視化と因果推論
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                上位自治体の政策をAIで調査し、選択した政策の効果を<strong className="font-semibold">類似群（対照群）</strong>と
                比較。2015年→2020年のスコア変化を用いた<strong className="font-semibold">Difference-in-Differences</strong>（DiD）で
                統計的に検証できます。
              </p>

              {/* 機能ハイライト */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800">AI政策調査</h3>
                  </div>
                  <p className="text-sm text-gray-600">上位自治体の政策・年度・概算予算を自動収集</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800">類似群（対照群）の作成</h3>
                  </div>
                  <p className="text-sm text-gray-600">2015年の全17ゴールからユークリッド距離で近い自治体を抽出</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 012-2h2a2 2 0 002-2V7" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800">DiD因果推論</h3>
                  </div>
                  <p className="text-sm text-gray-600">t検定・p値を計算し、統計的有意性を自動判定</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h11M9 21V3m12 7h-5m0 0l2-2m-2 2l2 2" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800">高速キャッシュ</h3>
                  </div>
                  <p className="text-sm text-gray-600">一度生成したAI分析はSQLiteに保存し再利用</p>
                </div>
              </div>

              <div className="pt-2">
                <Link 
                  href="/policy" 
                  className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  政策効果分析を見る
                  <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

      {/* SDGs目標グリッド */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">17の持続可能な開発目標</h3>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {SDGS_GOALS.map((goal) => (
            <div
              key={goal.id}
              className="rounded-lg p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: goal.color }}
              onMouseEnter={() => setHoveredGoal(goal.id)}
              onMouseLeave={() => setHoveredGoal(null)}
            >
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Image 
                    src={`/sdgs_goals_icons/${goal.id}.png`}
                    alt={`SDG ${goal.id} アイコン`}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-contain bg-white bg-opacity-20 rounded-lg p-3"
                  />
                </div>
                <div className="text-2xl font-bold mb-2">{goal.id}</div>
                <h4 className="font-semibold text-sm leading-tight mb-2">{goal.title}</h4>
                {hoveredGoal === goal.id && (
                  <p className="text-xs opacity-90 leading-relaxed">{goal.description}</p>
                )}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
      </main> 
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{/*レスポンシブデザインに必要*/}
          <div className='text-center'>
            <p className='text-gray-300'>
              generated by JYR
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}