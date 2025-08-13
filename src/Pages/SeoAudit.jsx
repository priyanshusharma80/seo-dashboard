import React, { useState } from 'react'
import axios from 'axios'

const SeoAudit = () => {

    const [URL, setURL] = useState('');
    const [auditData, setAuditData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isUrlValid, setIsURLValid] = useState(false)

    // const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\s*)?$/;
    // const urlPattern = /^https?:\/\/([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;
    // Allow protocol to be optional
    // const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;
    // Protocol optional, domain must be valid, path optional
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s#]*)?$/;




    const normalizeUrl = (input) => {
        const v = input.trim();
        if (!v) return '';
        return /^https?:\/\//i.test(v) ? v : `https://${v}`;
    };

    const handleURLChange = (e) => {
        const value = e.target.value;
        setURL(value);

        const trimmedURL = value.trim();
        if (!trimmedURL) {
            setError('Please Enter A URL');
            setIsURLValid(false);
            return;
        }

        const normalizedURL = normalizeUrl(trimmedURL);

        if (!value) {
            setError('Please Enter a URL')
            setIsURLValid(false);
        }
        else if (!urlPattern.test(value)) {
            setError('Please Enter a valid URL')
            setIsURLValid(false);
        }
        else {
            setError('');
            setIsURLValid(true);
        }

    }

    const handleClick = async () => {
        if (!URL.trim() || !isUrlValid) return;
        setLoading(true);
        setAuditData(null);
        
        const finalURL = normalizeUrl(URL);


        // using codetabs api

        try {
            const [res, performanceData] = await Promise.all([
                axios.get(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(finalURL)}`),
                axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${finalURL}&key=${process.env.REACT_APP_PSI_API_KEY}&strategy=desktop`)
            ]);

            const parser = new DOMParser();
            const document = parser.parseFromString(res.data, 'text/html');

            const title = document.querySelector('title')?.innerText || 'Not Found';
            const description = document.querySelector('meta[name="description"]')?.content || 'Not Found';
            const ogTitle = document.querySelector('meta[property="og:title"]')?.content || 'Not Found';
            const ogDescription = document.querySelector('meta[property="og:description"]')?.content || 'Not Found';

            const headings = {};
            for (let i = 1; i <= 6; i++) {
                console.log(headings)
                const temp = Array.from(document.querySelectorAll(`h${i}`)).map(h => h.innerText.trim());
                headings[`h${i}`] = temp;
            }

            console.log(headings)

            const images = Array.from(document.querySelectorAll('img')).map(img => {
                return {
                    src: img.src,
                    alt: img.alt || 'Alt Text not found'
                }
            });


            const auditData = performanceData.data.lighthouseResult.audits;

            const metrics = {
                fcp: auditData['first-contentful-paint'].displayValue || '',
                lcp: auditData['largest-contentful-paint'].displayValue || '',
                tbt: auditData['total-blocking-time'].displayValue || '',
                cls: auditData['cumulative-layout-shift'].displayValue || '',
                speedIndex: auditData['speed-index'].displayValue || '',
            }

            console.log('Performance Data', performanceData);

            setAuditData({ title, description, ogTitle, ogDescription, headings, images, metrics });

        }
        catch (err) {
            setError('Failed to Fetch Data');
        }
        setLoading(false);
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
            <h2 className='text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100'>SEO Audit Tool</h2>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                    type="url"
                    onChange={handleURLChange}
                    placeholder='Enter URL'
                    className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                />
                <button
                    onClick={handleClick}
                    disabled={!isUrlValid || loading}
                    className='bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded shadow transition'
                >
                    {loading ? "Auditing..." : "Audit"}
                </button>
            </div>

            {error && <p className='text-red-500 font-medium mb-4'>{error}</p>}

            {auditData && (
                <div className="mt-6 space-y-6">
                    {/* Meta Tags rendering */}
                    <div className="p-4 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
                        <h3 className='font-bold text-lg mb-2 text-gray-800 dark:text-gray-100'>Meta Tags</h3>
                        <p className="text-gray-700 dark:text-gray-300"><strong>Title:</strong> {auditData.title}</p>
                        <p className="text-gray-700 dark:text-gray-300"><strong>Description:</strong> {auditData.description}</p>
                        <p className="text-gray-700 dark:text-gray-300"><strong>OG Title:</strong> {auditData.ogTitle}</p>
                        <p className="text-gray-700 dark:text-gray-300"><strong>OG Description:</strong> {auditData.ogDescription}</p>
                    </div>

                    {/* Headings all */}
                    <div className="p-4 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
                        <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">Headings</h3>
                        {Object.entries(auditData.headings).map(([tag, list]) => (
                            <div key={tag} className="mb-3">
                                <strong className="text-blue-500">{tag.toUpperCase()}:</strong>
                                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                    {list.length ? list.map((text, i) => <li key={i}>{text}</li>) : <li>None</li>}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Images */}
                    <div className="p-4 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
                        <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">Images Alt Text</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 break-all">
                            {auditData.images.map((img, i) => (
                                <li key={i}>
                                    {img.alt} <span className="text-gray-500">({img.src})</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Page Load Metrics */}
                    <div className="p-4 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
                        <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">Page Load Metrics</h3>
                        {Object.entries(auditData.metrics).map(([key, value]) => (
                            <p key={key} className="text-gray-700 dark:text-gray-300">
                                <strong>{key.toUpperCase()}:</strong> {value}
                            </p>
                        ))}
                    </div>

                </div>
            )}
        </div>
    )
}

export default SeoAudit
