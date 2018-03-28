package com.eezer.eezer.service.authenticator;

import com.eezer.eezer.service.authenticator.EezerServerAuthenticateImpl;
import com.eezer.eezer.service.authenticator.ServerAuthenticate;

/**
 * General settings for Eezer authenticator account.
 */

public class AccountGeneral {

    /**
     * Account type id
     */
    public static final String ACCOUNT_TYPE = "se.eezer.app";

    /**
     * Account name
     */
    public static final String ACCOUNT_NAME = "Eezer";

    /**
     * Auth token types
     */
    public static final String AUTHTOKEN_TYPE_FULL_ACCESS = "Full access";
    public static final String AUTHTOKEN_TYPE_FULL_ACCESS_LABEL = "Full access to an Eezer account";

    public static final ServerAuthenticate sServerAuthenticate = new EezerServerAuthenticateImpl();
}
