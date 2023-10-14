package dao.ai.demo.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentImagesDTO  {
    private String mssv;
    private Integer approveCode;
    private LocalDateTime timeSelfie;
    private LocalDateTime timeApprove;
    private String portraitImage;
}
