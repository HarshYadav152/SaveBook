
"use client";
import React, { useState, useEffect } from 'react';

const LinkPreviewCard = ({ url }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/link-preview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url }),
                });

                if (!res.ok) throw new Error('Failed to fetch');

                const previewData = await res.json();
                if (!previewData.title) throw new Error('No metadata');

                setData(previewData);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (url) {
            fetchData();
        }
    }, [url]);

    if (loading) return (
        <div className="mt-2 w-full max-w-sm rounded-lg border border-gray-700 bg-gray-800 p-3 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
    );

    if (error || !data) return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block w-full max-w-2xl rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors p-4 group no-underline text-left pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center text-gray-400">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm font-medium">No preview available for {new URL(url).hostname}</span>
            </div>
        </a>
    );

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block w-full max-w-2xl rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors overflow-hidden group no-underline text-left pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex flex-col sm:flex-row h-full">
                {data.image && (
                    <div className="sm:w-32 sm:h-auto h-48 relative flex-shrink-0 bg-gray-900 overflow-hidden">
                        <img
                            src={data.image}
                            alt=""
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}
                <div className="p-3 flex-1 flex flex-col justify-center min-w-0">
                    <h4 className="text-sm font-semibold text-gray-200 line-clamp-1 mb-1 group-hover:text-blue-400 transition-colors">
                        {data.title}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                        {data.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-auto">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span className="truncate">{new URL(url).hostname}</span>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default LinkPreviewCard;
