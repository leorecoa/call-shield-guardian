package com.bruno.callshield;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.util.LruCache;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.regex.Pattern;

public class VoipCallBlocker {
    private static final String TAG = "VoipCallBlocker";
    private static final String PREFS_NAME = "VoipBlockerPrefs";
    private static final String KEY_BLOCKED_NUMBERS = "blockedNumbers";
    private static final String KEY_ALLOWED_NUMBERS = "allowedNumbers";
    private static final int CACHE_SIZE = 200;
    
    // Singleton instance
    public static final VoipCallBlocker INSTANCE = new VoipCallBlocker();
    
    // Cache para decisões de bloqueio
    private final LruCache<String, Boolean> blockDecisionCache = new LruCache<>(CACHE_SIZE);
    
    // Executor para operações em segundo plano
    private final Executor backgroundExecutor = Executors.newSingleThreadExecutor();
    
    // Handler para operações na thread principal
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    
    // Contexto da aplicação
    private Context context;
    
    // Preferências compartilhadas
    private SharedPreferences preferences;
    
    // Conjuntos de números bloqueados e permitidos
    private Set<String> blockedNumbers = new HashSet<>();
    private Set<String> allowedNumbers = new HashSet<>();
    
    // Padrões suspeitos pré-compilados para melhor desempenho
    private final Pattern[] suspiciousPatterns = {
        Pattern.compile("^\\+?0{5,}\\d*$"),  // Números com muitos zeros
        Pattern.compile("^\\+?1{5,}\\d*$"),  // Números com muitos uns
        Pattern.compile("^\\+?(.)(\\1{4,})\\d*$")  // Dígitos repetidos
    };

    // Construtor privado para singleton
    private VoipCallBlocker() {
        // Inicialização mínima aqui
    }
    
    // Método para inicializar o contexto
    public void initialize(Context appContext) {
        if (this.context == null) {
            this.context = appContext.getApplicationContext();
            this.preferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            
            // Carregar listas de bloqueio/permissão em segundo plano
            backgroundExecutor.execute(this::loadBlockLists);
        }
    }

    // Método principal para verificar se uma chamada deve ser bloqueada
    public boolean shouldBlockVoipCall(String number, String scheme) {
        // Se não temos contexto, não podemos tomar decisões informadas
        if (context == null) {
            return false;
        }
        
        // Criar chave de cache
        String cacheKey = scheme + ":" + number;
        
        // Verificar cache primeiro
        Boolean cachedDecision = blockDecisionCache.get(cacheKey);
        if (cachedDecision != null) {
            return cachedDecision;
        }
        
        // Verificar se o número está na lista de permissões
        if (isNumberAllowed(number)) {
            blockDecisionCache.put(cacheKey, false);
            return false;
        }
        
        // Verificar se o número está na lista de bloqueio
        if (isNumberBlocked(number)) {
            blockDecisionCache.put(cacheKey, true);
            
            // Notificar sobre o bloqueio em segundo plano
            final String finalNumber = number;
            backgroundExecutor.execute(() -> {
                if (context != null) {
                    String reason = determineBlockReason(finalNumber, scheme);
                    NotificationHelper.showBlockedCallNotification(context, finalNumber, reason);
                }
            });
            
            return true;
        }
        
        // Verificar padrões suspeitos
        boolean shouldBlock = checkIfShouldBlock(number, scheme);
        
        // Armazenar decisão em cache
        blockDecisionCache.put(cacheKey, shouldBlock);
        
        // Se decidimos bloquear, notificar em segundo plano
        if (shouldBlock) {
            final String finalNumber = number;
            backgroundExecutor.execute(() -> {
                if (context != null) {
                    String reason = determineBlockReason(finalNumber, scheme);
                    NotificationHelper.showBlockedCallNotification(context, finalNumber, reason);
                }
            });
        }
        
        return shouldBlock;
    }
    
    // Verificar se o número está na lista de bloqueio
    private boolean isNumberBlocked(String number) {
        if (number == null || number.isEmpty()) {
            return false;
        }
        
        // Normalizar o número para comparação
        String normalizedNumber = normalizeNumber(number);
        
        // Verificar na lista de bloqueio
        return blockedNumbers.contains(normalizedNumber);
    }
    
    // Verificar se o número está na lista de permissões
    private boolean isNumberAllowed(String number) {
        if (number == null || number.isEmpty()) {
            return false;
        }
        
        // Normalizar o número para comparação
        String normalizedNumber = normalizeNumber(number);
        
        // Verificar na lista de permissões
        return allowedNumbers.contains(normalizedNumber);
    }
    
