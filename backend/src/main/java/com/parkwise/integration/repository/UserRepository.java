package com.parkwise.integration.repository;

import com.parkwise.integration.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.totalPoints >= :minPoints ORDER BY u.totalPoints DESC")
    java.util.List<User> findTopUsersByPoints(@Param("minPoints") Integer minPoints);
}
