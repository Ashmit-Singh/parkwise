import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get('/api/campaigns');
                setCampaigns(response.data);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-16 flex items-center justify-center">
                <p className="text-gray-600">Loading campaigns...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-center">
                    Conservation Campaigns
                </h1>
                <p className="text-xl text-gray-600 text-center mb-12">
                    Support critical wildlife conservation efforts
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {campaigns.map((campaign) => (
                        <div key={campaign.id} className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{campaign.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>
                            <div className="text-sm">
                                <p><strong>Goal:</strong> ${campaign.targetAmount?.toLocaleString()}</p>
                                <p><strong>Raised:</strong> ${campaign.currentAmount?.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Campaigns;