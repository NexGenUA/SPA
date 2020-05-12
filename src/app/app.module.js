import { MainModule } from "../lib";
import { appComponent } from "./app.component";
import { appHeader } from "./common/app.header";
import { appRoutes } from "./app.routes";

class AppModule extends MainModule {
  constructor(config) {
    super(config);
  }
}

export const appModule = new AppModule({
  components: [
    appHeader
  ],
  main: appComponent,
  routes: appRoutes
});
