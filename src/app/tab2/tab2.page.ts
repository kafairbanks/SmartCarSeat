import { Component, OnInit } from '@angular/core';
import { Status } from '../status';
import { StatusService } from '../status.service';
import { Geofence } from '@ionic-native/geofence/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

    statuses: Status[];
    isDanger = false;

    constructor(private statusService: StatusService, private geofence: Geofence) {
    }

    ngOnInit() {
        this.geofence.initialize().then(
            // resolved promise does not return a value
            () => console.log('Geofence Plugin Ready'),
            (err) => console.log(err)
        );

        this.getStatuses();
        this.run();
    }

    getStatuses(): void {
        this.statusService.getStatuses()
            .subscribe(s => {
                const json = s.statuses;
                this.statuses = json;
                this.checkDanger();
            });
    }

    run(): void {
        setInterval(() => {
            this.getStatuses(); // Now the "this" still references the component
        }, 3000);
    }

    toggleStatus(s: Status): void {
        this.checkDanger();
    }

    checkDanger(): void {
        this.isDanger = false;
        for (let i = 0; i < this.statuses.length; i++) {
            if (this.statuses[i].label === 'BABY_PRESENT' && this.statuses[i].status === true) {
                for (let j = 0; j < this.statuses.length; j++) {
                    if (this.statuses[j].label !== 'BABY_PRESENT' && this.statuses[j].status === false) {
                        this.isDanger = true;
                        break;
                    }
                }
                break;
            }
        }
    }

    private addGeofence() {
        // options describing geofence
        const fence = {
            id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb', // any unique ID
            latitude: 37.285951, // center of geofence radius
            longitude: -121.936650,
            radius: 10, // radius to edge of geofence in meters
            transitionType: 2, // see 'Transition Types' below
            notification: { // notification settings
                id: 1, // any unique ID
                title: 'You crossed a fence', // notification title
                text: 'You just arrived to Gliwice city center.', // notification body
                openAppOnClick: true // open app when notification is tapped
            }
        }

        this.geofence.addOrUpdate(fence).then(
            () => console.log('Geofence added'),
            (err) => console.log('Geofence failed to add')
        );
    }
}
