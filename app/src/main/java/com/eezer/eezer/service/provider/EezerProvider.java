package com.eezer.eezer.service.provider;

import android.content.ContentProvider;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.UriMatcher;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteQueryBuilder;
import android.net.Uri;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.text.TextUtils;

import com.eezer.eezer.service.provider.EezerContract.Coordinates;
import com.eezer.eezer.service.provider.EezerContract.Transports;

/**
 * Eezer app content provider. Used to acces db resources.
 */

public class EezerProvider extends ContentProvider {

    // helper constants for use with the UriMatcher
    private static final int TRANSPORT_LIST = 1;
    private static final int TRANSPORT_ID = 2;

    private static final int COORDINATE_LIST = 4;
    private static final int COORDINATE_ID = 6;

    private static final UriMatcher URI_MATCHER;

    private TransportsDbHelper mHelper = null;
    private final ThreadLocal<Boolean> mIsInBatchMode = new ThreadLocal<Boolean>();

    // prepare the UriMatcher
    static {
        URI_MATCHER = new UriMatcher(UriMatcher.NO_MATCH);

        URI_MATCHER.addURI(EezerContract.AUTHORITY, "transports", TRANSPORT_LIST);
        URI_MATCHER.addURI(EezerContract.AUTHORITY, "transports/#", TRANSPORT_ID);
        URI_MATCHER.addURI(EezerContract.AUTHORITY, "coordinates", COORDINATE_LIST);
        URI_MATCHER.addURI(EezerContract.AUTHORITY, "coordinates/#", COORDINATE_ID);
    }

    @Override
    public boolean onCreate() {
        mHelper = new TransportsDbHelper(getContext());
        return true;
    }

    @Nullable
    @Override
    public Cursor query(@NonNull Uri uri, @Nullable String[] projection,
                        @Nullable String selection, @Nullable String[] selectionArgs,
                        @Nullable String sortOrder) {

        SQLiteDatabase db = mHelper.getReadableDatabase();
        SQLiteQueryBuilder builder = new SQLiteQueryBuilder();

        switch (URI_MATCHER.match(uri)) {
            case TRANSPORT_LIST:

                builder.setTables(DbSchema.TRANSPORTS_TABLE_NAME);
                break;
            case TRANSPORT_ID:

                builder.setTables(DbSchema.TRANSPORTS_TABLE_NAME);
                // limit query to one row at most:
                builder.appendWhere(Transports.ID + " = "
                        + uri.getLastPathSegment());
                break;
            case COORDINATE_ID:

                builder.setTables(DbSchema.TRANSPORT_COORDS_TABLE_NAME);
                builder.appendWhere(Coordinates.TRANSPORT_ID + " = "
                    + uri.getLastPathSegment());
                break;
            default:
                throw new IllegalArgumentException("Unsupported URI: " + uri);
        }

        return builder.query(db, projection, selection, selectionArgs,
                null, null, sortOrder);
    }

    @Nullable
    @Override
    public String getType(@NonNull Uri uri) {

            switch (URI_MATCHER.match(uri)) {
                case TRANSPORT_LIST:
                    return Transports.CONTENT_TYPE;
                case TRANSPORT_ID:
                    return Transports.CONTENT_TRANSPORT_TYPE;
                case COORDINATE_LIST:
                    return Coordinates.CONTENT_TYPE;
                case COORDINATE_ID:
                    return Coordinates.CONTENT_COORD_TYPE;
                default:
                    return null;
            }
    }

    @Nullable
    @Override
    public Uri insert(@NonNull Uri uri, @Nullable ContentValues values) {

        if (URI_MATCHER.match(uri) != TRANSPORT_LIST &&
                URI_MATCHER.match(uri) != COORDINATE_LIST) {

            throw new IllegalArgumentException(
                    "Unsupported URI for insertion: " + uri);
        }

        SQLiteDatabase db = mHelper.getWritableDatabase();

        if (URI_MATCHER.match(uri) == TRANSPORT_LIST) {

            long id = db.insert(DbSchema.TRANSPORTS_TABLE_NAME, null, values);

            return getUriForId(id, uri);
        } else if (URI_MATCHER.match(uri) == COORDINATE_LIST) {

            long id = db.insert(DbSchema.TRANSPORT_COORDS_TABLE_NAME, null, values);

            return getUriForId(id, uri);
        }

        throw new IllegalArgumentException(
                "Unsupported URI for insertion: " + uri);
    }

    @Override
    public int delete(@NonNull Uri uri, @Nullable String selection, @Nullable String[] selectionArgs) {

        SQLiteDatabase db = mHelper.getWritableDatabase();
        int delCount = 0;
        String idStr, where;

        switch (URI_MATCHER.match(uri)) {
            case TRANSPORT_LIST:
                delCount = db.delete(DbSchema.TRANSPORTS_TABLE_NAME, selection, selectionArgs);
                break;
            case COORDINATE_LIST:
                delCount = db.delete(DbSchema.TRANSPORT_COORDS_TABLE_NAME, selection, selectionArgs);
                break;
            case TRANSPORT_ID:

                idStr = uri.getLastPathSegment();

                where = Transports.ID + " = " + idStr;
                delCount = db.delete(DbSchema.TRANSPORTS_TABLE_NAME, where, selectionArgs);
                break;
            case COORDINATE_ID:

                idStr = uri.getLastPathSegment();

                where = Coordinates.TRANSPORT_ID + " = " + idStr;
                delCount = db.delete(DbSchema.TRANSPORT_COORDS_TABLE_NAME, where, selectionArgs);
                break;
            default:
                throw new IllegalArgumentException("Unsupported URI: " + uri);
        }

        // notify all listeners of changes (TODO: or maybe not..)
        if (delCount > 0 && !isInBatchMode()) {
            getContext().getContentResolver().notifyChange(uri, null);
        }

        return delCount;
    }

    @Override
    public int update(@NonNull Uri uri, @Nullable ContentValues values,
                      @Nullable String selection, @Nullable String[] selectionArgs) {

        SQLiteDatabase db = mHelper.getWritableDatabase();

        int updateCount = 0;

        switch (URI_MATCHER.match(uri)) {
            case TRANSPORT_ID:
                String idStr = uri.getLastPathSegment();
                String where = Transports.ID + " = " + idStr;
                if (!TextUtils.isEmpty(selection)) {
                    where += " AND " + selection;
                }
                updateCount = db.update(DbSchema.TRANSPORTS_TABLE_NAME, values, where,
                        selectionArgs);
                break;
            default:
                // no support for updating photos!
                throw new IllegalArgumentException("Unsupported URI: " + uri);
        }

        // notify all listeners of changes:
        if (updateCount > 0 && !isInBatchMode()) {
            getContext().getContentResolver().notifyChange(uri, null);
        }

        return updateCount;
    }

    private Uri getUriForId(long id, Uri uri) {
        if (id > 0) {
            Uri itemUri = ContentUris.withAppendedId(uri, id);
            if (!isInBatchMode()) {
                // notify all listeners of changes:
                getContext().getContentResolver().
                        notifyChange(itemUri, null);
            }
            return itemUri;
        }
        // s.th. went wrong:
        throw new SQLException(
                "Problem while inserting into uri: " + uri);
    }

    private boolean isInBatchMode() {
        return mIsInBatchMode.get() != null && mIsInBatchMode.get();
    }
}
