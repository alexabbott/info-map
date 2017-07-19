import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MaterialModule, MdDatepickerModule, MdNativeDateModule } from '@angular/material';
import { Ng2MapModule} from 'ng2-map';
import 'hammerjs';

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

// const firebaseAuthConfig = {
//   provider: AuthProviders.Google,
//   method: AuthMethods.Redirect
// };

const appRoutes: Routes = [
  { path: '', component: SidebarComponent }
];

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
    AngularFireModule.initializeApp(environment.firebase, 'bynd-map'),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    MdDatepickerModule,
    MdNativeDateModule,
    Ng2MapModule.forRoot(environment.googleMaps),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  entryComponents: [DeleteDialogComponent],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
