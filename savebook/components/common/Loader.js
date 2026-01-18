// Extract the dot animation as a separate component that can be wrapped in Suspense
const LoadingDots = () => {
  return (
    <div className="flex space-x-1">
      <div className="h-2 w-2 rounded-full bg-blue-400 dark:bg-blue-400 animate-bounce" style={{ animationDelay: "0.1s" }}></div>
      <div className="h-2 w-2 rounded-full bg-indigo-400 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      <div className="h-2 w-2 rounded-full bg-purple-400 dark:bg-purple-400 animate-bounce" style={{ animationDelay: "0.3s" }}></div>
    </div>
  );
};

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Pulsing circles */}
        <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 dark:bg-blue-400 opacity-30"></div>
        <div className="absolute inset-0 animate-ping rounded-full bg-purple-500 dark:bg-purple-400 opacity-20" style={{ animationDelay: "0.2s" }}></div>
        
        {/* Spinner with theme awareness */}
        <div className="h-16 w-16 rounded-full border-4 border-gray-300 dark:border-slate-700 border-t-blue-500 dark:border-t-blue-400 border-r-purple-600 dark:border-r-purple-400 animate-spin"></div>
        
        {/* Loading dot animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingDots />
        </div>
      </div>
    </div>
  );
}