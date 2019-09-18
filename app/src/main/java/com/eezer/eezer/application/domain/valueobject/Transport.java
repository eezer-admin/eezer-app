package com.eezer.eezer.application.domain.valueobject;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Entity class representing a transport.
 */
public class Transport implements Serializable {

    private String transportId;
    private String driverId;
    private String vehicleId;
    private String passengerName;
    private String passengerPhone;
    private String gender;
    private String reason;
    private List<Coordinate> coordinates;
    private Float distance;
    private Date startedTime;
    private Date endedTime;
    private Long duration;
    private String deviceInfo;

    public Transport() {
        coordinates = new ArrayList<>();
        distance = 0f;
    }

    public String getTransportId() {
        return transportId;
    }

    public void setTransportId(String transportId) {
        this.transportId = transportId;
    }

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public String getPassengerPhone() {
        return passengerPhone;
    }

    public void setPassengerPhone(String passengerPhone) {
        this.passengerPhone = passengerPhone;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Float getDistance() {
        return distance;
    }

    public void setDistance(Float distance) {
        this.distance = distance;
    }

    public List<Coordinate> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<Coordinate> coordinates) {
        this.coordinates = coordinates;
    }

    public Long getDuration() {
        return this.duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public String getStartedTime() {
        return startedTime.toString();
    }

    public Date getStartedTimeAsDate() {
        return this.startedTime;
    }

    public Date getEndedTimeAsDate() {
        return this.endedTime;
    }

    public void setStartedTime(Date startedTime) {
        this.startedTime = startedTime;
    }

    public String getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public String getEndedTime() {

        if (endedTime != null) {
            return endedTime.toString();
        } else {
            return null;
        }
    }

    public void setEndedTime(Date endedTime) {
        this.endedTime = endedTime;
    }
}
