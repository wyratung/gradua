package dao.ai.demo.entities;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="student_images")
public class StudentImages {
    @Id
    @Column(nullable = false, unique = true, length = 10, name = "MSSV")
    private String mssv;
    @Column(nullable=false,name="approve_code")
    private Integer approveCode;
    @Column(nullable=false,name="time_take_photo")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timeSelfie;
    @ElementCollection
    @Column(nullable=false,name = "list_images")
    private List<String> listImages;
    @Column(name="infor_ta")
    private String inforTA;
    @Column(name="note",length = 1024)
    private String note;
    @Column(name="time_approve")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timeApprove;
    @Column(nullable = false,name = "portrait_image")
    private String portraitImage;
}
