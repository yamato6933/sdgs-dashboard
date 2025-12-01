import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStateStore } from '../store/useStateStore';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';


export function Header(){
  const pathname = usePathname();

  const {sidebarOpen, setSidebarOpen} = useStateStore();

  function OperateSidebar(){
    setSidebarOpen(true);
  }
  return(
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
              {sidebarOpen && (
                <span></span>
              )}
              {!sidebarOpen && (
                <button onClick={OperateSidebar} className="text-gray-500 hover:text-gray-900">
                  <KeyboardDoubleArrowRightIcon />
                </button>)}
              <div className="hidden md:flex space-x-8">
                <Link href="/" className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition-colors
                    ${pathname === '/' ? 'text-lg font-bold' : 'text-sm font-medium'}`}>
                  ホーム
                </Link>
                <Link href="/sdgs" className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition-colors
                    ${pathname === '/sdgs' ? 'text-lg font-bold' : 'text-sm font-medium'}`}>
                  可視化モード
                </Link>
                <Link href="/compare" className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition-colors
                    ${pathname === '/compare' ? 'text-lg font-bold' : 'text-sm font-medium'}`}>
                  比較モード
                </Link>
                <Link href="/policy" className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition-colors
                    ${pathname === '/policy' ? 'text-lg font-bold' : 'text-sm font-medium'}`}>
                  政策効果
                </Link>
              </div>
          </div>
        </div>
      </header>
  )
}