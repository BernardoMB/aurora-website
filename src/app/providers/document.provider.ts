import { isPlatformBrowser } from '@angular/common';
import { ClassProvider, FactoryProvider, InjectionToken, PLATFORM_ID } from '@angular/core';

/* Create a new injection token for injecting the document into a component. */
export const DOCUMENT = new InjectionToken('DocumentToken');

/* Define abstract class for obtaining reference to the global document object. */
export abstract class DocumentRef {
  get nativeDocument(): Document | Object {
    throw new Error('Not implemented.');
  }
}

/* Define class that implements the abstract class and returns the native Document object. */
export class BrowserDocumentRef extends DocumentRef {
  constructor() {
    super();
  }

  get nativeDocument(): Document | Object {
    return document;
  }
}

/* Create an factory function that returns the native document object. */
export function documentFactory(browserDocumentRef: BrowserDocumentRef, platformId: Object): Document | Object {
  if (isPlatformBrowser(platformId)) {
    return browserDocumentRef.nativeDocument;
  }
  return new Object();
}

/* Create a injectable provider for the DocumentRef token that uses the BrowserDocumentRef class. */
const browserDocumentProvider: ClassProvider = {
  provide: DocumentRef,
  useClass: BrowserDocumentRef
};

/* Create an injectable provider that uses the documentFactory function for returning the native document object. */
const documentProvider: FactoryProvider = {
  provide: DOCUMENT,
  useFactory: documentFactory,
  deps: [DocumentRef, PLATFORM_ID]
};

/* Create an array of providers. */
export const DOCUMENT_PROVIDERS = [browserDocumentProvider, documentProvider];
