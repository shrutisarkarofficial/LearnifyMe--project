package com.Major.Online.Exam.Repository;

import com.Major.Online.Exam.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<Users, Long> {
    Users findByEmail(String email);


    @Query(value = "SELECT id, name, role, created_at FROM users", nativeQuery = true)
    List<Object[]> findAllUserDetails();

}
