package com.eezer.eezer.application.util;

import android.app.Activity;
import android.app.AlertDialog;

import com.eezer.eezer.application.config.Config;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;

/**
 * Util class with helpful methods.
 */

public class Utils {

    public static String getTextRepresentationOfAccuracy(Float accuracy) {

        String result;

        if (accuracy < 16) {
            result = "Excellent.";
        } else if (accuracy < 25) {
            result = "Good.";
        } else if (accuracy < 50) {
            result = "Okay.";
        } else {
            result = "Poor.";
        }

        return result;
    }

    public static String getNiceTimeFromSeconds(long seconds) {
        SimpleDateFormat formatter = new SimpleDateFormat("HH:mm:ss", Locale.getDefault());
        formatter.setTimeZone(TimeZone.getTimeZone("GMT"));
        return formatter.format(new Date(seconds * 1000));
    }

}
