package com.eezer.eezer.application.domain.valueobject;

/**
 * Entity class representing a coordinate for a {@link Transport}.
 */
public class Coordinate {

    private Double lng;
    private Double lat;

    public Coordinate(Double lng, Double lat) {
        this.lng = lng;
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }
}
