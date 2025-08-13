import React, { useState } from "react";

export default function SERPPreview() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [view, setView] = useState("desktop");
    const [snippetType, setSnippetType] = useState("none");

    const maxTitleLength = 60;
    const maxDescriptionLength = 160;

    const formatURL = (rawUrl) => {
        if (!rawUrl) return "";

        try {
            let urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
            let domain = urlObj.hostname.replace("www.", "");
            let ps = urlObj.pathname
                .split("/")
                .filter((item)=>item.length>0)
                .map(item => decodeURIComponent(item));

            return [domain, ...ps].join(" › ");
        } catch {
            return rawUrl;
        }
    };


    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                SERP Preview Generator
            </h2>



            {/* Title Input */}
            <div className="mb-4">
                <label className="block font-medium text-gray-700 dark:text-gray-200">Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter page title..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div
                    className={`text-xs mt-1 ${title.length > maxTitleLength ? "text-red-500" : "text-gray-500"
                        }`}
                >
                    {title.length}/{maxTitleLength} characters
                </div>
            </div>

            {/* Description Input */}
            <div className="mb-4">
                <label className="block font-medium text-gray-700 dark:text-gray-200">Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter meta description..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div
                    className={`text-xs mt-1 ${description.length > maxDescriptionLength ? "text-red-500" : "text-gray-500"
                        }`}
                >
                    {description.length}/{maxDescriptionLength} characters
                </div>
            </div>

            {/* URL Input */}
            <div className="mb-4">
                <label className="block font-medium text-gray-700 dark:text-gray-200">URL:</label>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter page URL..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* View Options */}
            <div className="mb-4 flex gap-4 text-gray-700 dark:text-gray-200">
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        value="desktop"
                        checked={view === "desktop"}
                        onChange={() => setView("desktop")}
                    />
                    Desktop View
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        value="mobile"
                        checked={view === "mobile"}
                        onChange={() => setView("mobile")}
                    />
                    Mobile View
                </label>
            </div>

            {/* Rich Snippet Type */}
            <div className="mb-6 text-gray-700 dark:text-gray-200">
                <label className="block font-medium mb-1">Rich Snippet Type:</label>
                <select
                    value={snippetType}
                    onChange={(e) => setSnippetType(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                    <option value="none">None</option>
                    <option value="stars">Star Rating</option>
                    <option value="event">Event</option>
                    <option value="recipe">Recipe</option>
                    <option value="product">Product</option>
                </select>
            </div>

            {/* Preview */}
            <div
                className={`border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 ${view === "mobile" ? "max-w-xs" : "max-w-xl"
                    }`}
            >
                <div className="text-green-700 dark:text-green-400 text-sm">
                    {formatURL(url) || "example.com › solution › templates"}
                </div>
                <div className="text-blue-700 dark:text-blue-400 text-lg leading-tight">
                    {title || "Example Title - This is how your title will look on Google"}
                </div>
                

                {/* Rich Snippet Previews */}
                {snippetType === "stars" && (
                    <div className="text-gray-500 text-sm">⭐⭐⭐⭐⭐ 4.5 - 120 reviews</div>
                )}
                {snippetType === "event" && (
                    <div className="text-gray-500 text-sm">Aug 25, 2025 - Tech Conference, New York</div>
                )}
                {snippetType === "recipe" && (
                    <div className="text-gray-500 text-sm">45 mins - 250 calories</div>
                )}
                {snippetType === "product" && (
                    <div className="text-gray-500 text-sm">In stock - $19.99</div>
                )}

                <div className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                    {description ||
                        "This is how your meta description will appear in Google search results. Keep it concise and relevant."}
                </div>
            </div>
        </div>
    );
}
