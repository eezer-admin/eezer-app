package com.eezer.eezer;

import android.app.ListActivity;
import android.content.Context;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import com.eezer.eezer.service.RouteServiceImpl;

import java.util.ArrayList;
import java.util.List;

/**
 * The sync activity handles syncing of transports.
 */
public class Sync extends ListActivity {

    ListView listView;
    List<String> transports = new ArrayList<>();
    ArrayAdapter<String> adapter;

    RouteServiceImpl service;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sync);

        listView = getListView();
        listView.setChoiceMode(ListView.CHOICE_MODE_SINGLE);
        listView.setTextFilterEnabled(true);
        service = RouteServiceImpl.getInstance(getApplicationContext());

        transports = service.getTransportIds();

        adapter = new ArrayAdapter<>(this,android.R.layout.simple_list_item_1, transports);
        adapter.setNotifyOnChange(true);
        setListAdapter(adapter);

        if (transports.size() == 0) {
            makeToast(getResources().getString(R.string.nothing_to_sync));
        }
    }

    private void makeToast(String message) {

        final Context context = this.getApplicationContext();
        final CharSequence text = message;
        final int duration = Toast.LENGTH_SHORT;

        Sync.this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast toast = Toast.makeText(context, text, duration);
                toast.show();
            }
        });
    }

}
