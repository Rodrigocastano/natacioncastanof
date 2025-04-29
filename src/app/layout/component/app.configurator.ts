import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { updateSurfacePalette } from '@primeng/themes';
import { PrimeNG } from 'primeng/config';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LayoutService } from '../service/layout.service';

type SurfacesType = {
    name?: string;
    palette?: Record<number, string>;
};

@Component({
    selector: 'app-configurator',
    standalone: true,
    imports: [CommonModule, FormsModule, SelectButtonModule],
    template: `
    <div class="flex flex-col gap-4">
        <div>
            <span class="text-sm text-muted-color font-semibold">Primary</span>
            <div class="pt-2 flex gap-2 flex-wrap justify-start">
                <button
                    type="button"
                    title="emerald"
                    (click)="updateColors($event, 'primary', primaryColor)"
                    [ngClass]="{ 'outline-primary': selectedPrimaryColor() === 'emerald' }"
                    class="border-none w-5 h-5 rounded-full p-0 cursor-pointer outline-none outline-offset-1"
                    style="background-color: var(--primary-color)"
                ></button>
            </div>
        </div>

        <div>
            <span class="text-sm text-muted-color font-semibold">Surface</span>
            <div class="pt-2 flex gap-2 flex-wrap justify-start">
                <button
                    type="button"
                    title="soho"
                    (click)="updateColors($event, 'surface', surface)"
                    [ngClass]="{ 'outline-primary': selectedSurfaceColor() === 'soho' }"
                    class="border-none w-5 h-5 rounded-full p-0 cursor-pointer outline-none outline-offset-1"
                    [style]="{
                        'background-color': surface.palette?.['500']
                    }"
                ></button>
            </div>
        </div>

        <div *ngIf="showMenuModeButton()" class="flex flex-col gap-2">
            <span class="text-sm text-muted-color font-semibold">Menu Mode</span>
            <p-selectbutton [ngModel]="menuMode()" (ngModelChange)="onMenuModeChange($event)" [options]="menuModeOptions" [allowEmpty]="false" size="small" />
        </div>
    </div>
    `,
    host: {
        class: 'hidden absolute top-[3.25rem] right-0 w-72 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]'
    }
})
export class AppConfigurator {
    router = inject(Router);
    config = inject(PrimeNG);
    layoutService = inject(LayoutService);
    platformId = inject(PLATFORM_ID);

    showMenuModeButton = signal(!this.router.url.includes('auth'));
    menuModeOptions = [{ label: 'Static', value: 'static' }];

    surface: SurfacesType = {
        name: 'soho',
        palette: {
            0: '#ffffff', 50: '#ececec', 100: '#dedfdf', 200: '#c4c4c6',
            300: '#adaeb0', 400: '#97979b', 500: '#7f8084', 600: '#6a6b70',
            700: '#55565b', 800: '#3f4046', 900: '#2c2c34', 950: '#16161d'
        }
    };

    primaryColor: SurfacesType = {
        name: 'emerald',
    };

    selectedPrimaryColor = computed(() => this.layoutService.layoutConfig().primary);
    selectedSurfaceColor = computed(() => this.layoutService.layoutConfig().surface);
    menuMode = computed(() => this.layoutService.layoutConfig().menuMode);

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.layoutService.layoutConfig.update(state => ({
                ...state,
                surface: 'soho',
                primary: 'emerald'
            }));

            updateSurfacePalette(this.surface.palette);
        }
    }

    updateColors(event: Event, type: 'primary' | 'surface', color: SurfacesType) {
        const update = this.layoutService.layoutConfig.update;

        if (type === 'surface') {
            update(state => ({ ...state, surface: color.name }));
            updateSurfacePalette(color.palette);
        } else {
            update(state => ({ ...state, primary: color.name }));
        }

        event.stopPropagation();
    }

    onMenuModeChange(event: string) {
        this.layoutService.layoutConfig.update(state => ({ ...state, menuMode: event }));
    }
}
