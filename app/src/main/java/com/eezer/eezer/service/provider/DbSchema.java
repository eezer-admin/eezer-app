package com.eezer.eezer.service.provider;

import com.eezer.eezer.application.config.Config;

import java.util.Locale;

/**
 * Helper class that defines constants and schemas for the db.
 */

interface DbSchema {

    String DB_NAME = Config.DATABASE_NAME;

    // transport table details

    String TRANSPORTS_TABLE_NAME = "transports";

    String T_TRANSPORT_ID_COLUMN_NAME = "transportid";
    String T_DRIVER_ID_COLUMN_NAME = "driverid";
    String T_VEHICLE_ID_COLUMN_NAME = "vehicleid";
    String T_PASSENGER_NAME_COLUMN_NAME = "passengername";
    String T_PASSENGER_PHONE_COLUMN_NAME = "passengerphone";
    String T_GENDER_COLUMN_NAME = "gender";
    String T_REASON_COLUMN_NAME = "reason";
    String T_DISTANCE_COLUMN_NAME = "distance";
    String T_STARTED_COLUMN_NAME = "started_time";
    String T_ENDED_COLUMN_NAME = "ended_time";
    String T_DURATION_COLUMN_NAME = "duration";

    // transport coords table details

    String TRANSPORT_COORDS_TABLE_NAME = "transport_coords";

    String TC_TRANSPORT_ID_COLUMN_NAME = "transportid";
    String TC_LNG_COLUMN_NAME = "lng";
    String TC_LAT_COLUMN_NAME = "lat";
    // TODO: should maybe add timestamp as well

    String ID_COLUMN_NAME = "id";

    String DDL_CREATE_TABLE_TRANSPORTS = String.format(Locale.getDefault(),
            "CREATE TABLE %s (id integer primary key, %s text not null unique, %s text, " +
                    "%s text, %s text, %s text, %s text, %s text, " +
                    "%s text, %s integer, %s integer, %s integer)",
            TRANSPORTS_TABLE_NAME, T_TRANSPORT_ID_COLUMN_NAME, T_DRIVER_ID_COLUMN_NAME,
            T_VEHICLE_ID_COLUMN_NAME, T_PASSENGER_NAME_COLUMN_NAME, T_PASSENGER_PHONE_COLUMN_NAME,
            T_GENDER_COLUMN_NAME, T_REASON_COLUMN_NAME, T_DISTANCE_COLUMN_NAME,
            T_STARTED_COLUMN_NAME, T_ENDED_COLUMN_NAME, T_DURATION_COLUMN_NAME);

    String DDL_CREATE_TABLE_COORDS = String.format(Locale.getDefault(),
            "CREATE TABLE %s (id integer primary key, %s integer, %s text, %s text)",
            TRANSPORT_COORDS_TABLE_NAME, TC_TRANSPORT_ID_COLUMN_NAME,
            TC_LNG_COLUMN_NAME, TC_LAT_COLUMN_NAME);

    String DDL_DROP_TABLE_TRANSPORTS = "DROP TABLE IF EXISTS " + TRANSPORTS_TABLE_NAME;

    String DDL_DROP_TABLE_COORDS = "DROP TABLE IF EXISTS " + TRANSPORT_COORDS_TABLE_NAME;
}
