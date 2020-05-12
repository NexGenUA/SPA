import { listPageComponent } from "./pages/list-page.component";
import { createPageComponent } from "./pages/create-page.component";
import { notFoundPageComponent } from "./pages/404-page";
import { taskPageComponent } from "./pages/task-page.component";

export const appRoutes = [
  { path: '', component: notFoundPageComponent },
  { path: '', component: taskPageComponent },
  { path: '/', component: createPageComponent },
  { path: 'list', component: listPageComponent }
];
