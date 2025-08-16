package com.sillador.strecs.brokerservice.service;

import com.sillador.strecs.brokerservice.dto.FileUploadResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class FileUploadService {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadService.class);

    @Value("${file.upload.profile-pictures.path}")
    private String profilePicturesPath;

    @Value("${file.upload.documents.path}")
    private String documentsPath;

    @PostConstruct
    public void init() {
        try {
            // Create directories if they don't exist
            Files.createDirectories(Paths.get(profilePicturesPath));
            Files.createDirectories(Paths.get(documentsPath));
            logger.info("Upload directories initialized:");
            logger.info("Profile pictures: {}", profilePicturesPath);
            logger.info("Documents: {}", documentsPath);
        } catch (IOException e) {
            logger.error("Failed to create upload directories: {}", e.getMessage());
        }
    }

    public FileUploadResponse uploadProfilePicture(MultipartFile file) throws IOException {
        return uploadFile(file, profilePicturesPath, "profile-pictures");
    }

    public FileUploadResponse uploadDocument(MultipartFile file) throws IOException {
        return uploadFile(file, documentsPath, "documents");
    }

    private FileUploadResponse uploadFile(MultipartFile file, String uploadPath, String fileType) throws IOException {
        // Create directory if it doesn't exist
        Path uploadDirectory = Paths.get(uploadPath);
        if (!Files.exists(uploadDirectory)) {
            Files.createDirectories(uploadDirectory);
        }

        // Generate unique filename with timestamp
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        String fileName = timestamp + "_" + uniqueId + fileExtension;

        // Save file
        Path filePath = uploadDirectory.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Create file URL (relative to serve via static resources)
        String fileUrl = "/uploads/" + fileType + "/" + fileName;

        return new FileUploadResponse(
                fileName,
                filePath.toString(),
                fileUrl,
                file.getContentType(),
                file.getSize(),
                "File uploaded successfully"
        );
    }

    public boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            return Files.deleteIfExists(path);
        } catch (IOException e) {
            return false;
        }
    }
}
