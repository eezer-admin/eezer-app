package com.eezer.eezer.application.domain.service;

import com.eezer.eezer.application.config.Config;

import java.io.IOException;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * This helper class provides methods for talking with the Eezer backend API.
 */

public class HttpHelper {

    private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    private static final String HEADER_AUTHORIZATION = "Authorization";
    private static final String TOKEN_BEARER = "Bearer";

    public static Response storeTransport(String data, String authToken) throws IOException {

        OkHttpClient client = new OkHttpClient();

        client = client.newBuilder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(20, TimeUnit.SECONDS)
                .build();

        RequestBody body = RequestBody.create(JSON, data);

        Request request = new Request.Builder()
                .url(Config.EEZER_BACKEND_URL + Config.EEZER_RESOURCE_STORE)
                .header(HEADER_AUTHORIZATION, String.format(Locale.getDefault(), "%s %s",
                        TOKEN_BEARER, authToken))
                .post(body)
                .build();

        return client.newCall(request).execute();
    }

}
