import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import { Upload, Camera, X, Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface SpeciesMatch {
  name: string;
  scientificName: string;
  confidence: number;
  conservationStatus: 'endangered' | 'vulnerable' | 'near-threatened' | 'least-concern' | 'data-deficient';
  habitat: string;
  description: string;
}

interface AIIdentifierProps {
  onIdentify?: (image: File) => Promise<SpeciesMatch>;
  onReportSighting?: (species: SpeciesMatch) => void;
  className?: string;
}

const AIIdentifier: React.FC<AIIdentifierProps> = ({
  onIdentify,
  onReportSighting,
  className,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SpeciesMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleIdentify = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock result
      const mockResult: SpeciesMatch = {
        name: 'Bengal Tiger',
        scientificName: 'Panthera tigris tigris',
        confidence: 0.95,
        conservationStatus: 'endangered',
        habitat: 'Tropical forests, grasslands',
        description: 'The Bengal tiger is a population of the Panthera tigris tigris subspecies native to the Indian subcontinent.',
      };

      setResult(mockResult);
      
      // Animate confidence meter
      let currentConfidence = 0;
      const interval = setInterval(() => {
        currentConfidence += 2;
        if (currentConfidence >= mockResult.confidence * 100) {
          clearInterval(interval);
          setConfidence(mockResult.confidence * 100);
        } else {
          setConfidence(currentConfidence);
        }
      }, 20);

      if (onIdentify) {
        const apiResult = await onIdentify(file);
        setResult(apiResult);
        setConfidence(apiResult.confidence * 100);
      }
    } catch (err) {
      setError('Failed to identify species. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setFile(null);
    setResult(null);
    setError(null);
    setConfidence(0);
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'from-green-500 to-green-600';
    if (conf >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 80) return 'High Confidence';
    if (conf >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden dark:bg-black/30 dark:border-white/10">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Species Identifier
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload an image to identify wildlife species instantly
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {!image ? (
              /* Upload Area */
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                {...getRootProps()}
                className={cn(
                  'relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all',
                  isDragActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
                )}
              >
                <input {...getInputProps()} />
                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {isDragActive ? 'Drop image here' : 'Upload Species Image'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Drag and drop or click to select an image
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Supports: JPG, PNG, WEBP (Max 10MB)
                </p>
              </motion.div>
            ) : (
              /* Analysis Area */
              <motion.div
                key="analysis"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Image Preview */}
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src={image}
                    alt="Species to identify"
                    className="w-full h-96 object-cover"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Analysis Button */}
                {!result && !isAnalyzing && (
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<Camera className="w-5 h-5" />}
                    onClick={handleIdentify}
                    className="w-full"
                    glow
                  >
                    Identify Species
                  </Button>
                )}

                {/* Loading State */}
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary-500 animate-spin" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Analyzing Image...
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Our AI is identifying the species
                    </p>
                  </motion.div>
                )}

                {/* Error State */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900 dark:text-red-300">
                        Identification Failed
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {error}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Result */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Success Header */}
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-300">
                          Species Identified!
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          Match found with {confidence.toFixed(1)}% confidence
                        </p>
                      </div>
                    </div>

                    {/* Confidence Meter */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Confidence Level
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {confidence.toFixed(1)}%
                        </span>
                      </div>
                      <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            'absolute inset-y-0 left-0 rounded-full bg-gradient-to-r',
                            getConfidenceColor(confidence)
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${confidence}%` }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 text-right">
                        {getConfidenceLabel(confidence)}
                      </p>
                    </div>

                    {/* Species Info */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 dark:from-black/30 dark:to-black/20 border border-white/20 dark:border-white/10">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {result.name}
                          </h3>
                          <p className="text-sm italic text-gray-600 dark:text-gray-400">
                            {result.scientificName}
                          </p>
                        </div>
                        <Badge variant={result.conservationStatus} glow>
                          {result.conservationStatus.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Habitat
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {result.habitat}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {result.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => onReportSighting?.(result)}
                        className="flex-1"
                        glow
                      >
                        Report Sighting
                      </Button>
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={handleReset}
                        className="flex-1"
                      >
                        Try Another
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIIdentifier;
