package com.sillador.strecs.brokerservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadResponse {
    private String fileName;
    private String filePath;
    private String fileUrl;
    private String fileType;
    private long fileSize;
    private String message;
}
