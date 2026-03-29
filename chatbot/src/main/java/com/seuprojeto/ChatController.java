package com.seuprojeto;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class ChatController {

    @GetMapping("/teste")
    public String teste() {
        return "Backend funcionando";
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> body) {
        String msg = body.get("message");
        String resposta;

        if (msg == null) {
            resposta = "Mensagem vazia";
        } else {
            msg = msg.toLowerCase();

            if (msg.contains("hamburguer")) {
                resposta = "Temos X-Burger, X-Bacon e X-Tudo";
            } else if (msg.contains("preco") || msg.contains("preço")) {
                resposta = "X-Burger 28, X-Bacon 32, X-Tudo 38";
            } else if (msg.contains("oi") || msg.contains("ola") || msg.contains("olá")) {
                resposta = "ESSA RESPOSTA VEIO DO JAVA!";
            } else {
                resposta = "Nao entendi";
            }
        }

        Map<String, String> retorno = new HashMap<>();
        retorno.put("reply", resposta);
        return retorno;
    }
}