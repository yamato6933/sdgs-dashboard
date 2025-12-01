import Link from 'next/link';
import { useState } from 'react';


export function Header(){
  return(
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
              <Link href="/">
              <h1 className="text-3xl font-bold text-gray-900 hover:text-blue-600">JYR. ポータル</h1>
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link href="/sdgs" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  ダッシュボード
                </Link>
                <Link href="/policy" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  政策効果
                </Link>
                <Link href="/compare" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  比較モード
                </Link>
              </nav>
          </div>
        </div>
      </header>
  )
}