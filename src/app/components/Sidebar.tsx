'use client';

import Link from 'next/link';
import { SidebarData } from './SidebarData';
import { usePathname } from 'next/navigation';
import { useStateStore } from '../store/useStateStore';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

export function Sidebar(){
    const pathname = usePathname();

    const {sidebarOpen, setSidebarOpen} = useStateStore();
    return(
        <>
            {sidebarOpen && (
                <div className="w-64 bg-white p-6">
                    <div className="text-2xl flex font-bold text-gray-900 mb-8 justify-between items-center">
                        <h3>JYR. ポータル</h3>
                        <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-900">
                            <KeyboardDoubleArrowLeftIcon/>
                        </button>
                    </div>
                    <ul className='SidebarList'>
                        {SidebarData.map((item, index) => (
                            <li 
                            key={index} 
                            className={`mb-4 hover:bg-blue-50 p-2 rounded-md
                            ${pathname === item.link 
                            ? 'bg-blue-100' : ''}`}>
                            <Link href={item.link} className="no-underline">
                                <div className="text-gray-600 hover:text-blue-600 flex items-center cursor-pointer">
                                    <item.icon/>
                                    <div className="ml-4">{item.title}</div>
                                </div>
                            </Link>
                            </li>
                        ))}
                    </ul>

                </div>
            )}
        </>
    )
}