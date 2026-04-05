package com.opas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    // Forward all non-API paths to index.html for React SPA handling
    @RequestMapping(value = { "/", "/{path:[^\\.]*}" })
    public String redirect() {
        return "forward:/index.html";
    }
}
