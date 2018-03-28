package com.eezer.eezer;

import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;

import com.eezer.eezer.service.RouteService;
import com.eezer.eezer.service.RouteServiceImpl;

import java.util.Locale;

/**
 * FinalizeTransport activity. FinalizeTransport application activity.
 * This is the first view after a successful login.
 */
public class FinalizeTransport extends AppCompatActivity {

    private static final String USERNAME_KEY = "username";

    private Button btnFinalize;

    private EditText vehicleId;
    private EditText passengerName;
    private RadioGroup gender;
    private EditText passengerPhone;
    private Spinner reason;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_finalize);

        btnFinalize = (Button) findViewById(R.id.btnFinalize);

        vehicleId = (EditText) findViewById(R.id.vehicleId);
        passengerName = (EditText) findViewById(R.id.passengerName);
        gender = (RadioGroup) findViewById(R.id.radioGender);
        passengerPhone = (EditText) findViewById(R.id.passengerPhone);
        reason = (Spinner) findViewById(R.id.reason_spinner);

        this.populateSpinner(reason);

        /* Set default checked on radio buttons */
        RadioButton radioMale = (RadioButton) findViewById(R.id.radioMale);
        radioMale.setChecked(true);

        Toolbar myToolbar = (Toolbar) findViewById(R.id.my_toolbar);
        setSupportActionBar(myToolbar);
        getSupportActionBar().setTitle(String.format(Locale.getDefault(), "%s",
                    getResources().getString(R.string.finalize_transport)));
    }

    /**
     * Fetch an unfinished transport.
     *
     * @return the transport if fonud, or {@code null}.
     */
    private Long getUnfinishedTransport() {

        RouteService service = RouteServiceImpl.getInstance(getApplicationContext());
        return service.getUnfinishedTransport();
    }

    private void populateSpinner(Spinner reason) {

        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.reason_items, R.layout.spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        reason.setAdapter(adapter);
    }

    private void finalizeTransport() {

        RouteService service = RouteServiceImpl.getInstance(getApplicationContext());
        Long transportId = this.getUnfinishedTransport();

        String genderValue = ((RadioButton)findViewById(gender.getCheckedRadioButtonId())).getText().toString();

        service.finalizeAndStoreTransport(transportId, vehicleId.getText().toString(),
                passengerName.getText().toString(), passengerPhone.getText().toString(),
                genderValue, reason.getSelectedItem().toString());
    }

    @Override
    public void onBackPressed() {
        new AlertDialog.Builder(this)
                .setIcon(android.R.drawable.ic_dialog_alert)
                .setTitle("Cancel transport?")
                .setMessage("Are you sure you want to cancel transport?")
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        finalizeUnfinishedTransport();
                    }
                })
                .setNegativeButton("No", null)
                .show();
    }

    private void finalizeUnfinishedTransport() {

        RouteService service = RouteServiceImpl.getInstance(getApplicationContext());
        Long transportId = this.getUnfinishedTransport();

        service.finalizeAndStoreTransport(transportId, "not specified",
                "not specified", "not specified",
                "not specified", "Cancelled by user.");

        this.navigateToPreLaunch();
    }

    private void navigateToPreLaunch() {

        Intent i = new Intent(getApplicationContext(), PreLaunch.class);
        i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(i);
        finish();
    }

    public void btnFinalizeOnClick(View v) {

        boolean validationError = false;

        if (vehicleId.getText().toString().isEmpty() || vehicleId.getText().toString().length() < 2) {
            vehicleId.setBackgroundColor(Color.parseColor("#FF0000"));
            validationError = true;
        }

        if (reason.getSelectedItemId() == 0) {
            reason.setBackgroundColor(Color.parseColor("#FF0000"));
            validationError = true;
        }

        if (validationError) {
            return;
        }

        this.finalizeTransport();
        this.navigateToPreLaunch();
    }

}
