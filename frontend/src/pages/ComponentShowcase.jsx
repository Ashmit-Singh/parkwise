import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from '../contexts/ThemeContext';

// Import all new components
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import Avatar from '../components/atoms/Avatar';
import SpeciesCard from '../components/molecules/SpeciesCard';
import DonationModal from '../components/molecules/DonationModal';
import MapMarker from '../components/molecules/MapMarker';
import SearchBar from '../components/molecules/SearchBar';
import CampaignCard from '../components/molecules/CampaignCard';
import AIIdentifier from '../components/organisms/AIIdentifier';
import ConservationFeed from '../components/organisms/ConservationFeed';
import InteractiveMap from '../components/organisms/InteractiveMap';
import BlockchainVisualizer from '../components/organisms/BlockchainVisualizer';
import LeaderboardPanel from '../components/organisms/LeaderboardPanel';

// Mock data
const mockSpecies = {
  name: 'Bengal Tiger',
  scientificName: 'Panthera tigris tigris',
  conservationStatus: 'endangered',
  imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400',
  habitat: 'Tropical forests and grasslands',
  population: 2500,
  sightings: 42,
  description: 'The Bengal tiger is a population of the Panthera tigris tigris subspecies and the nominate tiger subspecies. It ranks among the biggest wild cats alive today.'
};

const mockCampaign = {
  id: 1,
  title: 'Save the Tigers',
  description: 'Help protect endangered Bengal tigers in their natural habitat',
  goal: 100000,
  raised: 65000,
  imageUrl: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400',
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  supporters: 342,
  category: 'Wildlife Protection'
};

const mockFeedItems = [
  {
    id: '1',
    type: 'sighting',
    user: { name: 'John Doe', avatar: undefined },
    species: 'Bengal Tiger',
    location: 'Jim Corbett National Park',
    message: 'Spotted a Bengal Tiger near the river',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '2',
    type: 'donation',
    user: { name: 'Jane Smith', avatar: undefined },
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

export default function ComponentShowcase() {
  const [showDonationModal, setShowDonationModal] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              🎨 Futuristic Component Showcase
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Next-generation UI components for wildlife conservation
            </p>
          </motion.div>

          {/* Atomic Components */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Atomic Components
            </h2>
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 dark:bg-black/30">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Buttons</h3>
              <div className="flex flex-wrap gap-4 mb-8">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="glass">Glass</Button>
                <Button variant="primary" glow>Glow Effect</Button>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Badges</h3>
              <div className="flex flex-wrap gap-4 mb-8">
                <Badge variant="endangered">Endangered</Badge>
                <Badge variant="vulnerable">Vulnerable</Badge>
                <Badge variant="near-threatened">Near Threatened</Badge>
                <Badge variant="least-concern">Least Concern</Badge>
                <Badge variant="rank">Rank Badge</Badge>
                <Badge variant="new" pulse>New</Badge>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Avatars</h3>
              <div className="flex flex-wrap gap-4">
                <Avatar fallback="JD" size="sm" />
                <Avatar fallback="JS" size="md" />
                <Avatar fallback="WE" size="lg" ring />
                <Avatar fallback="NG" size="xl" ring ringColor="ring-green-500" />
              </div>
            </div>
          </section>

          {/* Molecular Components */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Molecular Components
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Species Card</h3>
                <SpeciesCard {...mockSpecies} />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Campaign Card</h3>
                <CampaignCard {...mockCampaign} />
              </div>

              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Search Bar</h3>
                <SearchBar placeholder="Search species, parks, campaigns..." />
              </div>

              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Donation Modal</h3>
                <Button onClick={() => setShowDonationModal(true)}>Open Donation Modal</Button>
                {showDonationModal && (
                  <DonationModal
                    campaignId={1}
                    campaignName="Save the Tigers"
                    onClose={() => setShowDonationModal(false)}
                  />
                )}
              </div>
            </div>
          </section>

          {/* Organism Components */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Organism Components
            </h2>

            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">AI Species Identifier</h3>
                <AIIdentifier />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Conservation Feed</h3>
                <ConservationFeed items={mockFeedItems} />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Interactive Map</h3>
                <div className="h-[600px]">
                  <InteractiveMap />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Blockchain Visualizer</h3>
                <BlockchainVisualizer />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Leaderboard Panel</h3>
                <LeaderboardPanel users={mockLeaderboard} currentUserId="1" />
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              🎉 All components built with React, TypeScript, Framer Motion, and TailwindCSS
            </p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
