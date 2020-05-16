import { listPageComponent } from "./pages/list-page.component";
import { createPageComponent } from "./pages/create-page.component";
import { notFoundPageComponent } from "./pages/404-page";
import { todoPageComponent } from "./pages/todo-page.component";

export const appRoutes = [
  { path: '', component: notFoundPageComponent },
  { path: '', component: todoPageComponent },
  { path: '/', component: createPageComponent },
  { path: 'list', component: listPageComponent }
];
