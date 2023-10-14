package dao.ai.demo.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "student_participation")
public class StudentParticipation {
    @Id
    @Column(nullable = false,name = "id")
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false,name = "mssv")
    private String mssv;

    @Column(nullable = false,name = "classID")
    private String classID;

    @Column(name = "name")
    private String name;
    @Column(name="time_join")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timeJoin;
    @Column(nullable = false,name= "code")
    private Integer code;
//    @OneToMany(mappedBy = "studentParticipation", cascade = CascadeType.ALL,orphanRemoval = true, fetch = FetchType.LAZY)
//    private List<StudentEvidence> studentEvidences = new ArrayList<>();

}
