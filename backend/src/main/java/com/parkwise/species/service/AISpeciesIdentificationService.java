package com.parkwise.species.service;

import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import com.parkwise.species.dto.AIIdentificationResponse;
import com.parkwise.species.entity.AIPrediction;
import com.parkwise.species.entity.Species;
import com.parkwise.species.entity.SpeciesSubmission;
import com.parkwise.species.repository.AIPredictionRepository;
import com.parkwise.species.repository.SpeciesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AISpeciesIdentificationService {
    private final AIPredictionRepository aiPredictionRepository;
    private final SpeciesRepository speciesRepository;

    @Value("${google.cloud.vision.enabled:false}")
    private boolean visionEnabled;

    @Value("${google.cloud.vision.model-version:v1}")
    private String modelVersion;

    /**
     * Identify species from image using Google Cloud Vision API
     */
    public AIIdentificationResponse identifySpeciesFromImage(SpeciesSubmission submission, String imagePath) {
        log.info("Starting AI species identification for submission: {}", submission.getId());
        long startTime = System.currentTimeMillis();

        try {
            if (!visionEnabled) {
                log.warn("Vision API not enabled, using mock identification");
                return getMockIdentification(submission);
            }

            // Read image file
            byte[] imageBytes = Files.readAllBytes(Paths.get(imagePath));
            ByteString imgByteString = ByteString.copyFrom(imageBytes);

            // Create Vision API request
            Image img = Image.newBuilder().setContent(imgByteString).build();
            Feature feature = Feature.newBuilder()
                    .setType(Feature.Type.LABEL_DETECTION)
                    .setMaxResults(10)
                    .build();

            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .addFeatures(feature)
                    .setImage(img)
                    .build();

            // Call Vision API
            List<AnnotateImageRequest> requests = new ArrayList<>();
            requests.add(request);

            ImageAnnotatorClient client = ImageAnnotatorClient.create();
            BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);
            client.close();

            // Process results
            return processVisionResults(response, submission, System.currentTimeMillis() - startTime);

        } catch (IOException e) {
            log.error("Error processing image for species identification", e);
            return AIIdentificationResponse.builder()
                    .submissionId(submission.getId())
                    .success(false)
                    .error("Failed to process image: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Process Vision API results and match with species database
     */
    private AIIdentificationResponse processVisionResults(
            BatchAnnotateImagesResponse response,
            SpeciesSubmission submission,
            long processingTimeMs) {

        List<AnnotateImageResponse> responses = response.getResponsesList();
        if (responses.isEmpty()) {
            return AIIdentificationResponse.builder()
                    .submissionId(submission.getId())
                    .success(false)
                    .error("No results from Vision API")
                    .build();
        }

        AnnotateImageResponse annotateImageResponse = responses.get(0);

        if (annotateImageResponse.hasError()) {
            log.error("Vision API error: {}", annotateImageResponse.getError().getMessage());
            return AIIdentificationResponse.builder()
                    .submissionId(submission.getId())
                    .success(false)
                    .error("Vision API error: " + annotateImageResponse.getError().getMessage())
                    .build();
        }

        // Extract labels and match with species
        List<EntityAnnotation> labels = annotateImageResponse.getLabelAnnotationsList();
        List<AIIdentificationResponse.Prediction> predictions = matchLabelsToSpecies(labels);

        if (predictions.isEmpty()) {
            return AIIdentificationResponse.builder()
                    .submissionId(submission.getId())
                    .success(false)
                    .error("No species matches found")
                    .build();
        }

        // Get top prediction
        AIIdentificationResponse.Prediction topPrediction = predictions.get(0);

        // Save AI prediction to database
        Species matchedSpecies = speciesRepository.findByScientificName(topPrediction.getScientificName())
                .orElse(null);

        AIPrediction aiPrediction = AIPrediction.builder()
                .submission(submission)
                .species(matchedSpecies)
                .commonName(topPrediction.getCommonName())
                .scientificName(topPrediction.getScientificName())
                .confidenceScore(new BigDecimal(topPrediction.getConfidence()))
                .aiModelVersion(modelVersion)
                .alternativePredictions(convertPredictionsToMap(predictions))
                .processingTimeMs((int) processingTimeMs)
                .build();

        aiPredictionRepository.save(aiPrediction);

        return AIIdentificationResponse.builder()
                .submissionId(submission.getId())
                .success(true)
                .topPrediction(topPrediction)
                .allPredictions(predictions)
                .processingTimeMs(processingTimeMs)
                .build();
    }

    /**
     * Match Vision API labels to species in database
     */
    private List<AIIdentificationResponse.Prediction> matchLabelsToSpecies(List<EntityAnnotation> labels) {
        return labels.stream()
                .limit(5)
                .map(label -> {
                    String labelDescription = label.getDescription().toLowerCase();
                    float confidence = label.getScore();

                    // Try to find matching species
                    Optional<Species> matchedSpecies = speciesRepository.findByCommonNameContainingIgnoreCase(labelDescription)
                            .stream()
                            .findFirst();

                    if (matchedSpecies.isPresent()) {
                        Species species = matchedSpecies.get();
                        return AIIdentificationResponse.Prediction.builder()
                                .commonName(species.getCommonName())
                                .scientificName(species.getScientificName())
                                .confidence(confidence)
                                .category(species.getCategory().toString())
                                .conservationStatus(species.getConservationStatus().toString())
                                .build();
                    } else {
                        // Return label as-is if no match found
                        return AIIdentificationResponse.Prediction.builder()
                                .commonName(labelDescription)
                                .scientificName("Unknown")
                                .confidence(confidence)
                                .category("UNKNOWN")
                                .build();
                    }
                })
                .collect(Collectors.toList());
    }

    /**
     * Mock identification for testing (when Vision API is disabled)
     */
    private AIIdentificationResponse getMockIdentification(SpeciesSubmission submission) {
        List<Species> allSpecies = speciesRepository.findAll();
        if (allSpecies.isEmpty()) {
            return AIIdentificationResponse.builder()
                    .submissionId(submission.getId())
                    .success(false)
                    .error("No species in database for mock identification")
                    .build();
        }

        // Return random species as mock
        Species mockSpecies = allSpecies.get(new Random().nextInt(allSpecies.size()));
        double mockConfidence = 0.75 + (Math.random() * 0.20); // 0.75 - 0.95

        AIIdentificationResponse.Prediction prediction = AIIdentificationResponse.Prediction.builder()
                .commonName(mockSpecies.getCommonName())
                .scientificName(mockSpecies.getScientificName())
                .confidence(mockConfidence)
                .category(mockSpecies.getCategory().toString())
                .conservationStatus(mockSpecies.getConservationStatus().toString())
                .build();

        return AIIdentificationResponse.builder()
                .submissionId(submission.getId())
                .success(true)
                .topPrediction(prediction)
                .allPredictions(List.of(prediction))
                .processingTimeMs(100)
                .build();
    }

    /**
     * Convert predictions to map for JSONB storage
     */
    private Map<String, Object> convertPredictionsToMap(List<AIIdentificationResponse.Prediction> predictions) {
        Map<String, Object> map = new HashMap<>();
        for (int i = 0; i < predictions.size(); i++) {
            AIIdentificationResponse.Prediction pred = predictions.get(i);
            Map<String, Object> predMap = new HashMap<>();
            predMap.put("commonName", pred.getCommonName());
            predMap.put("scientificName", pred.getScientificName());
            predMap.put("confidence", pred.getConfidence());
            map.put("prediction_" + (i + 1), predMap);
        }
        return map;
    }
}
