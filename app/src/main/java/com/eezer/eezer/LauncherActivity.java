package com.eezer.eezer;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.accounts.AccountManagerCallback;
import android.accounts.AccountManagerFuture;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;

import com.eezer.eezer.application.config.Config;
import com.eezer.eezer.service.authenticator.AccountGeneral;

/**
 * This is the applications launcher activity.
 * Here we check if the user is logged in or not.
 * If not, redirect user to login activity,
 * else, go directly to pre-launch activity.
 */

public class LauncherActivity extends AppCompatActivity {

    private static final String JWT_TOKEN_KEY = "jwttoken";
    private static final String USERNAME_KEY = "username";
    private AccountManager mAccountManager;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mAccountManager = AccountManager.get(this);

        Account eezerAccount = findAccount();

        if (eezerAccount != null) {
            getAuthToken(eezerAccount);
        } else {
            addAccount();
        }

        this.finish();
    }

    private void getAuthToken(Account account) {

        final AccountManagerFuture<Bundle> future = mAccountManager.getAuthToken(account,
                AccountGeneral.AUTHTOKEN_TYPE_FULL_ACCESS, null, this,
                null, null);

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Bundle bnd = future.getResult();

                    final String authtoken = bnd.getString(AccountManager.KEY_AUTHTOKEN);
                    final String name = bnd.getString(AccountManager.KEY_ACCOUNT_NAME);

                    SharedPreferences sharedPrefs = getSharedPreferences(Config.SHARED_PREF_NAME, MODE_PRIVATE);
                    SharedPreferences.Editor editor = sharedPrefs.edit();
                    editor.putString(JWT_TOKEN_KEY, authtoken);
                    editor.putString(USERNAME_KEY, name);
                    editor.apply();

                    Intent i = new Intent(getApplicationContext(), PreLaunch.class);
                    i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(i);

                } catch (Exception e) {
                    e.printStackTrace();
                    Log.i("LauncherActivity", e.toString());

                }
            }
        }).start();
    }

    private void addAccount() {

        final AccountManagerFuture<Bundle> future = mAccountManager.addAccount(
                AccountGeneral.ACCOUNT_TYPE, AccountGeneral.AUTHTOKEN_TYPE_FULL_ACCESS,
                null, null, this, new AccountManagerCallback<Bundle>() {
            @Override
            public void run(AccountManagerFuture<Bundle> future) {

                try {
                    Bundle bnd = future.getResult();

                    String name = bnd.getString(AccountManager.KEY_ACCOUNT_NAME);
                    String type = bnd.getString(AccountManager.KEY_ACCOUNT_TYPE);
                    Account account = new Account(name, type);

                    getAuthToken(account);

                } catch (Exception e) {
                    e.printStackTrace();
                    Log.i("LauncherActivity", e.toString());
                }
            }
        }, null);
    }

    private Account findAccount() {
        final Account availableAccounts[] = mAccountManager.getAccountsByType(
                AccountGeneral.ACCOUNT_TYPE);

        for (Account account : availableAccounts) {

            if (account.type.equals(AccountGeneral.ACCOUNT_TYPE)) {
                return account;
            }
        }

        return null;
    }
}
