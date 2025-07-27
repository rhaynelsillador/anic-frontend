package com.sillador.strecs.brokerservice.dto;

public class User {
    private int id = 1;
    private String fullName = "Rhaynel Sillador";
    private String role = "ADMIN";

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
