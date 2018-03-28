package com.eezer.eezer.service;

import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.util.Log;

import com.eezer.eezer.application.domain.valueobject.Coordinate;
import com.eezer.eezer.application.domain.valueobject.Transport;
import com.eezer.eezer.service.provider.EezerContract.Coordinates;
import com.eezer.eezer.service.provider.EezerContract.Transports;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

/**
 * Application service that manages transports in (hopefully) a nifty way.
 */
public class RouteServiceImpl implements RouteService {

    private static RouteServiceImpl instance;
    private final Context mContext;

    public RouteServiceImpl(Context context) {
        this.mContext = context;
    }

    /**
     * {@inheritDoc}
     */
    public static synchronized RouteServiceImpl getInstance(Context context) {

        if (instance == null) {
            instance = new RouteServiceImpl(context);
        }

        return instance;
    }

    /**
     * {@inheritDoc}
     */
    public long createTransport(Transport newTransport) {

        try {

            newTransport.setStartedTime(new Date());

            ContentValues contentValues = new ContentValues();

            contentValues.put(Transports.TRANSPORT_ID, newTransport.getTransportId());
            contentValues.put(Transports.DRIVER_ID, newTransport.getDriverId());
            contentValues.put(Transports.VEHICLE_ID, newTransport.getVehicleId());
            contentValues.put(Transports.PASSENGER_NAME, newTransport.getPassengerName());
            contentValues.put(Transports.PASSENGER_PHONE, newTransport.getPassengerPhone());
            contentValues.put(Transports.GENDER, newTransport.getGender());
            contentValues.put(Transports.REASON, newTransport.getReason());
            contentValues.put(Transports.DISTANCE, newTransport.getDistance().toString());
            contentValues.put(Transports.STARTED, newTransport.getStartedTimeAsDate().getTime());
            contentValues.put(Transports.ENDED, 0L);
            contentValues.put(Transports.DURATION, newTransport.getDuration());

            Uri result = mContext.getContentResolver().insert(Transports.CONTENT_URI, contentValues);

            return ContentUris.parseId(result);

        } catch (Exception e) {

            Log.e("RouteServiceImpl", e.toString());
            return -1;
        }

    }

    /**
     * {@inheritDoc}
     */
    public List<String> getTransportIds() {

        List<String> idList = new ArrayList<>();

        try {

            Cursor result = mContext.getContentResolver().query(Transports.CONTENT_URI, new String[] {
                    Transports.ID, Transports.DRIVER_ID, Transports.VEHICLE_ID },
                    null, null, null);

            if (result != null) {
                result.moveToFirst();

                while(!result.isAfterLast()){

                    String text = String.format(Locale.getDefault(), "%s: %s, %s",
                            String.valueOf(result.getLong(result.getColumnIndex(Transports.ID))),
                            result.getString(result.getColumnIndex(Transports.DRIVER_ID)),
                            result.getString(result.getColumnIndex(Transports.VEHICLE_ID)));

                    idList.add(text);
                    result.moveToNext();
                }

                result.close();
            }

            return idList;

        } catch (Exception e) {

            Log.e("RouteServiceImpl", e.toString());
            return idList;
        }
    }

    /**
     * {@inheritDoc}
     */
    public Transport getTransportById(long id) {

        try {

            Uri queryUri = ContentUris.withAppendedId(Transports.CONTENT_URI, id);
            Cursor result = mContext.getContentResolver().query(queryUri, Transports.PROJECTION_ALL,
                    null, null, null);

            if (result != null) {

                result.moveToFirst();

                Transport transport = new Transport();
                transport.setTransportId(result.getString(result.getColumnIndex(Transports.TRANSPORT_ID)));
                transport.setDriverId(result.getString(result.getColumnIndex(Transports.DRIVER_ID)));
                transport.setVehicleId(result.getString(result.getColumnIndex(Transports.VEHICLE_ID)));
                transport.setPassengerName(result.getString(result.getColumnIndex(Transports.PASSENGER_NAME)));
                transport.setPassengerPhone(result.getString(result.getColumnIndex(Transports.PASSENGER_PHONE)));
                transport.setGender(result.getString(result.getColumnIndex(Transports.GENDER)));
                transport.setReason(result.getString(result.getColumnIndex(Transports.REASON)));
                transport.setDistance(Float.parseFloat(result.getString(result.getColumnIndex(Transports.DISTANCE))));
                transport.setStartedTime(new Date(result.getLong(result.getColumnIndex(Transports.STARTED))));
                transport.setEndedTime(new Date(result.getLong(result.getColumnIndex(Transports.ENDED))));
                transport.setDuration(result.getLong(result.getColumnIndex(Transports.DURATION)));

                result.close();

                return transport;
            }

            return null;

        } catch (Exception e) {

            Log.e("RouteServiceImpl", e.toString());
            return null;
        }
    }

    /**
     * {@inheritDoc}
     */
    public Transport getCompleteTransportById(long id) {

        try {

            Transport transport = this.getTransportById(id);
            transport.setCoordinates(this.getCoordinates(id));

            return transport;
        } catch (Exception e) {

            Log.e("RouteServiceImpl", e.toString());
            return null;
        }
    }

