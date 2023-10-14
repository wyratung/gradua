package dao.ai.demo;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.context.annotation.Import;

@SpringBootApplication
//@Import(CorsConfig.class)
public class FaceCheckAttendanceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FaceCheckAttendanceApplication.class, args);
	}

}
