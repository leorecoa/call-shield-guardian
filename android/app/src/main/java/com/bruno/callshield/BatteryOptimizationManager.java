package com.bruno.callshield;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;

/**
 * Gerenciador para otimização de bateria e permissões relacionadas
 */
public class BatteryOptimizationManager {
    private static final String TAG = "BatteryOptimManager";
    private static final String PREFS_NAME = "BatteryOptimPrefs";
    private static final String KEY_REQUESTED_EXEMPTION = "requestedExemption";
    private static final int REQUEST_BATTERY_OPTIMIZATION = 1001;
    
    private final Context context;
    private final SharedPreferences preferences;
    
    public BatteryOptimizationManager(Context context) {
        this.context = context.getApplicationContext();
        this.preferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }
    
    /**
     * Verifica se o aplicativo está isento de otimizações de bateria
     */
    public boolean isIgnoringBatteryOptimizations() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PowerManager powerManager = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            return powerManager.isIgnoringBatteryOptimizations(context.getPackageName());
        }
        return true; // Em versões anteriores ao Android M, não há otimização de bateria
    }
    
    /**
     * Solicita ao usuário que desative as otimizações de bateria para o aplicativo
     * @param activity Activity atual para iniciar a intent
     * @return true se a solicitação foi iniciada, false caso contrário
     */
    public boolean requestBatteryOptimizationExemption(Activity activity) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!isIgnoringBatteryOptimizations()) {
                try {
                    Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                    intent.setData(Uri.parse("package:" + context.getPackageName()));
                    activity.startActivityForResult(intent, REQUEST_BATTERY_OPTIMIZATION);
                    
                    // Marcar que já solicitamos a isenção
                    preferences.edit().putBoolean(KEY_REQUESTED_EXEMPTION, true).apply();
                    return true;
                } catch (Exception e) {
                    Log.e(TAG, "Erro ao solicitar isenção de otimização de bateria", e);
                    return false;
                }
            }
        }
        return false;
    }
    
    /**
     * Verifica se já solicitamos a isenção de otimização de bateria
     */
    public boolean hasRequestedExemption() {
        return preferences.getBoolean(KEY_REQUESTED_EXEMPTION, false);
    }
    
    /**
     * Abre as configurações de otimização de bateria para o aplicativo
     * @param activity Activity atual para iniciar a intent
     * @return true se a intent foi iniciada, false caso contrário
     */
    public boolean openBatteryOptimizationSettings(Activity activity) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                Intent intent = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
                activity.startActivity(intent);
                return true;
            } catch (Exception e) {
                Log.e(TAG, "Erro ao abrir configurações de otimização de bateria", e);
                return false;
            }
        }
        return false;
    }
    
    /**
     * Processa o resultado da solicitação de isenção de otimização de bateria
     * @param requestCode Código da solicitação
     * @param resultCode Código do resultado
     * @return true se a solicitação foi processada, false caso contrário
     */
    public boolean handleActivityResult(int requestCode, int resultCode) {
        if (requestCode == REQUEST_BATTERY_OPTIMIZATION) {
            // Verificar se a isenção foi concedida
            boolean isExempt = isIgnoringBatteryOptimizations();
            Log.d(TAG, "Resultado da solicitação de isenção: " + (isExempt ? "concedida" : "negada"));
            return true;
        }
        return false;
    }
}