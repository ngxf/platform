import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { createHostComponentFactory, HostComponent, HTTPMethod, SpectatorWithHost } from '@netbasal/spectator';
import { HttpDirective } from '../../lib/directives/http.directive';
import { getHttp, HTTPMethods } from '../../testing';

const RESPONSE = 'An Best Response';
const PATH = '/ngxf';
const PARAMS = 'ngxf=The%20Best!';
const PATH_WITH_PARAMS = `${PATH}?${PARAMS}`;
const BODY_STRINGIFY = `{ ngxf: 'The Best!' }`;
const BODY = { ngxf: 'The Best!' };

@Component({ selector: 'host', template: '' })
class Host {
  path: string;
  body: any;
}

const BASIC_REQUEST_METHODS = [
  HTTPMethods.DELETE,
  HTTPMethods.GET,
  HTTPMethods.HEAD,
  HTTPMethods.OPTIONS,
  HTTPMethods.PATCH,
  HTTPMethods.POST,
  HTTPMethods.PUT
];

const REQUEST_METHODS_WITH_BODY = [
  HTTPMethods.PATCH,
  HTTPMethods.POST,
  HTTPMethods.PUT
];

const REQUEST_METHODS_WITH_PARAMS = [
  HTTPMethods.DELETE,
  HTTPMethods.GET,
  HTTPMethods.HEAD,
  HTTPMethods.OPTIONS,
  HTTPMethods.PATCH,
  HTTPMethods.POST,
  HTTPMethods.PUT
];

describe('HttpDirective', () => {
  let host: SpectatorWithHost<Host>;
  const createHost = createHostComponentFactory({
    component: HttpDirective,
    host: Host,
    imports: [ HttpClientModule, HttpClientTestingModule ]
  });

  BASIC_REQUEST_METHODS.forEach((method) => {
    it(`should make ${method} http request`, fakeAsync(() => {
      host = createHost(template(`let response ${method.toLowerCase()} '${PATH}'`));

      const { expectOneWithResponse } = getHttp<HttpDirective, HostComponent>(host);

      expectOneWithResponse(PATH, HTTPMethod[ method ], RESPONSE);

      expect(host.hostElement).toHaveText(RESPONSE);
    }));
  });

  REQUEST_METHODS_WITH_BODY.forEach((method) => {
    it(`should make ${method} http request with body`, fakeAsync(() => {
      host = createHost(template(`let response ${method.toLowerCase()} '${PATH}' send ${BODY_STRINGIFY}`));

      const { expectOneWithResponse } = getHttp<HttpDirective, HostComponent>(host);

      const req = expectOneWithResponse(PATH, HTTPMethod[ method ], RESPONSE);

      expect(req.request.body).toEqual(BODY);
      expect(host.hostElement).toHaveText(RESPONSE);
    }));
  });

  REQUEST_METHODS_WITH_PARAMS.forEach((method) => {
    it(`should make ${method} http request with body`, fakeAsync(() => {
      host = createHost(template(`let response ${method.toLowerCase()} '${PATH}' with { params: ${BODY_STRINGIFY} }`));

      const { expectOneWithResponse } = getHttp<HttpDirective, HostComponent>(host);

      const req = expectOneWithResponse(PATH_WITH_PARAMS, HTTPMethod[ method ], RESPONSE);

      expect(req.request.params.toString()).toEqual(PARAMS);
      expect(host.hostElement).toHaveText(RESPONSE);
    }));
  });

});

function template(command: string) {
  return `<ng-container *http="${command}">{{ response }}</ng-container>`;
}
