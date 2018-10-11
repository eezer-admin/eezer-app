package com.eezer.eezer;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.eezer.eezer.service.RouteService;
import com.eezer.eezer.service.RouteServiceImpl;

import java.util.Locale;

import static com.eezer.eezer.service.TransportService.ACCURACY_UPDATE_KEY;
import static com.eezer.eezer.service.TransportService.ACTION_EXTERNAL;
import static com.eezer.eezer.service.TransportService.ACTION_KEY;
import static com.eezer.eezer.service.TransportService.ACTION_STOP_TRANSPORT;
import static com.eezer.eezer.service.TransportService.DISTANCE_UPDATE_KEY;
import static com.eezer.eezer.service.TransportService.TRANSPORT_KEY;
import static com.eezer.eezer.service.TransportService.TRANSPORT_KEY_NO_GO;
import static com.eezer.eezer.service.TransportService.TRANSPORT_SERVICE_FILTER;

/**
 * Stop activity. Should definitely be renamed later...
 */
public class Stop extends AppCompatActivity {

    private TextView txtTotDist;
    private TextView txtAccuracy;
    private Button btnStop;

    private BroadcastReceiver broadcastReceiver;

    Float currentDistance = 0f;

    @Override
    protected void onResume() {
        super.onResume();

        if (broadcastReceiver == null) {
            broadcastReceiver = new BroadcastReceiver() {

                @Override
                public void onReceive(Context context, Intent intent) {

                    int action = (int) intent.getExtras().get(ACTION_KEY);

                    if (action == ACTION_EXTERNAL) {
                        currentDistance = (Float) intent.getExtras().get(DISTANCE_UPDATE_KEY);
                        String accuracy = (String) intent.getExtras().get(ACCURACY_UPDATE_KEY);

                        txtAccuracy.setText(accuracy);
                        updateDistance(currentDistance);
                    }
                }
            };
        }
        registerReceiver(broadcastReceiver, new IntentFilter(TRANSPORT_SERVICE_FILTER));
    }

    private void updateDistance(Float currentDistance) {

            txtTotDist.setText(String.format(Locale.getDefault(), "%.2f km", currentDistance / 1000));
    }


    @Override
    public void onBackPressed() {
        new AlertDialog.Builder(this)
                .setIcon(android.R.drawable.ic_dialog_alert)
                .setTitle(getResources().getString(R.string.cancel_transport))
                .setMessage(getResources().getString(R.string.confirm_cancel_transport))
                .setPositiveButton(getResources().getString(R.string.yes), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        btnStopOnClick(null);
                    }
                })
                .setNegativeButton(getResources().getString(R.string.no), null)
                .show();
    }

    @Override
    protected void onDestroy() {
        if (broadcastReceiver != null) {
            unregisterReceiver(broadcastReceiver);
        }

        super.onDestroy();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_stop);

        txtTotDist = (TextView) findViewById(R.id.txtTotDist);
        txtAccuracy = (TextView) findViewById(R.id.txtAccuracy);
        btnStop = (Button) findViewById(R.id.btnStop);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(false);
        }

        String accuracy = getIntent().getStringExtra("accuracy_key");
        txtAccuracy.setText(accuracy);
    }

    public void btnStopOnClick(View v) {

        btnStop.setEnabled(false);

        // Send message to transport service to stop the current transport
        Intent stopTransportIntent = new Intent(TRANSPORT_SERVICE_FILTER);
        stopTransportIntent.putExtra(ACTION_KEY, ACTION_STOP_TRANSPORT);
        sendBroadcast(stopTransportIntent);

        Long transportId = getIntent().getLongExtra(TRANSPORT_KEY, TRANSPORT_KEY_NO_GO);

        // Write ended time and duration.
        RouteService service = RouteServiceImpl.getInstance(getApplicationContext());
        service.stopTransport(transportId);

        // Navigate to summary.
        Intent i = new Intent(getApplicationContext(), Summary.class);
        i.putExtra(TRANSPORT_KEY, transportId);
        startActivity(i);
        finish();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        outState.putFloat("currentDistance", currentDistance);

        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onPause() {

        super.onPause();
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);

        if (savedInstanceState != null) {
            this.currentDistance = savedInstanceState.getFloat("currentDistance");
        } else {
            this.currentDistance = 0f;
        }

        updateDistance(currentDistance);
    }

    private void makeToast(String message) {

        final Context context = this.getApplicationContext();
        final CharSequence text = message;
        final int duration = Toast.LENGTH_SHORT;

        Stop.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast toast = Toast.makeText(context, text, duration);
                toast.show();
            }
        });
    }
}