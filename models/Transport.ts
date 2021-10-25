import { format, parse } from 'date-fns'
import { TransportDriver, TransportInterface, UnmappedTransportInterface } from '../interfaces'

export class Transport implements TransportInterface {
    public id: String;
    public isUploaded: Boolean;
    public departsAt: Date;
    public distanceKm: Number;
    public secondsElapsed: Number;
    public cause: String;
    public driver: TransportDriver;

    constructor (data: UnmappedTransportInterface) {
      this.id = this.uuid()
      this.isUploaded = false
      this.departsAt = parse(data.date, 'yyyy-mm-dd', new Date())
      this.distanceKm = data.distance
      this.secondsElapsed = data.time
      this.cause = data.cause
      this.driver = {
        name: data.driverName
      }
    }

    getReadableDate (): String {
      return format(this.departsAt, 'yyyy.mm.dd')
    }

    uuid (): String {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0; const v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }
}
