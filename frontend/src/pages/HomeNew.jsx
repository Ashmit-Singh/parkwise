import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Sparkles, TrendingUp, Users, Shield } from 'lucide-react';
import Button from '../components/atoms/Button';
import ConservationFeed from '../components/organisms/ConservationFeed';
import LeaderboardPanel from '../components/organisms/LeaderboardPanel';

// Mock data
const mockFeedItems = [
  {
    id: '1',
    type: 'sighting',
    user: { name: 'Wildlife Explorer', avatar: undefined },
    species: 'Bengal Tiger',
    location: 'Jim Corbett National Park',
    message: 'Spotted a Bengal Tiger near the river',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '2',
    type: 'donation',
    user: { name: 'Nature Lover', avatar: undefined },
    amount: 5000,
    campaign: 'Save the Tigers',
    message: 'Donated to Save the Tigers campaign',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: '3',
    type: 'milestone',
    message: 'Campaign "Protect Elephants" reached 50% funding!',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  }
];

const mockLeaderboard = [
  {
    id: '1',
    name: 'Wildlife Explorer',
    avatar: undefined,
    rank: 1,
    points: 15420,
    sightings: 156,
    donations: 12,
    achievements: 24,
    rankTitle: 'Conservation Champion',
    change: 2
  },
  {
    id: '2',
    name: 'Nature Guardian',
    avatar: undefined,
    rank: 2,
    points: 12850,
    sightings: 134,
    donations: 8,
    achievements: 19,
    rankTitle: 'Wildlife Protector',
    change: -1
  },
  {
    id: '3',
    name: 'Eco Warrior',
    avatar: undefined,
    rank: 3,
    points: 10200,
    sightings: 98,
    donations: 15,
    achievements: 16,
    rankTitle: 'Species Advocate',
    change: 1
  }
];

const HomeNew = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Next-Generation Conservation Platform
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-gray-900 dark:text-white">Protecting India's</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400">
                  Natural Heritage
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                AI-powered species identification, blockchain-verified donations, 
                and real-time conservation tracking.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/showcase">
                  <Button variant="primary" size="lg" leftIcon={<Sparkles />} glow>
                    View New Components
                  </Button>
                </Link>
                <Link to="/species-portal">
                  <Button variant="secondary" size="lg" leftIcon={<ArrowRight />}>
                    Explore Species
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: TrendingUp, value: '7-8%', label: 'of World Species', color: 'from-green-500 to-green-600' },
              { icon: Shield, value: '17', label: 'Mega-Diverse Country', color: 'from-blue-500 to-blue-600' },
              { icon: Leaf, value: '2.4%', label: 'of World Land Area', color: 'from-purple-500 to-purple-600' },
              { icon: Users, value: '30%', label: 'Conservation Target 2030', color: 'from-pink-500 to-pink-600' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center dark:bg-black/30"
              >
                <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${stat.color} mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Feed & Leaderboard Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Conservation Feed */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ConservationFeed items={mockFeedItems} />
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <LeaderboardPanel users={mockLeaderboard} currentUserId="1" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powered by Cutting-Edge Technology
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Experience the future of wildlife conservation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Species Recognition',
                description: 'Upload photos and get instant species identification with confidence scores',
                link: '/showcase',
                gradient: 'from-purple-500 to-purple-600'
              },
              {
                title: 'Blockchain Donations',
                description: 'Transparent, verified donations tracked on the blockchain',
                link: '/blockchain',
                gradient: 'from-blue-500 to-blue-600'
              },
              {
                title: 'Interactive Maps',
                description: '3D terrain visualization with real-time species sightings',
                link: '/geospatial',
                gradient: 'from-green-500 to-green-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:scale-105 transition-transform dark:bg-black/30"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>
                <Link to={feature.link}>
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight />}>
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of conservation supporters and help protect India's rich biodiversity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate">
                <Button variant="glass" size="lg" leftIcon={<Leaf />}>
                  Donate Now
                </Button>
              </Link>
              <Link to="/showcase">
                <Button variant="glass" size="lg" leftIcon={<Sparkles />}>
                  Explore Platform
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomeNew;
