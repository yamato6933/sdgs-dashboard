export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <div className="ml-4 text-lg text-gray-700">読み込み中...</div>
        </div>
    );
}