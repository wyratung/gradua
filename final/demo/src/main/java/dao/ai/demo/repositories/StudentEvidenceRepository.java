package dao.ai.demo.repositories;

import dao.ai.demo.entities.StudentEvidence;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface StudentEvidenceRepository extends JpaRepository<StudentEvidence,Long> {
    String FIND_ALL_EVIDENCES_OF_ONE_STUDENT_BY_MSSV_AND_CLASSID =
            "SELECT s FROM StudentEvidence s WHERE s.mssv =:mssv AND s.classID =:classID";
    @Query(FIND_ALL_EVIDENCES_OF_ONE_STUDENT_BY_MSSV_AND_CLASSID)
    Page<StudentEvidence> findEvidenceByMssvAndClassID(@Param("mssv") String mssv, @Param("classID") String classID, Pageable pageable);
}
