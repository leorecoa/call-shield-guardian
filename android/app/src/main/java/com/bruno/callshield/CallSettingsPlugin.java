package com.bruno.callshield;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;

import androidx.activity.result.ActivityResultLauncher;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "CallSettingsPlugin")
public class CallSettingsPlugin extends Plugin {
    private static final String TAG = "CallSettingsPlugin";
    private static final int REQUEST_PHONE_PERMISSIONS = 1001;
    private static final int REQUEST_NOTIFICATION_PERMISSION = 1002;
    private static final int REQUEST_BATTERY_OPTIMIZATION = 1003;
    
    // Executor para operações em segundo plano
    private final Executor backgroundExecutor = Executors.newSingleThreadExecutor();
    
    // Handler para operações na thread principal
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    
    // Gerenciador de otimização de bateria
    private BatteryOptimizationManager batteryOptimizationManager;

    @Override
    public void load() {
        super.load();
        batteryOptimizationManager = new BatteryOptimizationManager(getContext());
    }

    @PluginMethod
    public void enableCallBlocking(PluginCall call) {
        boolean enable = call.getBoolean("enable", false);
        Log.d(TAG, "Chamada para enableCallBlocking: " + enable);
        
        // Executar em segundo plano para não bloquear a thread principal
        backgroundExecutor.execute(() -> {
            try {
                // Aqui você implementaria a lógica para ativar/desativar o bloqueio de chamadas
                // Por exemplo, configurar o CallBlockerService
                
                // Se estamos ativando, verificar otimização de bateria
                if (enable && !batteryOptimizationManager.isIgnoringBatteryOptimizations() && 
                    !batteryOptimizationManager.hasRequestedExemption()) {
                    // Solicitar isenção de otimização de bateria
                    mainHandler.post(() -> {
                        Activity activity = getActivity();
                        if (activity != null) {
                            batteryOptimizationManager.requestBatteryOptimizationExemption(activity);
                        }
                    });
                }
                
                // Responder na thread principal
                mainHandler.post(() -> {
                    JSObject ret = new JSObject();
                    ret.put("success", true);
                    call.resolve(ret);
                });
            } catch (Exception e) {
                Log.e(TAG, "Erro ao ativar/desativar bloqueio de chamadas", e);
                mainHandler.post(() -> {
                    JSObject ret = new JSObject();
                    ret.put("success", false);
                    ret.put("error", e.getMessage());
                    call.reject(e.getMessage(), e);
                });
            }
        });
    }

    @PluginMethod
    public void updateBlockSettings(PluginCall call) {
        JSObject settings = call.getObject("settings");
        Log.d(TAG, "Chamada para updateBlockSettings: " + settings.toString());
        
        // Executar em segundo plano
        backgroundExecutor.execute(() -> {
            try {
                // Aqui você implementaria a lógica para atualizar as configurações
                
                // Responder na thread principal
                mainHandler.post(() -> {
                    JSObject ret = new JSObject();
                    ret.put("success", true);
                    call.resolve(ret);
                });
            } catch (Exception e) {
                Log.e(TAG, "Erro ao atualizar configurações", e);
                mainHandler.post(() -> {
                    call.reject(e.getMessage(), e);
                });
            }
        });
    }

    @PluginMethod
    public void updateCustomList(PluginCall call) {
        JSObject listObj = call.getObject("list");
        Log.d(TAG, "Chamada para updateCustomList: " + listObj.toString());
        
        // Executar em segundo plano
        backgroundExecutor.execute(() -> {
            try {
                // Aqui você implementaria a lógica para atualizar a lista personalizada
                
                // Responder na thread principal
                mainHandler.post(() -> {
                    JSObject ret = new JSObject();
                    ret.put("success", true);
                    call.resolve(ret);
                });
            } catch (Exception e) {
                Log.e(TAG, "Erro ao atualizar lista personalizada", e);
                mainHandler.post(() -> {
                    call.reject(e.getMessage(), e);
                });
            }
        });
    }

