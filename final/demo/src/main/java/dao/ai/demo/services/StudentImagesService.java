package dao.ai.demo.services;

import dao.ai.demo.controllers.StudentController;
import dao.ai.demo.dtos.StudentImagesDTO;
import dao.ai.demo.entities.ResponseObject;
import dao.ai.demo.entities.StudentImages;
import dao.ai.demo.repositories.StudentImagesRepository;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class StudentImagesService {

    @Autowired
    private StudentImagesRepository studentImagesRepository;
    public ResponseEntity<ResponseObject> getAll(){

        List<StudentImages>  studentImages=studentImagesRepository.findAll();
        List<StudentImagesDTO> studentImagesDTOS= transferToStudentDTOList(studentImages);
        return ResponseEntity.status(HttpStatus.OK).body(
                new ResponseObject("Success", "Query successfully", studentImagesDTOS)
        );
    }
    public ResponseEntity<ResponseObject> uploadStudentImage(StudentImages studentImages){

        studentImagesRepository.save(studentImages);
        return ResponseEntity.status(HttpStatus.OK).body(
                new ResponseObject("Success", "Insert Product successfully",studentImages )
        );
    }
    public ResponseEntity<ResponseObject> findById(String id){

        Optional<StudentImages>foundStudent= studentImagesRepository.findById(id);
        return foundStudent.isPresent() ?
                ResponseEntity.status(HttpStatus.OK).body(
                        new ResponseObject("Success", "Query successfully", foundStudent)
                        //you can replace "ok" with your defined "error code"
                ):
                ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        new ResponseObject("Failed", "Cannot find student with mssv = "+id, "")
                );
    }
    public ResponseEntity<ResponseObject> deleteStudentImages(String id){

        boolean exists = studentImagesRepository.existsById(id);
        if(exists) {
            studentImagesRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body(
                    new ResponseObject("Success", "Delete successfully", "")
            );
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ResponseObject("Failed", "Cannot find student infor to delete", "")
        );
    }
    public ResponseEntity<ResponseObject> updateStudentImages(String id,StudentImages studentImages){

        Optional<StudentImages>updatedStudent = studentImagesRepository.findById(id);
        if(updatedStudent.equals(null)){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ResponseObject("Fail", "Cant not found student with id="+id, updatedStudent.get())
            );
        }else {

        updatedStudent.get().setInforTA(studentImages.getInforTA());
        updatedStudent.get().setTimeApprove(studentImages.getTimeApprove());
        updatedStudent.get().setApproveCode(studentImages.getApproveCode());
        updatedStudent.get().setNote(studentImages.getNote());
        studentImagesRepository.save(updatedStudent.get());
        return ResponseEntity.status(HttpStatus.OK).body(
                new ResponseObject("Success", "Update successfully student with mssv =" +id, updatedStudent.get())
        );}
    }
    public ResponseEntity<ResponseObject> fetchStudentDataAsPageWithFilteringAndSorting(String keyword,Integer pageNumber, Integer pageSize, List<String> sortList, String sortOrder ) {
        // create Pageable object using the page, size and sort details

        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(createSortOrder(sortList, sortOrder)));
        Page<StudentImages> studentImages= studentImagesRepository.findByFirstMSSVLikeORNameLike(keyword, pageable);
        List<StudentImagesDTO> studentImagesDTOList=studentImages.getContent().stream().map(studentImage->transferToStudentDTO(studentImage)).collect(Collectors.toList());
        Page<StudentImagesDTO> studentImagesDTOS= new PageImpl<StudentImagesDTO>(studentImagesDTOList,pageable,studentImages.getTotalElements());
        return ResponseEntity.status(HttpStatus.OK).body(
                new ResponseObject("Success", "Querry successfully",studentImagesDTOS)
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
    private List<StudentImagesDTO> transferToStudentDTOList(List<StudentImages> studentImages){

        List<StudentImagesDTO> studentImagesDTOS = new ArrayList<>();
        for(StudentImages studentImage : studentImages){
            StudentImagesDTO studentImagesDTO = new StudentImagesDTO();
            studentImagesDTO.setMssv(studentImage.getMssv());
            studentImagesDTO.setApproveCode(studentImage.getApproveCode());
            studentImagesDTO.setTimeApprove(studentImage.getTimeApprove());
            studentImagesDTO.setTimeSelfie(studentImage.getTimeSelfie());
            studentImagesDTO.setPortraitImage(studentImage.getPortraitImage());
            studentImagesDTOS.add(studentImagesDTO);
        }
        return studentImagesDTOS;
    }
    private StudentImagesDTO transferToStudentDTO(StudentImages studentImage){

            StudentImagesDTO studentImagesDTO = new StudentImagesDTO();
            studentImagesDTO.setMssv(studentImage.getMssv());
            studentImagesDTO.setApproveCode(studentImage.getApproveCode());
            studentImagesDTO.setTimeApprove(studentImage.getTimeApprove());
            studentImagesDTO.setTimeSelfie(studentImage.getTimeSelfie());
            studentImagesDTO.setPortraitImage(studentImage.getPortraitImage());
        return studentImagesDTO;
    }
}
