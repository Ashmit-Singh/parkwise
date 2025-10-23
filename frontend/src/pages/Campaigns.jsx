import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Target, Users, Calendar, TrendingUp, MapPin, Award, DollarSign, Clock, CheckCircle } from 'lucide-react';
import CampaignCard from '../components/molecules/CampaignCard';
import { motion } from 'framer-motion';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, active, completed

    // Placeholder campaigns data
    const placeholderCampaigns = [
        {
            id: 1,
            title: 'Save the Bengal Tigers',
            description: 'Help protect the majestic Bengal tigers in Sundarbans National Park through habitat restoration and anti-poaching initiatives.',
            targetAmount: 500000,
            currentAmount: 387500,
            donors: 1247,
            daysLeft: 15,
            location: 'Sundarbans, West Bengal',
            category: 'Wildlife Protection',
            status: 'active',
            imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600',
            impact: '250+ tigers protected'
        },
        {
            id: 2,
            title: 'Elephant Corridor Restoration',
            description: 'Create safe migration corridors for elephants in Karnataka to reduce human-wildlife conflict and protect elephant populations.',
            targetAmount: 350000,
            currentAmount: 298000,
            donors: 892,
            daysLeft: 22,
            location: 'Bandipur, Karnataka',
            category: 'Habitat Conservation',
            status: 'active',
            imageUrl: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600',
            impact: '50km corridor protected'
        },
        {
            id: 3,
            title: 'Snow Leopard Conservation',
            description: 'Support research and conservation efforts for the elusive snow leopards in the high Himalayas of Ladakh.',
            targetAmount: 250000,
            currentAmount: 189000,
            donors: 567,
            daysLeft: 30,
            location: 'Hemis, Ladakh',
            category: 'Research & Monitoring',
            status: 'active',
            imageUrl: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600',
            impact: '15 leopards tracked'
        },
        {
            id: 4,
            title: 'Rhinoceros Anti-Poaching Unit',
            description: 'Fund specialized anti-poaching teams to protect the one-horned rhinoceros in Kaziranga National Park.',
            targetAmount: 450000,
            currentAmount: 423000,
            donors: 1089,
            daysLeft: 8,
            location: 'Kaziranga, Assam',
            category: 'Anti-Poaching',
            status: 'active',
            imageUrl: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=600',
            impact: '180+ rhinos secured'
        },
        {
            id: 5,
            title: 'Asiatic Lion Habitat Expansion',
            description: 'Expand protected areas for Asiatic lions in Gir Forest to ensure genetic diversity and population growth.',
            targetAmount: 600000,
            currentAmount: 445000,
            donors: 1534,
            daysLeft: 45,
            location: 'Gir Forest, Gujarat',
            category: 'Habitat Expansion',
            status: 'active',
            imageUrl: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600',
            impact: '500+ lions protected'
        },
        {
            id: 6,
            title: 'Mangrove Reforestation',
            description: 'Plant 100,000 mangrove trees to restore coastal ecosystems and protect wildlife in the Sundarbans.',
            targetAmount: 200000,
            currentAmount: 200000,
            donors: 2341,
            daysLeft: 0,
            location: 'Sundarbans, West Bengal',
            category: 'Habitat Restoration',
            status: 'completed',
            imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
            impact: '100,000 trees planted'
        }
    ];

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get('/campaigns');
                if (response.data && response.data.length > 0) {
                    setCampaigns(response.data);
                } else {
                    setCampaigns(placeholderCampaigns);
                }
            } catch (error) {
                console.error('Error fetching campaigns:', error);
                setCampaigns(placeholderCampaigns);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    const calculateProgress = (current, target) => {
        return Math.min((current / target) * 100, 100);
    };

    const filteredCampaigns = campaigns.filter(campaign => {
        if (filter === 'active') return campaign.status === 'active';
        if (filter === 'completed') return campaign.status === 'completed';
        return true;
    });

    const totalRaised = campaigns.reduce((sum, c) => sum + (c.currentAmount || 0), 0);
    const totalDonors = campaigns.reduce((sum, c) => sum + (c.donors || 0), 0);
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

    if (loading) {
        return (
            <div className="min-h-screen pt-16 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading campaigns...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
                            <Heart className="w-5 h-5 text-pink-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Make an Impact
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
                            Conservation Campaigns
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-400">
                            Support critical wildlife conservation efforts across India
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-gray-800">${(totalRaised / 1000).toFixed(0)}K</div>
                        <div className="text-gray-600">Total Raised</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-gray-800">{totalDonors.toLocaleString()}</div>
                        <div className="text-gray-600">Total Donors</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-gray-800">{activeCampaigns}</div>
                        <div className="text-gray-600">Active Campaigns</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <div className="text-3xl font-bold text-gray-800">98%</div>
                        <div className="text-gray-600">Success Rate</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-3 font-semibold transition border-b-2 ${
                            filter === 'all'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        All Campaigns ({campaigns.length})
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-6 py-3 font-semibold transition border-b-2 ${
                            filter === 'active'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Active ({activeCampaigns})
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-6 py-3 font-semibold transition border-b-2 flex items-center gap-2 ${
                            filter === 'completed'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        <CheckCircle className="h-4 w-4" />
                        Completed
                    </button>
                </div>

                {/* Campaigns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCampaigns.map((campaign, index) => (
                        <motion.div
                            key={campaign.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <CampaignCard
                                id={campaign.id}
                                title={campaign.title}
                                description={campaign.description}
                                imageUrl={campaign.imageUrl}
                                currentAmount={campaign.currentAmount}
                                targetAmount={campaign.targetAmount}
                                supporters={campaign.donors}
                                daysLeft={campaign.daysLeft}
                                location={campaign.location}
                                category={campaign.category}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredCampaigns.length === 0 && (
                    <div className="text-center py-12">
                        <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No campaigns found</p>
                    </div>
                )}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Every Contribution Counts</h2>
                    <p className="text-xl text-blue-100 mb-6">
                        Join thousands of donors making a real difference in wildlife conservation
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                            Browse All Campaigns
                        </button>
                        <button className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
                            Start Your Own
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Campaigns;