package com.bruno.callshield;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";
    private BatteryOptimizationManager batteryOptimizationManager;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Registrar plugins
        registerPlugin(CallSettingsPlugin.class);
        
        // Inicializar gerenciador de otimização de bateria
        batteryOptimizationManager = new BatteryOptimizationManager(this);
        
        // Verificar otimização de bateria
        checkBatteryOptimization();
    }
    
    private void checkBatteryOptimization() {
        // Se o aplicativo não está isento de otimização de bateria e ainda não solicitamos
        if (!batteryOptimizationManager.isIgnoringBatteryOptimizations() && 
            !batteryOptimizationManager.hasRequestedExemption()) {
            
            // Solicitar isenção de otimização de bateria
            batteryOptimizationManager.requestBatteryOptimizationExemption(this);
        }
    }
    
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        // Processar resultado da solicitação de isenção de otimização de bateria
        if (batteryOptimizationManager.handleActivityResult(requestCode, resultCode)) {
            Log.d(TAG, "Resultado da solicitação de otimização de bateria processado");
        }
    }
}