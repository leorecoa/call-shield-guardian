package com.bruno.callshield;

import android.net.Uri;
import android.os.Build;
import android.telecom.Call;
import android.telecom.CallScreeningService;
import android.util.Log;

import androidx.annotation.RequiresApi;

@RequiresApi(api = Build.VERSION_CODES.N)
public class CallBlockerService extends CallScreeningService {

    @Override
    public void onScreenCall(Call.Details callDetails) {
        Uri handle = callDetails.getHandle();
        String scheme = (handle != null) ? handle.getScheme() : "unknown";
        String number = (handle != null) ? handle.getSchemeSpecificPart() : "desconhecido";

        Log.d("CallBlockerService", "Chamando de: " + number + ", via: " + scheme);

        boolean isVoip = "sip".equalsIgnoreCase(scheme) || "voip".equalsIgnoreCase(scheme);

        CallResponse.Builder responseBuilder = new CallResponse.Builder();
        if (isVoip) {
            if (VoipCallBlocker.INSTANCE.shouldBlockVoipCall(number, scheme)) {
                Log.d("CallBlockerService", "Bloqueando chamada VoIP SUSPEITA: " + number);
                responseBuilder.setDisallowCall(true);
                responseBuilder.setRejectCall(true);
                responseBuilder.setSkipCallLog(true);
                responseBuilder.setSkipNotification(true);
            } else {
                Log.d("CallBlockerService", "Chamada VoIP permitida: " + number);
                responseBuilder.setDisallowCall(false);
            }
        }
        respondToCall(callDetails, responseBuilder.build());
    }
}
