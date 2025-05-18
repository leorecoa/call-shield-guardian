package com.bruno.callshield;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.telecom.Call;
import android.telecom.CallScreeningService;
import android.util.Log;
import android.util.LruCache;

import androidx.annotation.RequiresApi;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

@RequiresApi(api = Build.VERSION_CODES.N)
public class CallBlockerService extends CallScreeningService {
    private static final String TAG = "CallBlockerService";
    private static final String PREFS_NAME = "CallBlockerPrefs";
    private static final String KEY_IS_ACTIVE = "isActive";
    private static final int CACHE_SIZE = 100; // Tamanho do cache para números recentes
    
    // Cache para armazenar resultados de bloqueio recentes
    private final LruCache<String, Boolean> blockCache = new LruCache<>(CACHE_SIZE);
    
    // Executor para processamento em segundo plano
    private final Executor backgroundExecutor = Executors.newSingleThreadExecutor();
    
    // Handler para operações na thread principal
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    
    // Preferências compartilhadas para configurações
    private SharedPreferences preferences;
    
    // Flag para controlar se o serviço está ativo
    private boolean isServiceActive = true;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "CallBlockerService criado");
        
        // Inicializa o canal de notificação quando o serviço é criado
        NotificationHelper.createNotificationChannel(this);
        
        // Inicializa as preferências
        preferences = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        isServiceActive = preferences.getBoolean(KEY_IS_ACTIVE, true);
        
        // Inicializa o VoipCallBlocker com o contexto
        VoipCallBlocker.INSTANCE.initialize(getApplicationContext());
        
        // Pré-aquece o cache com números conhecidos
        warmUpCache();
    }

    @Override
    public void onScreenCall(Call.Details callDetails) {
        // Se o serviço não estiver ativo, permitir todas as chamadas
        if (!isServiceActive) {
            respondToCall(callDetails, new CallResponse.Builder().setDisallowCall(false).build());
            return;
        }
        
        // Processar a chamada em segundo plano para não bloquear a thread principal
        backgroundExecutor.execute(() -> processCall(callDetails));
    }
    
    // Método para processar a chamada em segundo plano
    private void processCall(Call.Details callDetails) {
        Uri handle = callDetails.getHandle();
        final String scheme = (handle != null) ? handle.getScheme() : "unknown";
        final String number = (handle != null) ? handle.getSchemeSpecificPart() : "desconhecido";
        
        // Criar uma chave de cache única para esta chamada
        final String cacheKey = scheme + ":" + number;
        
        // Verificar se já temos uma decisão em cache para este número
        Boolean cachedResult = blockCache.get(cacheKey);
        if (cachedResult != null) {
            Log.d(TAG, "Usando resultado em cache para: " + number);
            respondWithCachedResult(callDetails, cachedResult, number, scheme);
            return;
        }
        
        // Log com nível de prioridade mais baixo para economizar bateria
        if (Log.isLoggable(TAG, Log.DEBUG)) {
            Log.d(TAG, "Chamando de: " + number + ", via: " + scheme);
        }

        boolean isVoip = "sip".equalsIgnoreCase(scheme) || "voip".equalsIgnoreCase(scheme);
        
        if (isVoip) {
            // Verificar se deve bloquear a chamada VoIP
            boolean shouldBlock = VoipCallBlocker.INSTANCE.shouldBlockVoipCall(number, scheme);
            
            // Armazenar o resultado em cache para futuras chamadas
            blockCache.put(cacheKey, shouldBlock);
            
            // Responder à chamada na thread principal
            final boolean finalShouldBlock = shouldBlock;
            mainHandler.post(() -> {
                CallResponse.Builder responseBuilder = new CallResponse.Builder();
                
                if (finalShouldBlock) {
                    if (Log.isLoggable(TAG, Log.DEBUG)) {
                        Log.d(TAG, "Bloqueando chamada VoIP SUSPEITA: " + number);
                    }
                    responseBuilder.setDisallowCall(true);
                    responseBuilder.setRejectCall(true);
                    responseBuilder.setSkipCallLog(true);
                    responseBuilder.setSkipNotification(true);
                    
                    // Envia notificação sobre a chamada bloqueada
                    sendBlockedCallNotification(number, "Chamada VoIP suspeita");
                } else {
                    if (Log.isLoggable(TAG, Log.DEBUG)) {
                        Log.d(TAG, "Chamada VoIP permitida: " + number);
                    }
                    responseBuilder.setDisallowCall(false);
                }
                
                respondToCall(callDetails, responseBuilder.build());
            });
        } else {
            // Para chamadas não VoIP, permitir por padrão
            mainHandler.post(() -> {
                respondToCall(callDetails, new CallResponse.Builder().setDisallowCall(false).build());
            });
        }
    }
    
    // Responder com resultado em cache
    private void respondWithCachedResult(Call.Details callDetails, boolean shouldBlock, String number, String scheme) {
        mainHandler.post(() -> {
            CallResponse.Builder responseBuilder = new CallResponse.Builder();
            
            if (shouldBlock) {
                responseBuilder.setDisallowCall(true);
                responseBuilder.setRejectCall(true);
                responseBuilder.setSkipCallLog(true);
                responseBuilder.setSkipNotification(true);
                
                // Envia notificação sobre a chamada bloqueada
                sendBlockedCallNotification(number, "Chamada VoIP suspeita (cache)");
            } else {
                responseBuilder.setDisallowCall(false);
            }
            
            respondToCall(callDetails, responseBuilder.build());
        });
    }
    
    // Método para enviar notificação sobre chamada bloqueada
    private void sendBlockedCallNotification(String number, String reason) {
        Context context = getApplicationContext();
        NotificationHelper.showBlockedCallNotification(context, number, reason);
    }
    
    // Método para ativar/desativar o serviço
    public void setServiceActive(boolean active) {
        isServiceActive = active;
        preferences.edit().putBoolean(KEY_IS_ACTIVE, active).apply();
    }
    
    // Método para pré-aquecer o cache com números conhecidos
    private void warmUpCache() {
        backgroundExecutor.execute(() -> {
            // Aqui você pode carregar números conhecidos de um banco de dados
            // ou arquivo de configuração e pré-popular o cache
            // Por exemplo:
            // blockCache.put("sip:spam1@example.com", true);
            // blockCache.put("voip:+1234567890", true);
        });
    }
    
    // Limpar recursos quando o serviço for destruído
    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "CallBlockerService destruído");
        blockCache.evictAll();
    }
}