    /**
     * {@inheritDoc}
     */
    public boolean addCoordinatesToTransport(long id, Coordinate coordinate) {

        try {
            return this.insertCoordinate(id, coordinate) > 0;
        } catch (Exception e) {

            Log.e("RouteServiceImpl", e.toString());
            return false;
        }
    }

    /**
     * {@inheritDoc}
     */
    public boolean updateDistance(long id, float newDistance) {

        try {

            this.updateTransport(id, newDistance, null, null, null,
                    null, null, null, null);
        } catch (Exception e) {

            Log.e("RouteServiceImpl", e.toString());
            return false;
        }


        return true;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean stopTransport(long id) {

        Transport transport = this.getTransportById(id);

        if (transport != null) {

            Date endedDate = new Date();
            Long duration = endedDate.getTime() - transport.getStartedTimeAsDate().getTime();
            try {

                this.updateTransport(id, null, TimeUnit.MILLISECONDS.toSeconds(duration), null,
                        null, null, null, null, null);
            } catch (Exception e) {

                return false;
            }

            return true;
        }

        return false;
    }

    /**
     * {@inheritDoc}
     */
    public boolean finalizeAndStoreTransport(long id, String vehicleId, String passengerName,
                                             String passengerPhone, String gender, String reason) {

        Transport transport = this.getTransportById(id);

        if (transport != null) {

            try {

                Date endedDate = new Date();
                this.updateTransport(id, null, null, endedDate,
                        vehicleId, passengerName, passengerPhone, gender, reason);
            } catch (Exception e) {

                return false;
            }

            return true;
        }

        return false;
    }

    /**
     * {@inheritDoc}
     */
    public Long getUnfinishedTransport() {

        try {

            Cursor result = mContext.getContentResolver().query(Transports.CONTENT_URI,
                    new String[] { Transports.ID, Transports.ENDED }, null, null, null);

            if (result != null) {
                result.moveToFirst();

                while(!result.isAfterLast()){

                    Long id = result.getLong(result.getColumnIndex(Transports.ID));
                    Long ended = result.getLong(result.getColumnIndex(Transports.ENDED));

                    if (ended == 0L) {
                        return id;
                    }

                    result.moveToNext();
                }

                result.close();
            }

            return null;

        } catch (Exception e) {

            Log.e("RouteServiceImpl", e.toString());
            return null;
        }
    }

    private long insertCoordinate(long transportId, Coordinate coordinate) {

        ContentValues contentValues = new ContentValues();
        contentValues.put(Coordinates.TRANSPORT_ID, transportId);
        contentValues.put(Coordinates.LNG, coordinate.getLng().toString());
        contentValues.put(Coordinates.LAT, coordinate.getLat().toString());

        Uri result = mContext.getContentResolver().insert(Coordinates.CONTENT_URI, contentValues);

        return ContentUris.parseId(result);
    }

    private void updateTransport (long id, Float distance, Long duration, Date endedTime,
                                  String vehicleId, String passengerName, String passengerPhone,
                                  String gender, String reason) {

        ContentValues contentValues = new ContentValues();

        if (distance != null) {
            contentValues.put(Transports.DISTANCE, distance.toString());
        }
        if (duration != null) {
            contentValues.put(Transports.DURATION, duration);
        }
        if (endedTime != null) {
            contentValues.put(Transports.ENDED, endedTime.getTime());
        }
        if (vehicleId != null) {
            contentValues.put(Transports.VEHICLE_ID, vehicleId);
        }
        if (passengerName != null) {
            contentValues.put(Transports.PASSENGER_NAME, passengerName);
        }
        if (passengerPhone != null) {
            contentValues.put(Transports.PASSENGER_PHONE, passengerPhone);
        }
        if (gender != null) {
            contentValues.put(Transports.GENDER, gender);
        }
        if (reason != null) {
            contentValues.put(Transports.REASON, reason);
        }

        Uri updateUri = ContentUris.withAppendedId(Transports.CONTENT_URI, id);
        mContext.getContentResolver().update(updateUri, contentValues, "id = ?", new String[] { String.valueOf(id) });
    }

    private List<Coordinate> getCoordinates(long id) {

        List<Coordinate> coordinates = new ArrayList<>();

        Uri queryUri = ContentUris.withAppendedId(Coordinates.CONTENT_URI, id);
        Cursor result = mContext.getContentResolver().query(queryUri, new String[] { Coordinates.LNG, Coordinates.LAT },
                null, null, null);

        if (result != null) {
            result.moveToFirst();

            while(!result.isAfterLast()){
                String lng = result.getString(result.getColumnIndex(Coordinates.LNG));
                String lat = result.getString(result.getColumnIndex(Coordinates.LAT));

                coordinates.add(new Coordinate(Double.valueOf(lng), Double.valueOf(lat)));
                result.moveToNext();
            }

            result.close();
        }

        return coordinates;
    }
}
