package com.sillador.strecs.brokerservice.authentication;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Account {
    
    private String identifier;
    private String[] roles;
    private Long id;
    private Long accountRef;
}
