package com.eezer.eezer.service;

import android.annotation.SuppressLint;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.IBinder;
import android.provider.Settings;
import android.support.annotation.Nullable;

import com.eezer.eezer.R;
import com.eezer.eezer.application.util.Utils.GPSAccuracy;

import static com.eezer.eezer.application.util.Utils.getTextRepresentationOfAccuracy;

/**
 * GPS location service.
 */

public class GPSService extends Service {

    private LocationListener listener;
    private LocationManager manager;

    public static final String LOCATION_UPDATE_FILTER = "location_update";
    public static final String LOCATION_COORDINATE_LONG_KEY = "coord_long";
    public static final String LOCATION_COORDINATE_LAT_KEY = "coord_lat";
    public static final String LOCATION_COORDINATE_ACCURACY = "coord_accuracy";

    /* Tweak this value to change how often to check for new location.
       This value may have a huge impact on battery consumption.
     */
    private static final int UPDATE_INTERVAL_IN_MS = 5 * 1000;

    /* The minimum distance (in meters) before accepting it as a location change */
    private static final int MIN_DISTANCE = 4;

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }


    @Override
    @SuppressLint("MissingPermission")
    public void onCreate() {

        listener = new LocationListener() {

            @Override
            public void onLocationChanged(Location location) {

                Intent i = new Intent(LOCATION_UPDATE_FILTER);
                i.putExtra(LOCATION_COORDINATE_LONG_KEY, location.getLongitude());
                i.putExtra(LOCATION_COORDINATE_LAT_KEY, location.getLatitude());
                i.putExtra(LOCATION_COORDINATE_ACCURACY,
                        translateGPSAccuracy(getTextRepresentationOfAccuracy(
                                location.getAccuracy())));

                sendBroadcast(i);
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) { }

            @Override
            public void onProviderEnabled(String provider) { }

            @Override
            public void onProviderDisabled(String provider) {

                Intent i = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(i);
            }

        };

        manager = (LocationManager) getApplicationContext().getSystemService(Context.LOCATION_SERVICE);

        if (manager != null) {
            manager.requestLocationUpdates(LocationManager.GPS_PROVIDER,
                    UPDATE_INTERVAL_IN_MS, MIN_DISTANCE, listener);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        if (manager != null) {
            manager.removeUpdates(listener);
        }
    }

    private String translateGPSAccuracy(GPSAccuracy gpsAccuracy) {

        switch (gpsAccuracy) {
            case POOR:
            case OKAY:
                return getResources().getString(R.string.gps_poor);
            case GOOD:
                return getResources().getString(R.string.gps_good);
            case EXCELLENT:
                return getResources().getString(R.string.gps_excellent);
        }

        return getResources().getString(R.string.accuracy_not_available);
    }
}
