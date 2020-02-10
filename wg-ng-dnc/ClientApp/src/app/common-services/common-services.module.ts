import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import {
  LoadingComponent,
  NoContentComponent,
  WelcomeComponent
} from "./components";
import { AuthGuardService } from "./services";

@NgModule({
  declarations: [LoadingComponent, NoContentComponent, WelcomeComponent],
  providers: [AuthGuardService],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  exports: [LoadingComponent, NoContentComponent, WelcomeComponent]
})
export class CommonServicesModule {}
