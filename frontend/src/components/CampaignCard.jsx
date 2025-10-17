import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Target, ArrowRight } from 'lucide-react';

const CampaignCard = ({ campaign, index }) => {
  const progress = campaign.currentAmount / campaign.targetAmount * 100;
  const daysLeft = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover-lift group"
    >
      <div className="relative">
        <img
          src={campaign.imageUrl || '/api/placeholder/400/250'}
          alt={campaign.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            campaign.status === 'ACTIVE' 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {campaign.status}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300">
          {campaign.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
          {campaign.description}
        </p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>₹{campaign.currentAmount?.toLocaleString()} raised</span>
            <span>₹{campaign.targetAmount?.toLocaleString()} goal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, delay: index * 0.2 }}
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{Math.round(progress)}% funded</span>
            <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Campaign ended'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{campaign.supporters} supporters</span>
            </div>
            {campaign.park && (
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                <span>{campaign.park.name}</span>
              </div>
            )}
          </div>
          
          <button className="flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors duration-300">
            Support
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignCard;