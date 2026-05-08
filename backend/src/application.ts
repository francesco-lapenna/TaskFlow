import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer';
import { ServiceMixin } from '@loopback/service-proxy';

export { ApplicationConfig };

export class TaskFlowApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Open API explorer at /explorer
    this.configure(RestExplorerBindings.COMPONENT).to({ path: '/explorer' });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Auto-discover controllers, repositories, datasources, etc.
    this.bootOptions = {
      controllers: { dirs: ['controllers'], extensions: ['.controller.js'], nested: true },
      repositories: { dirs: ['repositories'], extensions: ['.repository.js'], nested: true },
      datasources: { dirs: ['datasources'], extensions: ['.datasource.js'], nested: true },
      observers: { dirs: ['observers'], extensions: ['.observer.js'], nested: true },
    };
  }
}
