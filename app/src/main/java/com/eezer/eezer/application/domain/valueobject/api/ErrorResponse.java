package com.eezer.eezer.application.domain.valueobject.api;

/**
 * Entity object to represent a not successful response from the API.
 */

public class ErrorResponse {

    public static final String ERROR_INVALID_USER_OR_PASS = "InvalidUserOrPass";

    public boolean success;
    public String message;
    public String[] message_extra;

}
