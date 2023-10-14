package dao.ai.demo.repositories;

import dao.ai.demo.entities.StudentImages;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface StudentImagesRepository extends JpaRepository<StudentImages,String> {
    String FILTER_STUDENT_ON_ID_OR_NAME_QUERY = "SELECT c FROM StudentImages c WHERE c.mssv LIKE %:keyword%  ";

    @Query(FILTER_STUDENT_ON_ID_OR_NAME_QUERY)
    Page<StudentImages> findByFirstMSSVLikeORNameLike(@Param("keyword") String keyword, Pageable pageable );


}
