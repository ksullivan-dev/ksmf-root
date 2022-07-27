import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";

const routes = constructRoutes(microfrontendLayout);
const prodApps = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});

const applications = prodApps.map((app) => {
  const overrideUrl = localStorage.getItem(`import-map-override:${app.name}`);
  if (overrideUrl && app.name.includes("vite")) {
    return {
      ...app,
      app: () =>
        import(
          /* webpackIgnore: true */
          overrideUrl
        ),
    };
  }

  return app;
});

const layoutEngine = constructLayoutEngine({
  routes,
  applications,
});

applications.forEach(registerApplication);
layoutEngine.activate();

start({
  urlRerouteOnly: true,
});
