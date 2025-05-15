package com.bruno.callshield;

public class VoipCallBlocker {
    // Atribui uma nova instância de VoipCallBlocker a INSTANCE
    public static final VoipCallBlocker INSTANCE = new VoipCallBlocker();
    private String scheme;

    // Torna o construtor privado para evitar instâncias diretas
    private VoipCallBlocker() {
        // Código de inicialização, se necessário
    }

    public boolean shouldBlockVoipCall(String number, String scheme) {
        return false;
    }

    // Adicione outros métodos para a funcionalidade do seu VoipCallBlocker
}