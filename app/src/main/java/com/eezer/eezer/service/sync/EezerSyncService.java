package com.eezer.eezer.service.sync;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

/**
 * Sync service to communicate with the {@link EezerSyncAdapter}.
 */
public class EezerSyncService extends Service {

    private static final Object sSyncAdapterLock = new Object();
    private static EezerSyncAdapter sSyncAdapter = null;

    @Override
    public void onCreate() {
        synchronized (sSyncAdapterLock) {
            if (sSyncAdapter == null)
                sSyncAdapter = new EezerSyncAdapter(getApplicationContext(), true);
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return sSyncAdapter.getSyncAdapterBinder();
    }
}