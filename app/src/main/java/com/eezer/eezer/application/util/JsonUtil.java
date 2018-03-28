package com.eezer.eezer.application.util;

import android.util.Log;

import com.eezer.eezer.application.domain.valueobject.api.StoreTransportResponse;
import com.eezer.eezer.application.domain.valueobject.api.ErrorResponse;
import com.eezer.eezer.application.domain.valueobject.api.LoginResponse;
import com.google.gson.Gson;

/**
 * Util class to handle JSON serialization and deserialization.
 */
public class JsonUtil {

    private static Gson gSon = new Gson();

    public static String objectToJson(Object object) {

        return gSon.toJson(object);
    }

    public static LoginResponse parseLoginResponse(String loginResponse) {
        try {

            return gSon.fromJson(loginResponse, LoginResponse.class);
        } catch (Exception e) {

            Log.i("JsonUtil", "Failed to parse response data: " + e);
            return null;
        }
    }

    public static ErrorResponse parseErrorResponse(String errorResponse) {
        try {

            return gSon.fromJson(errorResponse, ErrorResponse.class);
        } catch (Exception e) {

            Log.i("JsonUtil", "Failed to parse response data: " + e);
            return null;
        }
    }

    public static StoreTransportResponse parseServerResponse(String serverResponseData) {

        try {

            return gSon.fromJson(serverResponseData, StoreTransportResponse.class);
        } catch (Exception e) {

            Log.i("JsonUtil", "Failed to parse response data: " + e);
            return null;
        }

    }
}
