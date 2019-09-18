package com.eezer.eezer.service.provider;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/**
 * SQLiteOpenHelper implementation of the Eezer DB.
 */

public class TransportsDbHelper extends SQLiteOpenHelper {

    private static final String NAME = DbSchema.DB_NAME;
    private static final int VERSION = 9;

    public TransportsDbHelper(Context context) {
        super(context, NAME, null, VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(DbSchema.DDL_CREATE_TABLE_TRANSPORTS);
        db.execSQL(DbSchema.DDL_CREATE_TABLE_COORDS);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

        // TODO: should take care of migrating the db

        if (oldVersion != newVersion) {

            db.execSQL(DbSchema.DDL_DROP_TABLE_TRANSPORTS);
            db.execSQL(DbSchema.DDL_DROP_TABLE_COORDS);

            this.onCreate(db);
        }
    }

}
