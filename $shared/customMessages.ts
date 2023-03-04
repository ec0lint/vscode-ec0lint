/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { NotificationType, NotificationType0, RequestType, TextDocumentIdentifier } from 'vscode-languageserver-protocol';

export enum Status {
	ok = 1,
	warn = 2,
	error = 3
}

export type StatusParams = {
	uri: string;
	state: Status;
	validationTime?: number;
};

/**
 * The status notification is sent from the server to the client to
 * inform the client about server status changes.
 */
export namespace StatusNotification {
	export const method: 'ec0lint/status' = 'ec0lint/status';
	export const type = new NotificationType<StatusParams>(method);
}

export type NoConfigParams = {
	message: string;
	document: TextDocumentIdentifier;
};

export type NoConfigResult = {
};

/**
 * The NoConfigRequest is sent from the server to the client to inform
 * the client that no ec0lint configuration file could be found when
 * trying to lint a file.
 */
export namespace NoConfigRequest {
	export const method: 'ec0lint/noConfig' = 'ec0lint/noConfig';
	export const type = new RequestType<NoConfigParams, NoConfigResult, void>(method);
}

export type NoEc0lintLibraryParams = {
	source: TextDocumentIdentifier;
};

export type NoEc0lintLibraryResult = {
};

/**
 * The NoEc0lintLibraryRequest is sent from the server to the client to
 * inform the client that no ec0lint library could be found when trying
 * to lint a file.
 */
export namespace NoEc0lintLibraryRequest {
	export const method: 'ec0lint/noLibrary' = 'ec0lint/noLibrary';
	export const type = new RequestType<NoEc0lintLibraryParams, NoEc0lintLibraryResult, void>(method);
}

export type OpenEc0lintDocParams = {
	url: string;
};

export type OpenEc0lintDocResult = {
};

/**
 * The ec0lint/openDoc request is sent from the server to the client to
 * ask the client to open the documentation URI for a given
 * Ec0lint rule.
 */
export namespace OpenEc0lintDocRequest {
	export const method: 'ec0lint/openDoc' = 'ec0lint/openDoc';
	export const type = new RequestType<OpenEc0lintDocParams, OpenEc0lintDocResult, void>(method);
}

export type ProbeFailedParams = {
	textDocument: TextDocumentIdentifier;
};

/**
 * The ec0lint/probeFailed request is sent from the server to the client
 * to tell the client the the lint probing for a certain document has
 * failed and that there is no need to sync that document to the server
 * anymore.
 */
export namespace ProbeFailedRequest {
	export const method: 'ec0lint/probeFailed' = 'ec0lint/probeFailed';
	export const type = new RequestType<ProbeFailedParams, void, void>(method);
}

/**
 * The ec0lint/showOutputChannel notification is sent from the server to
 * the client to ask the client to reveal it's output channel.
 */
export namespace ShowOutputChannel {
	export const method: 'ec0lint/showOutputChannel' = 'ec0lint/showOutputChannel';
	export const type = new NotificationType0('ec0lint/showOutputChannel');
}

/**
 * The ec0lint/exitCalled notification is sent from the server to the client
 * to inform the client that a process.exit call on the server got intercepted.
 * The call was very likely made by an Ec0lint plugin.
 */
export namespace ExitCalled {
	export const method: 'ec0lint/exitCalled' = 'ec0lint/exitCalled';
	export const type = new NotificationType<[number, string]>(method);
}