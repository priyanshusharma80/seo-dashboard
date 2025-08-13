import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function KeywordDensityAnalyzer() {
  const [text, setText] = useState("");
  const [keywordData, setKeywordData] = useState([]);
  const [debouncedText,setDeboucedText] = useState('')

  // applying debouncing of 300 ms

  useEffect(()=>{
    const timer = setTimeout(()=>{
        setDeboucedText(text);
    },300);

    // cleenup
    return ()=>clearTimeout(timer);
  },[text])

  // Calculate keyword frequency whenever text changes
  useEffect(() => {

    if(!debouncedText){
        setKeywordData([]);
        return ;
    }

    


    const words = debouncedText
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    const freq = {};
    words.forEach((word) => {
      freq[word] = (freq[word] || 0) + 1;
    });

    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10) // top 10 keywords
      .map(([word, count]) => ({ keyword: word, frequency: count }));

    setKeywordData(sorted);
  }, [debouncedText]);

  // Export JSON
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(keywordData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "keyword_density.json";
    link.click();
  };

  // Export CSV
  const exportCSV = () => {
    const csvRows = [
      ["Keyword", "Frequency"],
      ...keywordData.map((item) => [item.keyword, item.frequency]),
    ];
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "keyword_density.csv";
    link.click();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Keyword Density Analyzer
      </h2>

      <textarea
        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        rows={6}
        placeholder="Paste your content here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {keywordData.length > 0 && (
        <div className="mb-6 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm overflow-x-auto">
          <div style={{ width: "800px", height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={keywordData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="keyword" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    color: "#fff",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="frequency" fill="#3B82F6" barSize={window.innerWidth < 640 ? 40 : 45}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {keywordData.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportJSON}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow transition"
          >
            Export JSON
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded shadow transition"
          >
            Export CSV
          </button>
        </div>
      )}
    </div>
  );
}
