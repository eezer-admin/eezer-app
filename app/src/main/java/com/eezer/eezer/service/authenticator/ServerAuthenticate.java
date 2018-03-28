package com.eezer.eezer.service.authenticator;

import android.content.Context;

/**
 * Interface for authenticating a user to Eezer.
 */

public interface ServerAuthenticate {

    String userSignIn(final String user, final String pass, Context context) throws Exception;
}
