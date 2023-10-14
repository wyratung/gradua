package dao.ai.demo.repositories;

import dao.ai.demo.entities.StudentImages;
import dao.ai.demo.entities.StudentParticipation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentParticipationRepository extends JpaRepository<StudentParticipation,Long> {
    String FIND_STUDENT_BY_MSSV_AND_CLASSID="SELECT s FROM StudentParticipation s WHERE s.mssv =:mssv AND s.classID =:classID";
    String  FIND_ALL_STUDENT_BY_CLASSID_AND_KEYWORD ="SELECT s FROM StudentParticipation s WHERE s.classID =:classID AND s.mssv LIKE %:keyword% OR s.name LIKE %:keyword%";
    @Query(FIND_STUDENT_BY_MSSV_AND_CLASSID)
    StudentParticipation findByMSSVAndClassID(@Param("mssv") String mssv,@Param("classID") String classID);

    @Query(FIND_ALL_STUDENT_BY_CLASSID_AND_KEYWORD)
    Page<StudentParticipation> findAllByClassIDAndKeyword(@Param("classID") String classID,@Param("keyword") String keyword, Pageable pageable );
}
