import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Upload, Search, Award, TrendingUp, MapPin, AlertTriangle, CheckCircle, Eye, Users } from 'lucide-react';

const Species = () => {
    const [species, setSpecies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // all, endangered, recent

    // Placeholder data for when API returns empty
    const placeholderSpecies = [
        {
            id: 1,
            name: 'Bengal Tiger',
            scientificName: 'Panthera tigris tigris',
            description: 'The Bengal tiger is a population of the Panthera tigris tigris subspecies and the nominate tiger subspecies. It ranks among the biggest wild cats alive today.',
            conservationStatus: 'Endangered',
            habitat: 'Tropical forests, grasslands',
            sightings: 1247,
            lastSeen: '2 days ago',
            imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400',
            category: 'Mammal'
        },
        {
            id: 2,
            name: 'Indian Elephant',
            scientificName: 'Elephas maximus indicus',
            description: 'The Indian elephant is one of three extant recognized subspecies of the Asian elephant and native to mainland Asia.',
            conservationStatus: 'Endangered',
            habitat: 'Forests, grasslands',
            sightings: 892,
            lastSeen: '1 day ago',
            imageUrl: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400',
            category: 'Mammal'
        },
        {
            id: 3,
            name: 'Indian Peafowl',
            scientificName: 'Pavo cristatus',
            description: 'The Indian peafowl, also known as the common peafowl and blue peafowl, is a peafowl species native to the Indian subcontinent.',
            conservationStatus: 'Least Concern',
            habitat: 'Forests, farmlands',
            sightings: 3421,
            lastSeen: 'Today',
            imageUrl: 'https://images.unsplash.com/photo-1568641389310-145c1f15a6f2?w=400',
            category: 'Bird'
        },
        {
            id: 4,
            name: 'One-horned Rhinoceros',
            scientificName: 'Rhinoceros unicornis',
            description: 'The Indian rhinoceros, also called the Indian rhino, greater one-horned rhinoceros or great Indian rhinoceros, is a rhinoceros species native to the Indian subcontinent.',
            conservationStatus: 'Vulnerable',
            habitat: 'Grasslands, wetlands',
            sightings: 456,
            lastSeen: '3 days ago',
            imageUrl: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400',
            category: 'Mammal'
        },
        {
            id: 5,
            name: 'Asiatic Lion',
            scientificName: 'Panthera leo persica',
            description: 'The Asiatic lion is a lion population of the subspecies Panthera leo leo. Until the 19th century, it occurred in Saudi Arabia, eastern Turkey, Iran, Mesopotamia, and from east of the Indus River in Pakistan to the Bengal region in India.',
            conservationStatus: 'Endangered',
            habitat: 'Dry deciduous forests',
            sightings: 234,
            lastSeen: '5 days ago',
            imageUrl: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400',
            category: 'Mammal'
        },
        {
            id: 6,
            name: 'Snow Leopard',
            scientificName: 'Panthera uncia',
            description: 'The snow leopard, also known as the ounce, is a felid in the genus Panthera native to the mountain ranges of Central and South Asia.',
            conservationStatus: 'Vulnerable',
            habitat: 'Alpine and subalpine zones',
            sightings: 89,
            lastSeen: '1 week ago',
            imageUrl: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400',
            category: 'Mammal'
        }
    ];

    useEffect(() => {
        const fetchSpecies = async () => {
            try {
                const response = await axios.get('/species');
                if (response.data && response.data.length > 0) {
                    setSpecies(response.data);
                } else {
                    setSpecies(placeholderSpecies);
                }
            } catch (error) {
                console.error('Error fetching species:', error);
                setSpecies(placeholderSpecies);
            } finally {
                setLoading(false);
            }
        };
        fetchSpecies();
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'endangered':
            case 'critically endangered':
                return 'bg-red-100 text-red-800';
            case 'vulnerable':
                return 'bg-orange-100 text-orange-800';
            case 'near threatened':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    const filteredSpecies = species.filter(spec => {
        if (activeTab === 'endangered') {
            return spec.conservationStatus?.toLowerCase().includes('endangered') || 
                   spec.conservationStatus?.toLowerCase().includes('vulnerable');
        }
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen pt-16 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading species data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 bg-gradient-to-b from-green-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Citizen Science Portal
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-green-100">
                            Help identify and track wildlife species with AI-powered recognition
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition flex items-center gap-2">
                                <Camera className="h-5 w-5" />
                                Report Sighting
                            </button>
                            <button className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Upload Photo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-gray-800">6,423</div>
                        <div className="text-gray-600">Total Sightings</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-gray-800">1,247</div>
                        <div className="text-gray-600">Contributors</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-gray-800">89%</div>
                        <div className="text-gray-600">AI Accuracy</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-gray-800">156</div>
                        <div className="text-gray-600">Species Tracked</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-6 py-3 font-semibold transition border-b-2 ${
                            activeTab === 'all'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        All Species
                    </button>
                    <button
                        onClick={() => setActiveTab('endangered')}
                        className={`px-6 py-3 font-semibold transition border-b-2 flex items-center gap-2 ${
                            activeTab === 'endangered'
                                ? 'border-red-600 text-red-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <AlertTriangle className="h-4 w-4" />
                        Endangered
                    </button>
                </div>

                {/* Species Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSpecies.map((spec) => (
                        <div key={spec.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 group">
                            {/* Image */}
                            <div className="relative h-48 bg-gradient-to-br from-green-400 to-emerald-600 overflow-hidden">
                                {spec.imageUrl ? (
                                    <img 
                                        src={spec.imageUrl} 
                                        alt={spec.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Camera className="h-16 w-16 text-white opacity-50" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(spec.conservationStatus)}`}>
                                        {spec.conservationStatus || 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{spec.name}</h3>
                                <p className="text-gray-500 italic text-sm mb-3">{spec.scientificName}</p>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{spec.description}</p>
                                
                                {/* Meta Info */}
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        <span>{spec.sightings || 0} sightings</span>
                                    </div>
                                    {spec.lastSeen && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            <span>{spec.lastSeen}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold">
                                        View Details
                                    </button>
                                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                                        <Camera className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredSpecies.length === 0 && (
                    <div className="text-center py-12">
                        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No species found</p>
                    </div>
                )}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Become a Citizen Scientist</h2>
                    <p className="text-xl text-green-100 mb-6">
                        Your observations help protect India's incredible biodiversity
                    </p>
                    <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Species;