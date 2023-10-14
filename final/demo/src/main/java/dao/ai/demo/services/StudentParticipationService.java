package dao.ai.demo.services;

import dao.ai.demo.dtos.StudentImagesDTO;
import dao.ai.demo.entities.ResponseObject;
import dao.ai.demo.entities.StudentImages;
import dao.ai.demo.entities.StudentParticipation;
import dao.ai.demo.repositories.StudentParticipationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StudentParticipationService {
    @Autowired
    private StudentParticipationRepository studentParticipationRepository;

    public ResponseEntity<ResponseObject> getAll(){
        return ResponseEntity.status(HttpStatus.OK).body(
                new ResponseObject("Success", "Query successfully", studentParticipationRepository.findAll())
        );
    }
    public ResponseEntity<ResponseObject> uploadStudentJoin(StudentParticipation studentParticipation){
        Optional<StudentParticipation> findStudentJoin = Optional.ofNullable(studentParticipationRepository.findByMSSVAndClassID(studentParticipation.getMssv(), studentParticipation.getClassID()));

        if( !findStudentJoin.isPresent()){
            studentParticipationRepository.save(studentParticipation);
            return ResponseEntity.status(HttpStatus.OK).body(
                    new ResponseObject("Suscess", "Upload successfully student with mssv = " +studentParticipation.getMssv(), studentParticipation)
            );
        }else{
            findStudentJoin.get().setCode(studentParticipation.getCode());
            studentParticipationRepository.save(findStudentJoin.get());
            return ResponseEntity.status(HttpStatus.OK).body(
                    new ResponseObject("Success", "Update successfully student with mssv ="+ studentParticipation.getMssv(), ""));
        }
    }
    public ResponseEntity<ResponseObject> updateStudentJoin(String mssv,String classID, StudentParticipation studentParticipation){
        Optional<StudentParticipation> updatedStudentJoin = Optional.ofNullable(studentParticipationRepository.findByMSSVAndClassID(mssv, classID));
        if( updatedStudentJoin.equals(null)){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ResponseObject("Failed", "Cannot find student with mssv = "+mssv, "")
            );
        }else{
            updatedStudentJoin.get().setCode(studentParticipation.getCode());
            return ResponseEntity.status(HttpStatus.OK).body(
                    new ResponseObject("Success", "Update successfully student with mssv ="+mssv, ""));
        }
    }


    public ResponseEntity<ResponseObject> fetchStudentParticipationWithPageInterface(String classID,String keyword,Integer pageNumber, Integer pageSize, List<String> sortList, String sortOrder) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(createSortOrder(sortList, sortOrder)));
        Page<StudentParticipation> studentParticipationPage= studentParticipationRepository.findAllByClassIDAndKeyword(classID,keyword, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(
                new ResponseObject("Success", "Querry successfully",studentParticipationPage)
        );
    }

    private List<Sort.Order> createSortOrder(List<String> sortList, String sortDirection) {
        List<Sort.Order> sorts = new ArrayList<>();
        Sort.Direction direction;

        for (String sort : sortList) {
            if (sortDirection != null) {
                direction = Sort.Direction.fromString(sortDirection);
            } else {
                direction = Sort.Direction.DESC;
            }
            sorts.add(new Sort.Order(direction, sort));
        }
        return sorts;
    }
}
