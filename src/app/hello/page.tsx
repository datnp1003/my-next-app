'use client';

import { useEffect, useState } from 'react';

export default function HelloPage() {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Good Morning');
        } else if (hour < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-sky-900 mb-4 transition-all 
                        animate-fade-in-down">
                        {greeting}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto 
                        animate-fade-in-up delay-300">
                        Welcome to our simple responsive page example.</p>
                </div>                
                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] sm:gap-[24px] lg:gap-[15px]">
                    {/* Card 1 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all 
                        transform hover:-translate-y-1 duration-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Responsive</h3>
                        <p className="text-gray-600">
                            Adapts perfectly to any screen size
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all 
                        transform hover:-translate-y-1 duration-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Modern</h3>
                        <p className="text-gray-600">
                            Built with the latest technologies
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all 
                        transform hover:-translate-y-1 duration-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast</h3>
                        <p className="text-gray-600">
                            Optimized for maximum performance
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all 
                        transform hover:-translate-y-1 duration-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Beautiful</h3>
                        <p className="text-gray-600">
                            Clean and modern design principles
                        </p>
                    </div>                
                </div>

                {/* Content Section with 3:9 ratio */}
                <div className="mt-16 grid grid-cols-12 gap-6">
                    {/* Sidebar - spans 3 columns */}
                    <div className="col-span-3 bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sidebar</h3>
                        <ul className="space-y-2">
                            <li className="p-2 hover:bg-sky-50 rounded-md cursor-pointer transition-colors">
                                Menu Item 1
                            </li>
                            <li className="p-2 hover:bg-sky-50 rounded-md cursor-pointer transition-colors">
                                Menu Item 2
                            </li>
                            <li className="p-2 hover:bg-sky-50 rounded-md cursor-pointer transition-colors">
                                Menu Item 3
                            </li>
                            <li className="p-2 hover:bg-sky-50 rounded-md cursor-pointer transition-colors">
                                Menu Item 4
                            </li>
                        </ul>
                    </div>

                    {/* Main Content - spans 9 columns */}
                    <div className="col-span-9 bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Main Content</h2>
                        <p className="text-gray-600 mb-4">
                            This is the main content area taking up 75% of the available space. You can add any content here
                            and it will maintain the 3:9 ratio with the sidebar.
                        </p>
                        <p className="text-gray-600 mb-4">
                            The grid system uses a 12-column layout where the sidebar takes up 3 columns (25%) and the main
                            content takes up 9 columns (75%).
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-sky-50 p-4 rounded-md">
                                <h4 className="font-semibold text-sky-900">Sub Section 1</h4>
                                <p className="text-gray-600">Additional content can be organized in grid layouts.</p>
                            </div>
                            <div className="bg-sky-50 p-4 rounded-md">
                                <h4 className="font-semibold text-sky-900">Sub Section 2</h4>
                                <p className="text-gray-600">Each section maintains proper spacing and alignment.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <button className="
                        px-8 py-3 
                        bg-gradient-to-r from-sky-500 to-sky-600 
                        text-white font-semibold 
                        rounded-lg
                        transform transition-all duration-200
                        hover:from-sky-600 hover:to-sky-700
                        hover:scale-105
                        active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2
                        shadow-lg hover:shadow-xl
                    ">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
}
