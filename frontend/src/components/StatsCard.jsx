import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const StatsCard = ({ number, label, suffix = '', delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center group"
    >
      <motion.div
        className="text-4xl md:text-5xl font-bold text-gradient mb-2"
        animate={inView ? { scale: [0.8, 1.1, 1] } : {}}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        {number}{suffix}
      </motion.div>
      <div className="text-gray-600 font-medium text-lg group-hover:text-green-600 transition-colors duration-300">
        {label}
      </div>
    </motion.div>
  );
};

export default StatsCard;