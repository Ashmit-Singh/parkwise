import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Species = () => {
    const [species, setSpecies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                const response = await axios.get('/api/species');
                setSpecies(response.data);
            } catch (error) {
                console.error('Error fetching species:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSpecies();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-16 flex items-center justify-center">
                <p className="text-gray-600">Loading species...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-center">
                    Flora & Fauna
                </h1>
                <p className="text-xl text-gray-600 text-center mb-12">
                    Discover India's rich biodiversity
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {species.map((spec) => (
                        <div key={spec.id} className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{spec.name}</h3>
                            <p className="text-gray-500 italic mb-2">{spec.scientificName}</p>
                            <p className="text-gray-600 text-sm mb-4">{spec.description}</p>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {spec.conservationStatus}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Species;