package com.Major.Online.Exam.Helper;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Component
public class ImageUploadHelper {

    public final String UPLOAD_DIR;

    public ImageUploadHelper() {
        UPLOAD_DIR = System.getProperty("user.dir") + "/src/main/resources/static/uploads";
        System.out.println(UPLOAD_DIR);

        File uploadDir = new File(UPLOAD_DIR);
        if(!uploadDir.exists())
            uploadDir.mkdirs();
    }

    public boolean uploadFile(MultipartFile f){
        boolean flag=false;
        try {
            String path= UPLOAD_DIR + File.separator + f.getOriginalFilename();
            Files.copy(f.getInputStream(), Paths.get(path), StandardCopyOption.REPLACE_EXISTING);
            flag=true;
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return flag;
    }
}
