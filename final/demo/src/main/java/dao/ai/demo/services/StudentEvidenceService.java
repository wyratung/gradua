package dao.ai.demo.services;

import dao.ai.demo.entities.ResponseObject;
import dao.ai.demo.entities.StudentEvidence;
import dao.ai.demo.repositories.StudentEvidenceRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;



@Service
public class StudentEvidenceService {
    @Autowired
    private StudentEvidenceRepository studentEvidenceRepository;
    public ResponseEntity<ResponseObject> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(
                new ResponseObject("Success", "Query successfully", studentEvidenceRepository.findAll())
        );
    }

    public ResponseEntity<ResponseObject> uploadStudentEvidence(StudentEvidence studentEvidence) {
        studentEvidenceRepository.save(studentEvidence);
        return ResponseEntity.status(HttpStatus.OK).body(
                new ResponseObject("Success", "Insert Product successfully",studentEvidence )
        );
    }
    public ResponseEntity<ResponseObject> getAllEvidenceOfOneStudent(String mssv,String classID,Integer page ) {
        Pageable pageable= PageRequest.of(page,10, Sort.by("time").descending());
        Page<StudentEvidence> studentEvidenceList = studentEvidenceRepository.findEvidenceByMssvAndClassID(mssv, classID,pageable);
        if (studentEvidenceList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(
                    new ResponseObject("Success", "Dont have any evidences", ""));

        } else
            return ResponseEntity.status(HttpStatus.OK).body(
                    new ResponseObject("Success", "Dont have any evidences", studentEvidenceList));
    }
}
