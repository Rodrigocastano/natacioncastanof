import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbar.component';
import { PricingWidget } from './components/informacion';


@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, TopbarWidget, PricingWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule],
    templateUrl: '/landing.html'
})
export class Landing {}