    // Lógica para determinar se a chamada deve ser bloqueada
    private boolean checkIfShouldBlock(String number, String scheme) {
        // Se não temos número, não podemos verificar
        if (number == null || number.isEmpty()) {
            return false;
        }
        
        // Verificar padrões suspeitos
        for (Pattern pattern : suspiciousPatterns) {
            if (pattern.matcher(number).matches()) {
                return true;
            }
        }
        
        // Implementar lógica adicional de bloqueio aqui
        // Por enquanto, retornamos false como no código original
        return false;
    }
    
    // Determina o motivo do bloqueio para exibir na notificação
    private String determineBlockReason(String number, String scheme) {
        // Implementar lógica para determinar o motivo do bloqueio
        if (number == null || number.isEmpty()) {
            return "Número anônimo";
        } else if (isNumberBlocked(number)) {
            return "Número na lista de bloqueio";
        } else if (scheme != null && scheme.equalsIgnoreCase("sip")) {
            return "Chamada SIP suspeita";
        } else {
            return "Chamada VoIP suspeita";
        }
    }
    
    // Carregar listas de bloqueio/permissão das preferências
    private void loadBlockLists() {
        try {
            blockedNumbers = new HashSet<>(preferences.getStringSet(KEY_BLOCKED_NUMBERS, new HashSet<>()));
            allowedNumbers = new HashSet<>(preferences.getStringSet(KEY_ALLOWED_NUMBERS, new HashSet<>()));
        } catch (Exception e) {
            Log.e(TAG, "Erro ao carregar listas de bloqueio", e);
            blockedNumbers = new HashSet<>();
            allowedNumbers = new HashSet<>();
        }
    }
    
    // Adicionar número à lista de bloqueio
    public void addBlockedNumber(String number) {
        if (number == null || number.isEmpty()) {
            return;
        }
        
        String normalizedNumber = normalizeNumber(number);
        
        backgroundExecutor.execute(() -> {
            Set<String> updatedList = new HashSet<>(preferences.getStringSet(KEY_BLOCKED_NUMBERS, new HashSet<>()));
            updatedList.add(normalizedNumber);
            
            // Remover da lista de permissões se estiver lá
            Set<String> allowList = new HashSet<>(preferences.getStringSet(KEY_ALLOWED_NUMBERS, new HashSet<>()));
            allowList.remove(normalizedNumber);
            
            // Salvar alterações
            preferences.edit()
                .putStringSet(KEY_BLOCKED_NUMBERS, updatedList)
                .putStringSet(KEY_ALLOWED_NUMBERS, allowList)
                .apply();
            
            // Atualizar listas em memória
            blockedNumbers = updatedList;
            allowedNumbers = allowList;
            
            // Limpar cache para este número
            clearCacheForNumber(normalizedNumber);
        });
    }
    
    // Adicionar número à lista de permissões
    public void addAllowedNumber(String number) {
        if (number == null || number.isEmpty()) {
            return;
        }
        
        String normalizedNumber = normalizeNumber(number);
        
        backgroundExecutor.execute(() -> {
            Set<String> updatedList = new HashSet<>(preferences.getStringSet(KEY_ALLOWED_NUMBERS, new HashSet<>()));
            updatedList.add(normalizedNumber);
            
            // Remover da lista de bloqueio se estiver lá
            Set<String> blockList = new HashSet<>(preferences.getStringSet(KEY_BLOCKED_NUMBERS, new HashSet<>()));
            blockList.remove(normalizedNumber);
            
            // Salvar alterações
            preferences.edit()
                .putStringSet(KEY_ALLOWED_NUMBERS, updatedList)
                .putStringSet(KEY_BLOCKED_NUMBERS, blockList)
                .apply();
            
            // Atualizar listas em memória
            allowedNumbers = updatedList;
            blockedNumbers = blockList;
            
            // Limpar cache para este número
            clearCacheForNumber(normalizedNumber);
        });
    }
    
    // Normalizar número para comparação consistente
    private String normalizeNumber(String number) {
        if (number == null) {
            return "";
        }
        
        // Remover caracteres não numéricos, exceto o sinal de +
        return number.replaceAll("[^\\d+]", "");
    }
    
    // Limpar cache para um número específico
    private void clearCacheForNumber(String number) {
        if (number == null) {
            return;
        }
        
        // Limpar entradas de cache que contêm este número
        synchronized (blockDecisionCache) {
            // Não podemos modificar o cache durante iteração, então coletamos chaves primeiro
            Set<String> keysToRemove = new HashSet<>();
            
            for (int i = 0; i < blockDecisionCache.size(); i++) {
                String key = blockDecisionCache.toString();
                if (key != null && key.contains(number)) {
                    keysToRemove.add(key);
                }
            }
            
            // Agora removemos as chaves coletadas
            for (String key : keysToRemove) {
                blockDecisionCache.remove(key);
            }
        }
    }
    
    // Limpar todo o cache
    public void clearCache() {
        blockDecisionCache.evictAll();
    }
}