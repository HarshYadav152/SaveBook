export default function Loader() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative">
                {/* Pulsing circles */}
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-30"></div>
                <div className="absolute inset-0 animate-ping rounded-full bg-purple-500 opacity-20" style={{ animationDelay: "0.2s" }}></div>
                
                {/* Spinner */}
                <div className="h-16 w-16 rounded-full border-4 border-gray-700 border-t-blue-500 border-r-purple-600 animate-spin"></div>
                
                {/* Loading dot animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="h-2 w-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                    </div>
                </div>
            </div>
            
            {/* Loading text */}
            <div className="mt-4 text-center">
                <p className="text-gray-300 text-sm font-medium">
                    Loading
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>.</span>
                    <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>.</span>
                </p>
            </div>
        </div>
    );
}