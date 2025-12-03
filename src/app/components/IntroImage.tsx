import Link from "next/link";
import { IntroData } from "../store/IntroData";

export function IntroImage({introData,id}: {introData: IntroData[], id: number}) {
    const data = introData.find((item) => item.id === 1);

    return (
        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <Link href={data?.linkUrl || "/sdgs"} className="block group">
              <img 
                src="/sdgs_dashboard.png"
                alt="SDGs ダッシュボード"
                className="w-full max-w-lg h-auto rounded-2xl shadow-2xl transition-transform duration-300 group-hover:-translate-y-1"
              />
              <p className="text-center text-gray-600 mt-4 text-sm group-hover:text-blue-600 transition-colors">
                {data?.linkText}
              </p>
            </Link>
        </div>
    )
}