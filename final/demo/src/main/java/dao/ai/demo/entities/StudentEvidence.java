package dao.ai.demo.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "student_evidence")
public class StudentEvidence {
    @Id
    @Column(nullable = false,name = "id")
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "title")
    private String title;
    @Column(name="time")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime time;
    @Column(name = "pathVideo")
    private String pathVideo;
    @Column(nullable = false,name="mssv")
    private String mssv;
    @Column(nullable = false,name = "classID")
    private String classID;
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumns({
//            @JoinColumn(name="classID", referencedColumnName="classID"),
//            @JoinColumn(name="mssv", referencedColumnName="mssv")
//    })
//    private StudentParticipation studentParticipation;
}
