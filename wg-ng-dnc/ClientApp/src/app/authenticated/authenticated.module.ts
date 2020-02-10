import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthenticatedRoutingModule } from "./authenticated-routing.module";
import { LayoutComponent } from "./layout";
import { AuthenticatedRoutesModule } from "./authenticated-routes";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    AuthenticatedRoutingModule,
    AuthenticatedRoutesModule,
    MatToolbarModule,
    MatCardModule,
    MatTabsModule,
    MatTooltipModule
  ],
  exports: [AuthenticatedRoutingModule],
  entryComponents: [LayoutComponent]
})
export class AuthenticatedModule {}
