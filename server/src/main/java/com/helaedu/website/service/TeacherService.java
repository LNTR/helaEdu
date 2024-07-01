package com.helaedu.website.service;

import com.helaedu.website.util.UniqueIdGenerator;
import com.helaedu.website.dto.TeacherDto;
import com.helaedu.website.entity.Teacher;
import com.helaedu.website.repository.TeacherRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class TeacherService {
    private final TeacherRepository teacherRepository;

    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    public String createTeacher(TeacherDto teacherDto) throws ExecutionException, InterruptedException {
        Teacher existingTeacher = teacherRepository.getTeacherByEmail(teacherDto.getEmail());
        if (existingTeacher != null) {
            throw new IllegalArgumentException("Email already exists");
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String userId = UniqueIdGenerator.generateUniqueId("t", teacherRepository::exists);

        Teacher teacher = new Teacher(
                userId,
                teacherDto.getFirstName(),
                teacherDto.getLastName(),
                teacherDto.getEmail(),
                encoder.encode(teacherDto.getPassword()),
                Instant.now().toString(),
                false,
                teacherDto.getProofRef(),
                "ROLE_TEACHER"
        );
        teacherDto.setUserId(teacher.getUserId());
        return teacherRepository.createTeacher(teacher);
    }

    public List<TeacherDto> getAllTeachers() throws ExecutionException, InterruptedException {
        List<Teacher> teachers = teacherRepository.getAllTeachers();
        return teachers.stream().map(teacher ->
                        new TeacherDto(
                                teacher.getUserId(),
                                teacher.getFirstName(),
                                teacher.getLastName(),
                                teacher.getEmail(),
                                teacher.getPassword(),
                                teacher.getRegTimestamp(),
                                teacher.getIsModerator(),
                                teacher.getProofRef(),
                                teacher.getRole()
                        )
                )
                .collect(Collectors.toList());
    }

    public TeacherDto getTeacher(String userId) throws ExecutionException, InterruptedException {
        Teacher teacher = teacherRepository.getTeacherById(userId);
        if (teacher != null) {
            return new TeacherDto(
                    userId,
                    teacher.getFirstName(),
                    teacher.getLastName(),
                    teacher.getEmail(),
                    teacher.getPassword(),
                    teacher.getRegTimestamp(),
                    teacher.getIsModerator(),
                    teacher.getProofRef(),
                    teacher.getRole()
            );
        }
        return null;
    }

    public String updateTeacher(String userId, TeacherDto teacherDto) throws ExecutionException, InterruptedException {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        Teacher existingTeacher = teacherRepository.getTeacherById(userId);
        if(existingTeacher == null || existingTeacher.getIsModerator()) {
            throw new IllegalArgumentException("Teacher not found");
        }

        if(teacherDto.getFirstName() != null && !teacherDto.getFirstName().equals(existingTeacher.getFirstName())) {
            existingTeacher.setFirstName(teacherDto.getFirstName());
        }
        if(teacherDto.getLastName() != null && !teacherDto.getLastName().equals(existingTeacher.getLastName())) {
            existingTeacher.setLastName(teacherDto.getLastName());
        }
        if(teacherDto.getEmail() != null && !teacherDto.getEmail().equals(existingTeacher.getEmail())) {
            existingTeacher.setEmail(teacherDto.getEmail());
        }
        if(teacherDto.getPassword() != null && !(encoder.encode(teacherDto.getPassword()).equals(encoder.encode(existingTeacher.getPassword())))) {
            existingTeacher.setPassword(encoder.encode(teacherDto.getPassword()));
        }
        if(teacherDto.getRegTimestamp() != null) {
            existingTeacher.setRegTimestamp(teacherDto.getRegTimestamp());
        }
        if(teacherDto.getIsModerator() != null) {
            existingTeacher.setIsModerator(teacherDto.getIsModerator());
        }
        if(teacherDto.getProofRef() != null && !teacherDto.getProofRef().equals(existingTeacher.getProofRef())) {
            existingTeacher.setProofRef(teacherDto.getProofRef());
        }

        return teacherRepository.updateTeacher(userId, existingTeacher);
    }

    public String deleteTeacher(String userId) throws ExecutionException, InterruptedException {
        Teacher existingTeacher = teacherRepository.getTeacherById(userId);
        if (existingTeacher == null || existingTeacher.getIsModerator()) {
            throw new IllegalArgumentException("Teacher not found");
        }
        return teacherRepository.deleteTeacher(userId);
    }

    public String promoteToModerator(String userId) throws ExecutionException, InterruptedException {
        return teacherRepository.promoteToModerator(userId);
    }
}
