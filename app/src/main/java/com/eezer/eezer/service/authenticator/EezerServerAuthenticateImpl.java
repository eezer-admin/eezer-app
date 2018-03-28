package com.eezer.eezer.service.authenticator;

import android.content.Context;
import android.content.SharedPreferences;

import com.eezer.eezer.application.config.Config;
import com.eezer.eezer.application.domain.valueobject.api.LoginRequest;
import com.eezer.eezer.application.domain.valueobject.api.LoginResponse;
import com.eezer.eezer.application.util.JsonUtil;

import java.util.Locale;
import java.util.concurrent.TimeUnit;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Server authenticator implementation for the Eezer API.
 */

public class EezerServerAuthenticateImpl implements ServerAuthenticate {

    private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    private static final String HEADER_AUTHORIZATION = "Authorization";
    private static final String TOKEN_BEARER = "Bearer";
    private static final String JWT_TOKEN_KEY = "jwttoken";

    @Override
    public String userSignIn(String user, String pass, Context context) throws Exception {

        final LoginRequest loginRequest = new LoginRequest();
        loginRequest.username = user;
        loginRequest.password = pass;

        OkHttpClient client = new OkHttpClient();

        client = client.newBuilder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(20, TimeUnit.SECONDS)
                .build();

        String data = JsonUtil.objectToJson(loginRequest);
        RequestBody body = RequestBody.create(JSON, data);

        Request request = new Request.Builder()
                .url(Config.EEZER_BACKEND_URL + Config.EEZER_RESOURCE_LOGIN)
                .header(HEADER_AUTHORIZATION, String.format(Locale.getDefault(), "%s %s",
                        TOKEN_BEARER, getToken(context)))
                .post(body)
                .build();

        Response response = client.newCall(request).execute();

        if (response != null && response.code() == 200) {

            final LoginResponse loginResponse = JsonUtil.parseLoginResponse(response.body().string());

            if (loginResponse != null && loginResponse.success) {

                return loginResponse.data.token;
            }
        }

        throw new RuntimeException("Unable to log in.");
    }

    private static String getToken(Context context) {

        SharedPreferences sharedPrefs = context.getSharedPreferences(
                Config.SHARED_PREF_NAME, Context.MODE_PRIVATE);
        return sharedPrefs.getString(JWT_TOKEN_KEY, "");
    }
}
