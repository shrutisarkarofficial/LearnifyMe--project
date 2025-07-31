package com.Major.Online.Exam.Repository;

import com.Major.Online.Exam.Entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepo extends JpaRepository<Admin, Long> {
    Admin findByEmail(String email);
}