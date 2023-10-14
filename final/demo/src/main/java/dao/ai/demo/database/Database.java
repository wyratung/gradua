 //package dao.ai.demo.database;
//
//import dao.ai.demo.entities.StudentImages;
//import dao.ai.demo.repositories.StudentImagesRepository;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import java.util.Random;
//
//
//@Configuration
//public class Database {
//    private static final Logger logger = LoggerFactory.getLogger(Database.class);
//    @Bean
//    CommandLineRunner initDatabase(StudentImagesRepository studentImagesRepository) {
//        return new CommandLineRunner() {
//            private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
//            @Override
//            public void run(String... args) throws Exception {
//
//                for(int i=2319;i<2331;i++){
//                    Random random = new Random();
//                    logger.info("insert data: "+studentImagesRepository.save(new StudentImages(Integer.toString(i),generateRandomString(10),
//                            random.nextInt(4) + 1,randomData(),randomData())));
//                }
//
//            }
//            public LocalDateTime randomData(){
//                Random random = new Random();
//                int year = random.nextInt(10) + 2010; // năm từ 2010 đến 2019
//                int month = random.nextInt(12) + 1; // tháng từ 1 đến 12
//                int day = random.nextInt(28) + 1; // ngày từ 1 đến 28
//                int hour = random.nextInt(24); // giờ từ 0 đến 23
//                int minute = random.nextInt(60); // phút từ 0 đến 59
//                int second = random.nextInt(60); // giây từ 0 đến 59
//
//                LocalDateTime dateTime = LocalDateTime.of(year, month, day, hour, minute, second);
//                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
//                return dateTime;
//            }
//            public  String generateRandomString(int length) {
//                Random random = new Random();
//                StringBuilder sb = new StringBuilder(length);
//                for (int i = 0; i < length; i++) {
//                    int randomIndex = random.nextInt(CHARACTERS.length());
//                    char randomChar = CHARACTERS.charAt(randomIndex);
//                    sb.append(randomChar);
//                }
//                return sb.toString();
//            }
//
//        };
//    }
//}
