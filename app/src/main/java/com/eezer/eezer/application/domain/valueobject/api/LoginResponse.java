package com.eezer.eezer.application.domain.valueobject.api;

/**
 * Entity class to represent a successful login response from the API.
 */

public class LoginResponse {

    public boolean success;

    public Data data;

    public class Data {

        public String token;
        public String username;
    }

}
