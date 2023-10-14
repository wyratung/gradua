package dao.ai.demo.controllers;
import dao.ai.demo.entities.ResponseObject;
import dao.ai.demo.entities.StudentEvidence;
import dao.ai.demo.entities.StudentImages;
import dao.ai.demo.entities.StudentParticipation;
import dao.ai.demo.services.StudentEvidenceService;
import dao.ai.demo.services.StudentImagesService;
import dao.ai.demo.services.StudentParticipationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(path = "/api/v1")
public class StudentController {
//    http://localhost:8019/api/v1

    public static int countNumberOfStudent=0;
    private static final Logger logger= LoggerFactory.getLogger(StudentController.class);
    @Autowired
    private StudentImagesService studentImagesService;
    @Autowired
    private StudentParticipationService studentParticipationService;

    @Autowired
    private StudentEvidenceService studentEvidenceService;
    @GetMapping("/studentImages")
    ResponseEntity<ResponseObject> getAllStudentInfor(){

        logger.info("OK");
        return studentImagesService.getAll();
    }


    @GetMapping("/studentImages/{id}")

    ResponseEntity<ResponseObject> findById(@PathVariable String id){
        logger.info("OK");
        return studentImagesService.findById(id);
    }
    @PostMapping("/studentImages/upload")
    ResponseEntity<ResponseObject> uploadStudentImage(@RequestBody StudentImages studentImages){
        logger.info("OK");
        return studentImagesService.uploadStudentImage(studentImages);
    }
    @CrossOrigin
    @DeleteMapping("/studentImages/{id}")
    ResponseEntity<ResponseObject> deleteStudentImages(@PathVariable String id){
        logger.info("OK");
        return studentImagesService.deleteStudentImages(id);
    }
    @CrossOrigin
    @PutMapping("/studentImages/{id}")

    ResponseEntity<ResponseObject> updateStudentImages (@PathVariable String id,@RequestBody StudentImages studentImages){
        logger.info("OK");
        return studentImagesService.updateStudentImages(id,studentImages);
    }
    @GetMapping("/studentImages/filter")

    public ResponseEntity<ResponseObject> fetchStudentsWithPageInterface(@RequestParam(defaultValue = "") String keyword,
                                                                @RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size,
                                                               @RequestParam(defaultValue = "") List<String> sortList,
                                                               @RequestParam(defaultValue = "DESC") Sort.Direction sortOrder
                                                                 ) {
        logger.info("OK");
        return studentImagesService.fetchStudentDataAsPageWithFilteringAndSorting(keyword ,page, size,sortList,sortOrder.toString());
    }
    @GetMapping("/studentJoin")
    ResponseEntity<ResponseObject> getAllStudentJoin(){
        return studentParticipationService.getAll();
    }
    @PostMapping("/studentJoin/upload")
    ResponseEntity<ResponseObject> uploadStudentJoin(@RequestBody StudentParticipation studentParticipation){
        logger.info("OK");
        return studentParticipationService.uploadStudentJoin(studentParticipation);
    }

    @PutMapping("/studentJoin")
    @CrossOrigin
    ResponseEntity<ResponseObject> updateStudentJoin (@RequestParam(defaultValue = "") String mssv,@RequestParam(defaultValue = "") String classID,@RequestBody StudentParticipation studentParticipation){
        logger.info("OK");
        return studentParticipationService.updateStudentJoin(mssv,classID,studentParticipation);
    }
    @GetMapping("/getAllEvident")
    ResponseEntity<ResponseObject> getAllEvidence(){
        logger.info("OK");
        return studentEvidenceService.getAll();
    }
    @PostMapping("/evident/upload")
    ResponseEntity<ResponseObject> uploadStudentEvidence(@RequestBody StudentEvidence studentEvidence){
        logger.info("OK");
        return studentEvidenceService.uploadStudentEvidence(studentEvidence);
    }

    @GetMapping("/evident")
    ResponseEntity<ResponseObject> getAllEvidenceOfOneStudent(@RequestParam(defaultValue = "") String mssv,@RequestParam(defaultValue = "") String classID,@RequestParam(defaultValue = "0") int page){
        logger.info("OK");
        return studentEvidenceService.getAllEvidenceOfOneStudent(mssv,classID, page);
    }

    @GetMapping("/studentJoin/filter")

    public ResponseEntity<ResponseObject> fetchStudentParticipationWithPageInterface(@RequestParam(defaultValue = "") String classID,@RequestParam(defaultValue = "") String keyword,
                                                                         @RequestParam(defaultValue = "0") int page,
                                                                         @RequestParam(defaultValue = "10") int size,
                                                                         @RequestParam(defaultValue = "") List<String> sortList,
                                                                         @RequestParam(defaultValue = "DESC") Sort.Direction sortOrder
    ) {
        logger.info("OK");
        return studentParticipationService.fetchStudentParticipationWithPageInterface(classID, keyword ,page, size,sortList,sortOrder.toString());
    }


    @PostMapping("/countStudent")
    public ResponseEntity<ResponseObject> countStudent(@RequestParam(defaultValue = "0") int numStudent){
        countNumberOfStudent= numStudent;
        return ResponseEntity.status(HttpStatus.OK).body(
                new ResponseObject("Success", "Update number of student Successed",countNumberOfStudent)
                );
    }
    @GetMapping("/countStudent")
    public ResponseEntity<ResponseObject> getCountStudent(){
        return ResponseEntity.status(HttpStatus.OK).body(
                new ResponseObject("Success", "Get number of student Successed",countNumberOfStudent)
        );
    }
}
