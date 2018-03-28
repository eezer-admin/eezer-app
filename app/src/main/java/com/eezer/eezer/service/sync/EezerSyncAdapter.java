package com.eezer.eezer.service.sync;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.content.AbstractThreadedSyncAdapter;
import android.content.ContentProviderClient;
import android.content.ContentUris;
import android.content.Context;
import android.content.SyncResult;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.RemoteException;
import android.util.Log;

import com.eezer.eezer.application.domain.service.HttpHelper;
import com.eezer.eezer.application.domain.valueobject.Coordinate;
import com.eezer.eezer.application.domain.valueobject.Transport;
import com.eezer.eezer.application.domain.valueobject.api.ErrorResponse;
import com.eezer.eezer.application.domain.valueobject.api.StoreTransportResponse;
import com.eezer.eezer.application.exception.UnauthorizedException;
import com.eezer.eezer.application.util.JsonUtil;
import com.eezer.eezer.service.authenticator.AccountGeneral;
import com.eezer.eezer.service.provider.EezerContract;
import com.eezer.eezer.service.provider.EezerContract.Transports;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import okhttp3.Response;

/**
 * Sync adapter for Eezer, keeps daya synchronized with the server.
 */

public class EezerSyncAdapter extends AbstractThreadedSyncAdapter {

    private final AccountManager mAccountManager;

    private static final String UNIQUE_INDEX_ERROR = "UniqueIndexError";
    private static final String UNAUTHORIZED_ERROR = "Unauthorized";

    public EezerSyncAdapter(Context context, boolean autoInitialize) {
        super(context, autoInitialize);
        mAccountManager = AccountManager.get(context);
    }

    @Override
    public void onPerformSync(Account account, Bundle extras, String authority, ContentProviderClient provider, SyncResult syncResult) {

        String authToken = null;

        Log.d("EezerSyncAdapter", "Syncing for account [" + account.name + "]");
        try {
            // Get the auth token for the current account
            authToken = mAccountManager.blockingGetAuthToken(account, AccountGeneral.AUTHTOKEN_TYPE_FULL_ACCESS, true);

            Cursor result = provider.query(Transports.CONTENT_URI, new String[]{Transports.ID},
                    null, null, null);

            List<Long> transportIdList = new ArrayList<>();

            if (result != null) {
                result.moveToFirst();

                while (!result.isAfterLast()) {
                    long id = result.getLong(result.getColumnIndex(Transports.ID));
                    transportIdList.add(id);
                    result.moveToNext();
                }

                result.close();
            }

            for (Long id : transportIdList) {

                Log.d("EezerSyncAdapter", "Syncing for " + id);

                Transport transport = getTransportById(provider, id);

                if (transport.getEndedTime() == null) {

                    // not completed, skipping.
                    Log.d("EezerSyncAdapter", "Skipping transport with id " + id);
                } else {

                    String payload = JsonUtil.objectToJson(transport);
                    syncTransport(payload, authToken);
                    removeTransportById(provider, id);
                }
            }

            Log.d("EezerSyncAdapter", "Sync completed.");
        } catch (UnauthorizedException e) {

            Log.d("EezerSyncAdapter", "Invalidating ended token.");
            if (authToken != null) {
                mAccountManager.invalidateAuthToken(account.type, authToken);
            }
        } catch (Exception e) {

            Log.d("EezerSyncAdapter", "Sync failed.");
            e.printStackTrace();
        }

    }

    private Transport getTransportById(ContentProviderClient provider, long id) throws RemoteException {

        Uri queryUri = ContentUris.withAppendedId(Transports.CONTENT_URI, id);
        Cursor result = provider.query(queryUri, Transports.PROJECTION_ALL,
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

            Long endedTime = result.getLong(result.getColumnIndex(Transports.ENDED));

            if (endedTime != 0) {
                transport.setEndedTime(new Date(endedTime));
            }

            transport.setDuration(result.getLong(result.getColumnIndex(Transports.DURATION)));

            result.close();

            // also fetch coordinates to upload
            transport.setCoordinates(getCoordinates(provider, id));

            return transport;
        }

        throw new RuntimeException("Could not get transport by id");
    }

    private void removeTransportById(ContentProviderClient provider, long id) throws RemoteException {

        Uri transportDeleteUri = ContentUris.withAppendedId(Transports.CONTENT_URI, id);
        Uri coordDeleteUri = ContentUris.withAppendedId(EezerContract.Coordinates.CONTENT_URI, id);
        int transportResult = provider.delete(transportDeleteUri, null, null);
        int coordDeleteResult = provider.delete(coordDeleteUri, null, null);

        if (coordDeleteResult > 0) {
            Log.d("RouteServiceImpl", "Removed " + coordDeleteResult + " coords.");
        }

        Log.d("RouteServiceImpl", "Removed " + transportResult + " transport.");

        if (transportResult != 1) {

            throw new RuntimeException("Could not remove local transport.");
        }
    }

    private void syncTransport(String contents, String authToken) throws IOException {

        Response response = HttpHelper.storeTransport(contents, authToken);

        try {

            if (response.code() == 200) {
                String responseData = response.body().string();
                StoreTransportResponse storeTransportResponse = JsonUtil.parseServerResponse(responseData);

                if (storeTransportResponse != null && storeTransportResponse.success) {
                    Log.d("EezerSyncAdapter", "Successful upload with id " + storeTransportResponse.data.transportId);
                    return;
                }

                throw new RuntimeException("Could not upload transport.");
            } else {

                final ErrorResponse errorResponse = JsonUtil.parseErrorResponse(response.body().string());

                if (errorResponse != null && errorResponse.message != null) {

                    switch (errorResponse.message) {
                        case UNIQUE_INDEX_ERROR:
                            Log.d("EezerSyncAdapter", "Was already uploaded, treat as success.");
                            break;
                        case UNAUTHORIZED_ERROR:
                            throw new UnauthorizedException("User not authenticated. Token expired.");
                        default:
                            throw new RuntimeException("Could not upload transport.");
                    }
                }

            }

        } catch (Exception e) {

            e.printStackTrace();

            if (e instanceof UnauthorizedException) {
                throw e;
            }

            throw new RuntimeException("Could not upload transport.");
        } finally {

            if (response.body() != null) {
                response.body().close();
            }
        }

    }

    private List<Coordinate> getCoordinates(ContentProviderClient provider, long id) throws RemoteException {

        List<Coordinate> coordinates = new ArrayList<>();

        Uri queryUri = ContentUris.withAppendedId(EezerContract.Coordinates.CONTENT_URI, id);
        Cursor result = provider.query(queryUri, new String[] { EezerContract.Coordinates.LNG, EezerContract.Coordinates.LAT },
                null, null, null);

        if (result != null) {
            result.moveToFirst();

            while(!result.isAfterLast()){
                String lng = result.getString(result.getColumnIndex(EezerContract.Coordinates.LNG));
                String lat = result.getString(result.getColumnIndex(EezerContract.Coordinates.LAT));

                coordinates.add(new Coordinate(Double.valueOf(lng), Double.valueOf(lat)));
                result.moveToNext();
            }

            result.close();
        }

        return coordinates;
    }

}
