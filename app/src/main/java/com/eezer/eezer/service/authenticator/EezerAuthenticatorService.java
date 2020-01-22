package com.eezer.eezer.service.authenticator;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

/**
 * Eezer authenticator service
 */
public class EezerAuthenticatorService extends Service {

    @Override
    public IBinder onBind(Intent intent) {

        EezerAuthenticator authenticator = new EezerAuthenticator(this);
        return authenticator.getIBinder();
    }
}