    @PluginMethod
    public void checkPermissions(PluginCall call) {
        // Executar em segundo plano
        backgroundExecutor.execute(() -> {
            Context context = getContext();
            boolean hasPhonePermission = ContextCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED;
            boolean hasCallScreeningPermission = isCallScreeningPermissionGranted(context);
            
            // Responder na thread principal
            mainHandler.post(() -> {
                JSObject ret = new JSObject();
                ret.put("granted", hasPhonePermission && hasCallScreeningPermission);
                call.resolve(ret);
            });
        });
    }

    @PluginMethod
    public void requestPermissions(PluginCall call) {
        saveCall(call);
        
        String[] permissions = {
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.READ_CALL_LOG
        };
        
        pluginRequestPermissions(permissions, REQUEST_PHONE_PERMISSIONS);
    }
    
    @PluginMethod
    public void checkNotificationPermission(PluginCall call) {
        // Executar em segundo plano
        backgroundExecutor.execute(() -> {
            boolean granted = false;
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                granted = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED;
            } else {
                // Em versões anteriores ao Android 13, não é necessária permissão explícita
                granted = true;
            }
            
            // Responder na thread principal
            final boolean finalGranted = granted;
            mainHandler.post(() -> {
                JSObject ret = new JSObject();
                ret.put("granted", finalGranted);
                call.resolve(ret);
            });
        });
    }
    
    @PluginMethod
    public void requestNotificationPermission(PluginCall call) {
        saveCall(call);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            String[] permissions = { Manifest.permission.POST_NOTIFICATIONS };
            pluginRequestPermissions(permissions, REQUEST_NOTIFICATION_PERMISSION);
        } else {
            // Em versões anteriores ao Android 13, não é necessária permissão explícita
            JSObject ret = new JSObject();
            ret.put("granted", true);
            call.resolve(ret);
        }
    }
    
    @PluginMethod
    public void checkBatteryOptimization(PluginCall call) {
        // Executar em segundo plano
        backgroundExecutor.execute(() -> {
            boolean isExempt = batteryOptimizationManager.isIgnoringBatteryOptimizations();
            boolean hasRequested = batteryOptimizationManager.hasRequestedExemption();
            
            // Responder na thread principal
            mainHandler.post(() -> {
                JSObject ret = new JSObject();
                ret.put("isExempt", isExempt);
                ret.put("hasRequested", hasRequested);
                call.resolve(ret);
            });
        });
    }
    
    @PluginMethod
    public void requestBatteryOptimizationExemption(PluginCall call) {
        saveCall(call);
        
        Activity activity = getActivity();
        if (activity != null) {
            boolean requested = batteryOptimizationManager.requestBatteryOptimizationExemption(activity);
            
            if (!requested) {
                JSObject ret = new JSObject();
                ret.put("success", false);
                ret.put("message", "Não foi possível solicitar isenção de otimização de bateria");
                call.resolve(ret);
            }
        } else {
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("message", "Activity não disponível");
            call.resolve(ret);
        }
    }

    @Override
    protected void handleRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.handleRequestPermissionsResult(requestCode, permissions, grantResults);
        
        PluginCall savedCall = getSavedCall();
        if (savedCall == null) {
            return;
        }
        
        JSObject ret = new JSObject();
        
        if (requestCode == REQUEST_PHONE_PERMISSIONS) {
            boolean allGranted = true;
            for (int result : grantResults) {
                if (result != PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }
            
            ret.put("granted", allGranted);
            savedCall.resolve(ret);
        } else if (requestCode == REQUEST_NOTIFICATION_PERMISSION) {
            boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            ret.put("granted", granted);
            savedCall.resolve(ret);
        }
    }
    
    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);
        
        if (requestCode == REQUEST_BATTERY_OPTIMIZATION) {
            PluginCall savedCall = getSavedCall();
            if (savedCall != null) {
                boolean isExempt = batteryOptimizationManager.isIgnoringBatteryOptimizations();
                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("isExempt", isExempt);
                savedCall.resolve(ret);
            }
        }
    }

    private boolean isCallScreeningPermissionGranted(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            String packageName = context.getPackageName();
            String defaultDialer = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.DEFAULT_DIALER);
            return packageName.equals(defaultDialer);
        }
        return true;
    }
}