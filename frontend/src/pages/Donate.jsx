import React, { useState, useEffect } from 'react';
import { useBehavioral } from '../hooks/useBehavioral';
import DonationForm from '../components/DonationForm';
import DonationFormExperimental from '../components/DonationFormExperimental';

const Donate = () => {
  const [variant, setVariant] = useState(null);
  const { getVariant, logEvent } = useBehavioral();

  useEffect(() => {
    // Get assigned variant for donation experiment
    const donationVariant = getVariant('donation_ui_experiment');
    setVariant(donationVariant);
    
    // Log page view
    logEvent('donation_page_viewed', null, {
      variantName: donationVariant?.variantName,
      timestamp: new Date().toISOString()
    });
  }, [getVariant, logEvent]);

  if (variant === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donation experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-center">
          Make a Difference
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Support wildlife conservation efforts
        </p>
        <div className="text-center max-w-4xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Support Conservation Efforts</h1>
          {variant.variantName === 'control' ? (
            <DonationForm />
          ) : (
            <DonationFormExperimental 
              variant={variant} 
              logEvent={logEvent} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Donate;