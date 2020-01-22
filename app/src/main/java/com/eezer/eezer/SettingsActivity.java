package com.eezer.eezer;

import android.os.Bundle;
import android.preference.Preference;
import android.preference.PreferenceActivity;
import android.util.Log;

import com.eezer.eezer.service.provider.EezerContract.Coordinates;
import com.eezer.eezer.service.provider.EezerContract.Transports;

/**
 * Settings activity
 */

public class SettingsActivity extends PreferenceActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        addPreferencesFromResource(R.xml.preferences);

        Preference cleardb = getPreferenceManager().findPreference("cleardb");

        if (cleardb != null) {
            cleardb.setOnPreferenceClickListener(new Preference.OnPreferenceClickListener() {
                @Override
                public boolean onPreferenceClick(Preference arg0) {

                    long transportRows = getApplicationContext().getContentResolver().delete(Transports.CONTENT_URI, null, null);
                    long coordRows = getApplicationContext().getContentResolver().delete(Coordinates.CONTENT_URI, null, null);

                    Log.i("Settings", String.format("Removed %d rows from transports and %d rows from coordinates.",
                            transportRows, coordRows));

                    finish();
                    return true;
                }
            });
        }

    }


}