export function InputRegion({searchInputRef, searchQuery, setSearchQuery, showSearchResults, setShowSearchResults, searchPlaceholder}:{
    searchInputRef: React.RefObject<HTMLInputElement | null>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    showSearchResults: boolean;
    setShowSearchResults: React.Dispatch<React.SetStateAction<boolean>>;
    searchPlaceholder?: string;
}) {
    return(
        <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">市区町村を検索(漢字で検索してくださいex:横浜市、播磨町)</label>
            <div className="relative">
              <input 
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim() !== "") {
                    setShowSearchResults(true);
                  }
                }}
                placeholder={searchPlaceholder}
                className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
              <div className="absolute right-3 top-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
    )
}