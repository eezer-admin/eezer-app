package com.eezer.eezer.service.provider;

import android.content.ContentResolver;
import android.net.Uri;

import static com.eezer.eezer.service.provider.DbSchema.ID_COLUMN_NAME;
import static com.eezer.eezer.service.provider.DbSchema.TC_LAT_COLUMN_NAME;
import static com.eezer.eezer.service.provider.DbSchema.TC_LNG_COLUMN_NAME;
import static com.eezer.eezer.service.provider.DbSchema.TC_TRANSPORT_ID_COLUMN_NAME;
import static com.eezer.eezer.service.provider.DbSchema.T_DISTANCE_COLUMN_NAME;
import static com.eezer.eezer.service.provider.DbSchema.T_DRIVER_ID_COLUMN_NAME;
import static com.eezer.eezer.service.provider.DbSchema.T_DURATION_COLUMN_NAME;
import static com.eezer.eezer.service.provider.DbSchema.T_ENDED_COLUMN_NAME;
import static com.eezer.eezer.service.provider.DbSchema.T_GENDER_COLUMN_NAME;
import static com.eezer.eezer.service.provider.DbSchema.T_PASSENGER_NAME_COLUMN_NAME;
import static com.eezer.eezer.service.provider.DbSchema.T_PASSENGER_PHONE_COLUMN_NAME;
import static com.eezer.eezer.service.provider.DbSchema.T_REASON_COLUMN_NAME;
import static com.eezer.eezer.service.provider.DbSchema.T_STARTED_COLUMN_NAME;
import static com.eezer.eezer.service.provider.DbSchema.T_TRANSPORT_ID_COLUMN_NAME;
import static com.eezer.eezer.service.provider.DbSchema.T_VEHICLE_ID_COLUMN_NAME;

/**
 * Eezer App contract, sort of the "public api".
 */

public final class EezerContract {

    /**
     * The authority of the eezer provider.
     */
    public static final String AUTHORITY =
            "se.eezer.transports";
    /**
     * The content URI for the top-level
     * eezer authority.
     */
    public static final Uri CONTENT_URI =
            Uri.parse("content://" + AUTHORITY);

    /**
     * Constants for the Transport table
     * of the eezer provider.
     */
    public static final class Transports {

        /**
         * The content URI for this table.
         */
        public static final Uri CONTENT_URI =
                Uri.withAppendedPath(
                        EezerContract.CONTENT_URI,
                        "transports");
        /**
         * The mime type of a directory of transports.
         */
        public static final String CONTENT_TYPE =
                ContentResolver.CURSOR_DIR_BASE_TYPE +
                        "/vnd.se.eezer.transports_transports";
        /**
         * The mime type of a single transport.
         */
        public static final String CONTENT_TRANSPORT_TYPE =
                ContentResolver.CURSOR_ITEM_BASE_TYPE +
                        "/vnd.se.eezer.transports_transports";
        /**
         * A projection of all columns
         * in the transport table.
         */
        public static final String[] PROJECTION_ALL =
                { ID_COLUMN_NAME, T_TRANSPORT_ID_COLUMN_NAME, T_DRIVER_ID_COLUMN_NAME, T_VEHICLE_ID_COLUMN_NAME,
                        T_PASSENGER_NAME_COLUMN_NAME, T_PASSENGER_PHONE_COLUMN_NAME, T_GENDER_COLUMN_NAME,
                        T_REASON_COLUMN_NAME, T_DISTANCE_COLUMN_NAME, T_STARTED_COLUMN_NAME,
                        T_ENDED_COLUMN_NAME, T_DURATION_COLUMN_NAME };

        public static final String ID = ID_COLUMN_NAME;
        public static final String TRANSPORT_ID = T_TRANSPORT_ID_COLUMN_NAME;
        public static final String DRIVER_ID = T_DRIVER_ID_COLUMN_NAME;
        public static final String VEHICLE_ID = T_VEHICLE_ID_COLUMN_NAME;
        public static final String PASSENGER_NAME = T_PASSENGER_NAME_COLUMN_NAME;
        public static final String PASSENGER_PHONE = T_PASSENGER_PHONE_COLUMN_NAME;
        public static final String GENDER = T_GENDER_COLUMN_NAME;
        public static final String REASON = T_REASON_COLUMN_NAME;
        public static final String DISTANCE = T_DISTANCE_COLUMN_NAME;
        public static final String STARTED = T_STARTED_COLUMN_NAME;
        public static final String ENDED = T_ENDED_COLUMN_NAME;
        public static final String DURATION = T_DURATION_COLUMN_NAME;

    }

    public static final class Coordinates {


        /**
         * The content URI for this table.
         */
        public static final Uri CONTENT_URI =
                Uri.withAppendedPath(
                        EezerContract.CONTENT_URI,
                        "coordinates");
        /**
         * The mime type of a directory of transports.
         */
        public static final String CONTENT_TYPE =
                ContentResolver.CURSOR_DIR_BASE_TYPE +
                        "/vnd.se.eezer.coordinates_coordinates";
        /**
         * The mime type of a single transport.
         */
        public static final String CONTENT_COORD_TYPE =
                ContentResolver.CURSOR_ITEM_BASE_TYPE +
                        "/vnd.se.eezer.coordinates_coordinates";
        /**
         * A projection of all columns
         * in the transport table.
         */
        public static final String[] PROJECTION_ALL =
                { ID_COLUMN_NAME, TC_TRANSPORT_ID_COLUMN_NAME, TC_LNG_COLUMN_NAME, TC_LAT_COLUMN_NAME };

        public static final String TRANSPORT_ID = TC_TRANSPORT_ID_COLUMN_NAME;

        public static final String ID = ID_COLUMN_NAME;
        public static final String LNG = TC_LNG_COLUMN_NAME;
        public static final String LAT = TC_LAT_COLUMN_NAME;

    }

}
