import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { MaterialModule } from '@angular/material';
import 'hammerjs';
import { Ng2MapModule} from 'ng2-map';

//services
import { GlobalService } from './services/global.service';

//pipes
import { SearchPipe } from './pipes/search.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { FilterUserLikesPipe } from './pipes/filter-user-likes.pipe';
import { FirstPipe } from './pipes/first.pipe';
import { GetPipe } from './pipes/get.pipe';
import { OrderBy } from './pipes/order-by.pipe';
import { SlugifyPipe } from './pipes/slugify.pipe';
import { LastNamePipePipe } from './pipes/last-name-pipe.pipe';

//components
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MapComponent } from './map/map.component';
import { FormComponent } from './form/form.component';
import { PostCardComponent } from './post-card/post-card.component';
import { SplashComponent } from './splash/splash.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

// Must export the config
export const firebaseConfig = {
    apiKey: "AIzaSyCjV1QF1t8-EHtNJRSj0TuVEXBVHNg8LAA",
    authDomain: "bynd-map.firebaseapp.com",
    databaseURL: "https://bynd-map.firebaseio.com",
    projectId: "bynd-map",
    storageBucket: "bynd-map.appspot.com",
    messagingSenderId: "637854657898"
  };

const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
};

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    GetPipe,
    FirstPipe,
    FilterPipe,
    FilterUserLikesPipe,
    OrderBy,
    SafePipe,
    MapComponent,
    FormComponent,
    SearchPipe,
    PostCardComponent,
    SplashComponent,
    SlugifyPipe,
    LastNamePipePipe,
    DeleteDialogComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    Ng2MapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyD9e_lkQIiKtphl0vGK3MjbC589jQcRtvk&libraries=places'})
  ],
  entryComponents: [DeleteDialogComponent],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
