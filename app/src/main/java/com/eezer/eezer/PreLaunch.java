package com.eezer.eezer;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.eezer.eezer.application.config.Config;
import com.eezer.eezer.application.domain.valueobject.Transport;
import com.eezer.eezer.service.GPSService;
import com.eezer.eezer.service.RouteServiceImpl;
import com.eezer.eezer.service.TransportService;

import java.util.Locale;
import java.util.UUID;

import static com.eezer.eezer.service.GPSService.LOCATION_COORDINATE_ACCURACY;
import static com.eezer.eezer.service.GPSService.LOCATION_UPDATE_FILTER;
import static com.eezer.eezer.service.TransportService.ACTION_KEY;
import static com.eezer.eezer.service.TransportService.ACTION_START_TRANSPORT;
import static com.eezer.eezer.service.TransportService.TRANSPORT_KEY;
import static com.eezer.eezer.service.TransportService.TRANSPORT_SERVICE_FILTER;

/**
 * PreLaunch activity. This activity is called before
 * a transport has been started.
 */
public class PreLaunch extends AppCompatActivity {

    private BroadcastReceiver gpsBroadcastReceiver;
    private static final int REQ_CODE_ACCESS_FINE_LOCATION = 100;
    private static final String USERNAME_KEY = "username";

    private Button btnStart;
    private TextView txtSignalGPS;

    private String accuracy;
    private String driverId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_prelaunch);

        btnStart = (Button) findViewById(R.id.btnStart);
        accuracy = getResources().getString(R.string.accuracy_not_available);
        txtSignalGPS = (TextView) findViewById(R.id.txtSignalGPS);

        driverId = this.getDriverId();

        if (!runtimePermissions()) {
            btnStart.setEnabled(true);

            registerBroadcastReveiver();

            Intent gpsService = new Intent(getApplicationContext(), GPSService.class);
            startService(gpsService);

            Intent transportService = new Intent(getApplicationContext(), TransportService.class);
            startService(transportService);
        }

        Toolbar myToolbar = (Toolbar) findViewById(R.id.my_toolbar);
        setSupportActionBar(myToolbar);
        getSupportActionBar().setTitle(String.format(Locale.getDefault(), "%s",
                getResources().getString(R.string.new_transport)));


        // Check if we have unfinished transports, try to resume them if so..
        RouteServiceImpl service = RouteServiceImpl.getInstance(getApplicationContext());
        Long unfinishedTransportId = service.getUnfinishedTransport();

        if (unfinishedTransportId != null) {

            Log.d("PreLaunch", "Found unfinished transport, resuming id " + unfinishedTransportId);

            // Navigate to the Stop activity.
            Intent intent = new Intent(this, Stop.class);
            intent.putExtra(TRANSPORT_KEY, unfinishedTransportId);
            intent.putExtra("accuracy_key", accuracy);
            startActivity(intent);
        }

    }

    private void registerBroadcastReveiver() {

        if (gpsBroadcastReceiver == null) {
            gpsBroadcastReceiver = new BroadcastReceiver() {

                @Override
                public void onReceive(Context context, Intent intent) {
                    accuracy = (String) intent.getExtras().get(LOCATION_COORDINATE_ACCURACY);
                    txtSignalGPS.setText(String.format(Locale.getDefault(), "%s: %s",
                            getResources().getString(R.string.gps_signal), accuracy));
                }
            };
        }

        registerReceiver(gpsBroadcastReceiver, new IntentFilter(LOCATION_UPDATE_FILTER));
    }

    @Override
    protected void onDestroy() {
        Intent gpsService = new Intent(getApplicationContext(), GPSService.class);
        stopService(gpsService);

        Intent transportService = new Intent(getApplicationContext(), TransportService.class);
        stopService(transportService);

        super.onDestroy();
    }

    @Override
    protected void onResume() {
        super.onResume();
        registerBroadcastReveiver();
    }

    @Override
    protected void onPause() {
        if (gpsBroadcastReceiver != null) {
            unregisterReceiver(gpsBroadcastReceiver);
        }

        super.onPause();
    }

    private Transport createNewTransport() {

        driverId = this.getDriverId();

        Transport transport = new Transport();

        // Generate a globally unique id for this transport
        transport.setTransportId(UUID.randomUUID().toString());
        transport.setDriverId(driverId);
        transport.setDeviceInfo(android.os.Build.DEVICE + ":"
                + android.os.Build.MODEL + ":" + android.os.Build.VERSION.SDK);

        // We populate all the other values after the transport has been finished.

        return transport;
    }

    private String getDriverId() {

        SharedPreferences sharedPrefs = this.getSharedPreferences(
                Config.SHARED_PREF_NAME, Context.MODE_PRIVATE);

        return sharedPrefs.getString(USERNAME_KEY, "<no driver>");
    }

    public void btnStartOnClick(View v) {

        RouteServiceImpl service = RouteServiceImpl.getInstance(getApplicationContext());
        Long transportId = service.createTransport(createNewTransport());

        // Send message to transport service to start the current transport.
        Intent startTransportIntent = new Intent(TRANSPORT_SERVICE_FILTER);
        startTransportIntent.putExtra(ACTION_KEY, ACTION_START_TRANSPORT);
        startTransportIntent.putExtra(TRANSPORT_KEY, transportId);
        sendBroadcast(startTransportIntent);

        // Navigate to the Stop activity.
        Intent intent = new Intent(this, Stop.class);
        intent.putExtra(TRANSPORT_KEY, transportId);
        intent.putExtra("accuracy_key", accuracy);
        startActivity(intent);
    }

    private boolean runtimePermissions() {

        if (Build.VERSION.SDK_INT >= 23 && ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{ Manifest.permission.ACCESS_FINE_LOCATION }, REQ_CODE_ACCESS_FINE_LOCATION);

            return true;
        }

        return false;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == REQ_CODE_ACCESS_FINE_LOCATION && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            btnStart.setEnabled(true);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        Intent i;

        switch (item.getItemId()) {
            case R.id.action_settings:
                i = new Intent(this, SettingsActivity.class);
                startActivity(i);
                return true;

            case R.id.action_sync:
                i = new Intent(this, Sync.class);
                startActivity(i);
                return true;

            default:
                // If we got here, the user's action was not recognized.
                // Invoke the superclass to handle it.
                return super.onOptionsItemSelected(item);

        }
    }
}
