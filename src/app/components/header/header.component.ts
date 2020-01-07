import { Component, OnInit, Input } from '@angular/core';

/**
 * The header of the application.
 * This is a dummy component.
 *
 * @export
 * @class HeaderComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    @Input() user: any;
    loggedIn: boolean;

    constructor() {
        this.loggedIn = false;
    }

    ngOnInit() {}
}
