package com.eezer.eezer.application.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

/**
 * Util class with helpful methods.
 */

public class Utils {

    private static String TIMEZONE_GMT = "GMT";
    private static String DATE_FORMAT = "HH:mm:ss";

    public enum GPSAccuracy {
        POOR, OKAY, GOOD, EXCELLENT
    }

    public static GPSAccuracy getTextRepresentationOfAccuracy(Float accuracy) {

        GPSAccuracy result;

        if (accuracy < 16) {
            result = GPSAccuracy.EXCELLENT;
        } else if (accuracy < 25) {
            result = GPSAccuracy.GOOD;
        } else if (accuracy < 50) {
            result = GPSAccuracy.OKAY;
        } else {
            result = GPSAccuracy.POOR;
        }

        return result;
    }

    public static String getNiceTimeFromSeconds(long seconds) {
        SimpleDateFormat formatter = new SimpleDateFormat(DATE_FORMAT, Locale.getDefault());
        formatter.setTimeZone(TimeZone.getTimeZone(TIMEZONE_GMT));
        return formatter.format(new Date(seconds * 1000));
    }

}
