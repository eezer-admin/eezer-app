package com.eezer.eezer.service;

import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.Location;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.util.Log;

import com.eezer.eezer.application.domain.valueobject.Coordinate;
import com.eezer.eezer.application.domain.valueobject.Transport;

import static com.eezer.eezer.service.GPSService.LOCATION_COORDINATE_ACCURACY;
import static com.eezer.eezer.service.GPSService.LOCATION_COORDINATE_LAT_KEY;
import static com.eezer.eezer.service.GPSService.LOCATION_COORDINATE_LONG_KEY;
import static com.eezer.eezer.service.GPSService.LOCATION_UPDATE_FILTER;

/**
 * Service handling transports.
 */
public class TransportService extends Service {

    private BroadcastReceiver broadcastReceiver;
    private BroadcastReceiver gpsBroadcastReveiver;

    public static final String TRANSPORT_SERVICE_FILTER = "transport_service";
    public static final String DISTANCE_UPDATE_KEY = "distance_update";
    public static final String ACCURACY_UPDATE_KEY = "accuracy_update";

    // The key identifying a transport around different activities.
    public static final String TRANSPORT_KEY = "transport_key";

    // If the key is this value, then something is wrong.
    public static final long TRANSPORT_KEY_NO_GO = -1;

    public static final String ACTION_KEY = "action";

    public static final int ACTION_EXTERNAL = 0;
    public static final int ACTION_START_TRANSPORT = 1;
    public static final int ACTION_STOP_TRANSPORT = 2;
    public static final int ACTION_RESUME_TRANSPORT = 3;

    private Location lastLocation;
    private Float totDistance;

    private boolean isRunning = false;
    private Long transportId;

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        final RouteService service = RouteServiceImpl.getInstance(getApplicationContext());

        if (broadcastReceiver == null) {
            broadcastReceiver = new BroadcastReceiver() {

                @Override
                public void onReceive(Context context, Intent intent) {

                int action = (int) intent.getExtras().get(ACTION_KEY);
                Log.d("TransportService", "Got action with key " + action);

                switch (action) {
                    case ACTION_START_TRANSPORT:

                        Log.d("TransportService", "Got start transport signal.");

                        isRunning = true;
                        totDistance = 0f;
                        lastLocation = null;
                        transportId = (Long) intent.getExtras().get(TRANSPORT_KEY);

                        break;
                    case ACTION_STOP_TRANSPORT:

                        Log.d("TransportService", "Got stop transport signal.");

                        isRunning = false;
                        transportId = null;

                        break;
                    default:
                        Log.w("TransportService", "Got unknown command. Do nothing.");
                }
                }
            };
        }

        if (gpsBroadcastReveiver == null) {
            gpsBroadcastReveiver = new BroadcastReceiver() {

                @Override
                public void onReceive(Context context, Intent intent) {

                    if (isRunning && transportId != null) {

                        Log.d("TransportService", "Got GPS update.");

                        Double coordLat = (Double) intent.getExtras().get(LOCATION_COORDINATE_LAT_KEY);
                        Double coordLong = (Double) intent.getExtras().get(LOCATION_COORDINATE_LONG_KEY);
                        String accuracy = (String) intent.getExtras().get(LOCATION_COORDINATE_ACCURACY);

                        if (coordLat != null && coordLong != null) {

                            Location newLocation = new Location("");
                            newLocation.setLongitude(coordLong);
                            newLocation.setLatitude(coordLat);

                            if (lastLocation != null) {

                                float distanceInMeters = lastLocation.distanceTo(newLocation);
                                totDistance += distanceInMeters;
                                service.updateDistance(transportId, totDistance);

                                Coordinate coord = new Coordinate(coordLong, coordLat);
                                service.addCoordinatesToTransport(transportId, coord);

                                // Send metrics update to Stop activity.
                                Intent i = new Intent(TRANSPORT_SERVICE_FILTER);
                                i.putExtra(DISTANCE_UPDATE_KEY, service.getTransportById(transportId).getDistance());
                                i.putExtra(ACCURACY_UPDATE_KEY, accuracy);
                                i.putExtra(ACTION_KEY, ACTION_EXTERNAL);
                                sendBroadcast(i);
                            } else {
                                Coordinate coord = new Coordinate(coordLong, coordLat);
                                service.addCoordinatesToTransport(transportId, coord);
                            }

                            lastLocation = newLocation;
                        }
                    }
                }
            };
        }

        registerReceiver(broadcastReceiver, new IntentFilter(TRANSPORT_SERVICE_FILTER));
        registerReceiver(gpsBroadcastReveiver, new IntentFilter(LOCATION_UPDATE_FILTER));



        // CHeck if we need to resume transport //

        transportId = service.getUnfinishedTransport();

        if (transportId != null) {

            Transport transport = service.getCompleteTransportById(transportId);
            totDistance = transport.getDistance();

            if (transport.getCoordinates().size() > 0) {

                lastLocation = new Location("");
                lastLocation.setLongitude(transport.getCoordinates().get(
                        transport.getCoordinates().size() -1).getLng());
                lastLocation.setLatitude(transport.getCoordinates().get(
                        transport.getCoordinates().size() -1).getLat());
            }

            Log.d("TransportService", "Found unfinished transport. Resuming id " + transportId);

            isRunning = true;
        }

    }

    @Override
    public void onDestroy() {
        if (broadcastReceiver != null) {
            unregisterReceiver(broadcastReceiver);
        }

        if (gpsBroadcastReveiver != null) {
            unregisterReceiver(gpsBroadcastReveiver);
        }

        super.onDestroy();
    }

}
