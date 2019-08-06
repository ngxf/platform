import { HttpClient } from '@angular/common/http';
import { HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HTTPMethod, SpectatorHTTP, SpectatorWithHost, SpyObject } from '@netbasal/spectator';

export enum HTTPMethods {
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  JSONP = 'JSONP',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT'
}

export class SpectatorHTTPWithResponse<S> extends SpectatorHTTP<S> {
  expectOneWithResponse: (
    url: string,
    method: HTTPMethod,
    response
  ) => TestRequest;
}

export function getHttp<C, S extends SpectatorWithHost<C, unknown>>(host: S): SpectatorHTTPWithResponse<S> {
  const http = new SpectatorHTTPWithResponse<S>();

  http.httpClient = TestBed.get(HttpClient);
  http.controller = TestBed.get(HttpTestingController);
  http.dataService = host;
  http.get = function <O>(provider: Type<O>): O & SpyObject<O> {
    return TestBed.get(provider);
  };
  http.expectOne = (url: string, method: HTTPMethod): TestRequest => {
    const req = http.controller.expectOne({ url, method });

    http.controller.verify();

    return req;
  };
  http.expectOneWithResponse = (url: string, method: HTTPMethod, response): TestRequest => {
    const req = http.expectOne(url, method);
    req.flush(response);
    host.detectChanges();
    return req;
  };

  return http;
}
