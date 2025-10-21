package com.parkwise.experiment.repository;

import com.parkwise.experiment.entity.DonationEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface DonationEventRepository extends JpaRepository<DonationEvent, Long> {
    @Query("SELECT de FROM DonationEvent de WHERE de.experiment.id = :experimentId AND de.variant.id = :variantId AND de.donationStatus = 'COMPLETED'")
    List<DonationEvent> findCompletedDonationsByVariant(
            @Param("experimentId") Long experimentId,
            @Param("variantId") Long variantId
    );

    @Query("SELECT COUNT(de) FROM DonationEvent de WHERE de.experiment.id = :experimentId AND de.variant.id = :variantId AND de.donationStatus = 'COMPLETED'")
    Long countCompletedDonationsByVariant(
            @Param("experimentId") Long experimentId,
            @Param("variantId") Long variantId
    );

    @Query("SELECT AVG(de.donationAmount) FROM DonationEvent de WHERE de.experiment.id = :experimentId AND de.variant.id = :variantId AND de.donationStatus = 'COMPLETED'")
    BigDecimal getAverageDonationByVariant(
            @Param("experimentId") Long experimentId,
            @Param("variantId") Long variantId
    );

    @Query("SELECT SUM(de.donationAmount) FROM DonationEvent de WHERE de.experiment.id = :experimentId AND de.variant.id = :variantId AND de.donationStatus = 'COMPLETED'")
    BigDecimal getTotalDonationsByVariant(
            @Param("experimentId") Long experimentId,
            @Param("variantId") Long variantId
    );

    @Query("SELECT COUNT(DISTINCT de.userId) FROM DonationEvent de WHERE de.experiment.id = :experimentId AND de.variant.id = :variantId AND de.donationStatus = 'COMPLETED'")
    Long countUniqueDonorsByVariant(
            @Param("experimentId") Long experimentId,
            @Param("variantId") Long variantId
    );
}
