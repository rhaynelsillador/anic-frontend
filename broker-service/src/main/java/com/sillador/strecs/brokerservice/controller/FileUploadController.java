package com.sillador.strecs.brokerservice.controller;

import com.sillador.strecs.brokerservice.dto.BaseResponse;
import com.sillador.strecs.brokerservice.dto.FileUploadResponse;
import com.sillador.strecs.brokerservice.dto.ResponseCode;
import com.sillador.strecs.brokerservice.service.FileUploadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/files")
@Order(1) // Higher priority than BrokerRestController
public class FileUploadController {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
    private final FileUploadService fileUploadService;

    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @PostMapping("/upload/profile-picture")
    public ResponseEntity<BaseResponse> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            logger.info("Uploading profile picture: {} ({}bytes)", file.getOriginalFilename(), file.getSize());
            
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new BaseResponse().build(ResponseCode.ERROR, "Please select a file to upload"));
            }

            // Validate file type (images only)
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(new BaseResponse().build(ResponseCode.ERROR, "Only image files are allowed"));
            }

            // Validate file size (2MB max)
            if (file.getSize() > 2 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(new BaseResponse().build(ResponseCode.ERROR, "File size must be less than 2MB"));
            }

            FileUploadResponse uploadResponse = fileUploadService.uploadProfilePicture(file);
            logger.info("Profile picture uploaded successfully: {}", uploadResponse.getFileUrl());
            
            return ResponseEntity.ok(new BaseResponse().build(uploadResponse));

        } catch (Exception e) {
            logger.error("Failed to upload profile picture", e);
            return ResponseEntity.internalServerError()
                    .body(new BaseResponse().build(ResponseCode.INTERNAL_SERVER_ERROR, "Failed to upload file: " + e.getMessage()));
        }
    }

    @PostMapping("/upload/document")
    public ResponseEntity<BaseResponse> uploadDocument(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new BaseResponse().build(ResponseCode.ERROR, "Please select a file to upload"));
            }

            // Validate file size (5MB max)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(new BaseResponse().build(ResponseCode.ERROR, "File size must be less than 5MB"));
            }

            FileUploadResponse uploadResponse = fileUploadService.uploadDocument(file);
            return ResponseEntity.ok(new BaseResponse().build(uploadResponse));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new BaseResponse().build(ResponseCode.INTERNAL_SERVER_ERROR, "Failed to upload file: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<BaseResponse> deleteFile(@RequestParam("filePath") String filePath) {
        try {
            boolean deleted = fileUploadService.deleteFile(filePath);
            if (deleted) {
                return ResponseEntity.ok(new BaseResponse().build("File deleted successfully"));
            } else {
                return ResponseEntity.badRequest()
                        .body(new BaseResponse().build(ResponseCode.ERROR, "Failed to delete file"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new BaseResponse().build(ResponseCode.INTERNAL_SERVER_ERROR, "Error deleting file: " + e.getMessage()));
        }
    }
}
