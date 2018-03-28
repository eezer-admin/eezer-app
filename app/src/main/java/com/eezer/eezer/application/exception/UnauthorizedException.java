package com.eezer.eezer.application.exception;

/**
 * Unauthorized Exception
 */

public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

}
