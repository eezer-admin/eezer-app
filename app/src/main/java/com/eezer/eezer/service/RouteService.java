package com.eezer.eezer.service;

import android.content.Context;

import com.eezer.eezer.application.domain.valueobject.Coordinate;
import com.eezer.eezer.application.domain.valueobject.Transport;

import java.util.List;

/**
 * This is the interface of the Route service.
 */
public interface RouteService {

    /**
     * Create a new transport.
     *
     * @param newTransport the transport object to store
     * @return 1 if successful, -1 or 0 i failed
     */
    long createTransport(Transport newTransport);

    /**
     * Get all stored transport ids.
     *
     * @return a list of transport id:s
     */
    List<String> getTransportIds();

    /**
     * Get a transport by it's id.
     * NOTE: Does not include coordinated.
     *
     * @param id the transport id
     * @return the transport object if found, or else {@code null}
     */
    Transport getTransportById(long id);

    /**
     * Get a finalized transport by it's id.
     * NOTE: DOES include coordinates.
     *
     * @param id the transport id
     * @return the transport object if found, or else {@code null}
     */
    Transport getCompleteTransportById(long id);

    /**
     * Insert a new coordinate to the selected transport.
     *
     * @param id the transport id to update
     * @param coordinate the coordinate object
     * @return how many rows affected
     */
    boolean addCoordinatesToTransport(long id, Coordinate coordinate);

    /**
     * Update the current distance of the specified transport.
     *
     * @param id the transport id
     * @param newDistance the new distance
     * @return true if successful, else false
     */
    boolean updateDistance(long id, float newDistance);

    /**
     * Stops the current transport and logs the ending time and duration.
     *
     * @param id the transport id
     * @return true if successful, else false
     */
    boolean stopTransport(long id);

    /**
     * Finialize and store the current transport.
     *
     * @param id the transport id
     * @param vehicleId vehicle id
     * @param passengerName passenger name
     * @param passengerPhone passenger phone
     * @param gender gender of passenger
     * @param reason the reason for transport
     *
     * @return true if successful, or else false
     */
    boolean finalizeAndStoreTransport(long id, String vehicleId, String passengerName,
                                      String passengerPhone, String gender, String reason);

    /**
     * Fetch the id of a unfinished transport (if any).
     * If none is found, {@code null} is returned.
     *
     * @return the id of the unfinished transport (if found)
     */
    Long getUnfinishedTransport();
}
