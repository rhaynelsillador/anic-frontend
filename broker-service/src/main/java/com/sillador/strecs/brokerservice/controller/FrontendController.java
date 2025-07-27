package com.sillador.strecs.brokerservice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class FrontendController {

    @GetMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/index.html";
    }

    @GetMapping(value = "/*/{path:[^\\.]*}")
    public String redirectNested() {
        return "forward:/index.html";
    }


    @GetMapping(value = "/*/*/{path:[^\\.]*}")
    public String doubleNested() {
        return "forward:/index.html";
    }
}
