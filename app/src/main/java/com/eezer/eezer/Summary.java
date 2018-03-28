package com.eezer.eezer;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.eezer.eezer.application.domain.valueobject.Transport;
import com.eezer.eezer.application.util.Utils;
import com.eezer.eezer.service.RouteServiceImpl;

import java.util.Locale;

import static com.eezer.eezer.service.TransportService.TRANSPORT_KEY;
import static com.eezer.eezer.service.TransportService.TRANSPORT_KEY_NO_GO;

/**
 * This is the summary activity for a transport.
 */
public class Summary extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_summary);

        Toolbar myToolbar = (Toolbar) findViewById(R.id.my_toolbar);
        setSupportActionBar(myToolbar);
        getSupportActionBar().setTitle(getResources().getString(R.string.summary_of_transport));

        RouteServiceImpl service = RouteServiceImpl.getInstance(getApplicationContext());
        Long transportId = getIntent().getLongExtra(TRANSPORT_KEY, TRANSPORT_KEY_NO_GO);

        if (transportId != TRANSPORT_KEY_NO_GO) {
            Transport transport = service.getTransportById(transportId);

            TextView txtDistance = (TextView) findViewById(R.id.txtInfoDistance);
            TextView txtDuration = (TextView) findViewById(R.id.txtInfoDuration);
            TextView txtCost = (TextView) findViewById(R.id.txtInfoCost);

            txtDuration.setText(String.format(Locale.getDefault(),
                    "Duration: %s", Utils.getNiceTimeFromSeconds(transport.getDuration())));
            txtDistance.setText(String.format(Locale.getDefault(), "Distance: %.2f km", transport.getDistance() / 1000));
            txtCost.setText(String.format(Locale.getDefault(), "Cost: %.2f SEK", transport.getDistance() / 100L));
        } else {

            makeToast("Summary: Unable to get transport, contact developer.");
        }
    }


    @Override
    public void onBackPressed() {
        // do nothing
    }

    public void btnNewTransportOnClick(View v) {
        Intent i = new Intent(this, FinalizeTransport.class);
        i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(i);
        finish();
    }

    private void makeToast(String message) {

        final Context context = this.getApplicationContext();
        final CharSequence text = message;
        final int duration = Toast.LENGTH_SHORT;

        Summary.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast toast = Toast.makeText(context, text, duration);
                toast.show();
            }
        });
    }
}
