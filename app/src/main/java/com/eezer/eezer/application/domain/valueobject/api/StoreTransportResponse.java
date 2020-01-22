package com.eezer.eezer.application.domain.valueobject.api;

/**
 * Entity object to represent a successful store transport server response.
 */
public class StoreTransportResponse {

    public boolean success;

    public Data data;

    public class Data {

        public String transportId;
        public Float distance;
        public Long duration;
    }

}
