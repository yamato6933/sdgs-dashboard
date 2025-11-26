import Link from 'next/link';
import { useState } from 'react';


export function Header(){
  const [hoveredGoal, setHoveredGoal] = useState<number | null>(null);
  
  return(
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
  )
}