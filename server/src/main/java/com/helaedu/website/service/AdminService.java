package com.helaedu.website.service;

import com.helaedu.website.dto.AdminDto;
import com.helaedu.website.entity.Admin;
import com.helaedu.website.repository.AdminRepository;
import com.helaedu.website.util.UniqueIdGenerator;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class AdminService {
    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public String createAdmin(AdminDto adminDto) throws ExecutionException, InterruptedException {
        Admin existingAdmin = adminRepository.getAdminByEmail(adminDto.getEmail());
        if (existingAdmin != null) {
            throw new IllegalArgumentException("Email already exists");
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String userId = UniqueIdGenerator.generateUniqueId("ad", adminRepository::exists);

        Admin admin = new Admin(
                userId,
                adminDto.getFirstName(),
                adminDto.getLastName(),
                adminDto.getEmail(),
                encoder.encode(adminDto.getPassword()),
                Instant.now().toString(),
                "ROLE_ADMIN"
        );
        adminDto.setUserId(admin.getUserId());
        return adminRepository.createAdmin(admin);
    }

    public List<AdminDto> getAllAdmins() throws ExecutionException, InterruptedException {
        List<Admin> admins = adminRepository.getAllAdmins();
        return admins.stream().map(admin ->
                        new AdminDto(
                                admin.getUserId(),
                                admin.getFirstName(),
                                admin.getLastName(),
                                admin.getEmail(),
                                admin.getPassword(),
                                admin.getRegTimestamp(),
                                admin.getRole()
                        )
                )
                .collect(Collectors.toList());
    }

    public AdminDto getAdmin(String userId) throws ExecutionException, InterruptedException {
        Admin admin = adminRepository.getAdminById(userId);
        if (admin != null) {
            return new AdminDto(
                    userId,
                    admin.getFirstName(),
                    admin.getLastName(),
                    admin.getEmail(),
                    admin.getPassword(),
                    admin.getRegTimestamp(),
                    admin.getRole()
            );
        }
        return null;
    }

    public String updateAdmin(String userId, AdminDto adminDto) throws ExecutionException, InterruptedException {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        Admin existingAdmin = adminRepository.getAdminById(userId);
        if(existingAdmin == null) {
            throw new IllegalArgumentException("Admin not found");
        }

        if(adminDto.getFirstName() != null || !adminDto.getFirstName().equals(existingAdmin.getFirstName())) {
            existingAdmin.setFirstName(adminDto.getFirstName());
        }
        if(adminDto.getLastName() != null || !adminDto.getLastName().equals(existingAdmin.getLastName())) {
            existingAdmin.setLastName(adminDto.getLastName());
        }
        if(adminDto.getEmail() != null || !adminDto.getEmail().equals(existingAdmin.getEmail())) {
            existingAdmin.setEmail(adminDto.getEmail());
        }
        if(adminDto.getPassword() != null || !(encoder.encode(adminDto.getPassword()).equals(encoder.encode(existingAdmin.getPassword())))) {
            existingAdmin.setPassword(encoder.encode(adminDto.getPassword()));
        }
        if(adminDto.getRegTimestamp() != null) {
            existingAdmin.setRegTimestamp(adminDto.getRegTimestamp());
        }

        return adminRepository.updateAdmin(userId, existingAdmin);
    }

    public String deleteAdmin(String userId) throws ExecutionException, InterruptedException {
        return adminRepository.deleteAdmin(userId);
    }
}
