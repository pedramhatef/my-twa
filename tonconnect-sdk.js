'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var protocol = require('@tonconnect/protocol');
require('@tonconnect/isomorphic-eventsource');
require('@tonconnect/isomorphic-fetch');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/**
 * Base class for TonConnect errors. You can check if the error was triggered by the @tonconnect/sdk using `err instanceof TonConnectError`.
 */
class TonConnectError extends Error {
    constructor(message, options) {
        super(message, options);
        this.message = `${TonConnectError.prefix} ${this.constructor.name}${this.info ? ': ' + this.info : ''}${message ? '\n' + message : ''}`;
        Object.setPrototypeOf(this, TonConnectError.prototype);
    }
    get info() {
        return '';
    }
}
TonConnectError.prefix = '[TON_CONNECT_SDK_ERROR]';

/**
 * Thrown when passed DappMetadata is in incorrect format.
 */
class DappMetadataError extends TonConnectError {
    get info() {
        return 'Passed DappMetadata is in incorrect format.';
    }
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, DappMetadataError.prototype);
    }
}

/**
 * Thrown when passed manifest contains errors.
 */
class ManifestContentErrorError extends TonConnectError {
    get info() {
        return 'Passed `tonconnect-manifest.json` contains errors. Check format of your manifest. See more https://github.com/ton-connect/docs/blob/main/requests-responses.md#app-manifest';
    }
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, ManifestContentErrorError.prototype);
    }
}

/**
 * Thrown when wallet can't get manifest by passed manifestUrl.
 */
class ManifestNotFoundError extends TonConnectError {
    get info() {
        return 'Manifest not found. Make sure you added `tonconnect-manifest.json` to the root of your app or passed correct manifestUrl. See more https://github.com/ton-connect/docs/blob/main/requests-responses.md#app-manifest';
    }
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, ManifestNotFoundError.prototype);
    }
}

/**
 * Thrown when wallet connection called but wallet already connected. To avoid the error, disconnect the wallet before doing a new connection.
 */
class WalletAlreadyConnectedError extends TonConnectError {
    get info() {
        return 'Wallet connection called but wallet already connected. To avoid the error, disconnect the wallet before doing a new connection.';
    }
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, WalletAlreadyConnectedError.prototype);
    }
}

/**
 * Thrown when send transaction or other protocol methods called while wallet is not connected.
 */
class WalletNotConnectedError extends TonConnectError {
    get info() {
        return 'Send transaction or other protocol methods called while wallet is not connected.';
    }
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, WalletNotConnectedError.prototype);
    }
}

function isWalletConnectionSourceJS(value) {
    return 'jsBridgeKey' in value;
}

/**
 * Thrown when user rejects the action in the wallet.
 */
class UserRejectsError extends TonConnectError {
    get info() {
        return 'User rejects the action in the wallet.';
    }
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, UserRejectsError.prototype);
    }
}

/**
 * Thrown when request to the wallet contains errors.
 */
class BadRequestError extends TonConnectError {
    get info() {
        return 'Request to the wallet contains errors.';
    }
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

/**
 * Thrown when app tries to send rpc request to the injected wallet while not connected.
 */
class UnknownAppError extends TonConnectError {
    get info() {
        return 'App tries to send rpc request to the injected wallet while not connected.';
    }
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, UnknownAppError.prototype);
    }
}

/**
 * Thrown when there is an attempt to connect to the injected wallet while it is not exists in the webpage.
 */
class WalletNotInjectedError extends TonConnectError {
    get info() {
        return 'There is an attempt to connect to the injected wallet while it is not exists in the webpage.';
    }
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, WalletNotInjectedError.prototype);
    }
}

/**
 * Thrown when `Storage` was not specified in the `DappMetadata` and default `localStorage` was not detected in the Node.js environment.
 */
class LocalstorageNotFoundError extends TonConnectError {
    get info() {
        return 'Storage was not specified in the `DappMetadata` and default `localStorage` was not detected in the environment.';
    }
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, LocalstorageNotFoundError.prototype);
    }
}

/**
 * Thrown when an error occurred while fetching the wallets list.
 */
class FetchWalletsError extends TonConnectError {
    get info() {
        return 'An error occurred while fetching the wallets list.';
    }
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, FetchWalletsError.prototype);
    }
}

/**
 * Thrown when passed address is in incorrect format.
 */
class WrongAddressError extends TonConnectError {
    get info() {
        return 'Passed address is in incorrect format.';
    }
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, WrongAddressError.prototype);
    }
}

/**
 * Thrown when passed hex is in incorrect format.
 */
class ParseHexError extends TonConnectError {
    get info() {
        return 'Passed hex is in incorrect format.';
    }
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, ParseHexError.prototype);
    }
}

/**
 * Unhanded unknown error.
 */
class UnknownError extends TonConnectError {
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, UnknownError.prototype);
    }
}

const connectEventErrorsCodes = {
    [protocol.CONNECT_EVENT_ERROR_CODES.UNKNOWN_ERROR]: UnknownError,
    [protocol.CONNECT_EVENT_ERROR_CODES.USER_REJECTS_ERROR]: UserRejectsError,
    [protocol.CONNECT_EVENT_ERROR_CODES.BAD_REQUEST_ERROR]: BadRequestError,
    [protocol.CONNECT_EVENT_ERROR_CODES.UNKNOWN_APP_ERROR]: UnknownAppError,
    [protocol.CONNECT_EVENT_ERROR_CODES.MANIFEST_NOT_FOUND_ERROR]: ManifestNotFoundError,
    [protocol.CONNECT_EVENT_ERROR_CODES.MANIFEST_CONTENT_ERROR]: ManifestContentErrorError
};
class ConnectErrorsParser {
    parseError(error) {
        let ErrorConstructor = UnknownError;
        if (error.code in connectEventErrorsCodes) {
            ErrorConstructor = connectEventErrorsCodes[error.code] || UnknownError;
        }
        return new ErrorConstructor(error.message);
    }
}
const connectErrorsParser = new ConnectErrorsParser();

class RpcParser {
    isError(response) {
        return 'error' in response;
    }
}

const sendTransactionErrors = {
    [protocol.SEND_TRANSACTION_ERROR_CODES.UNKNOWN_ERROR]: UnknownError,
    [protocol.SEND_TRANSACTION_ERROR_CODES.USER_REJECTS_ERROR]: UserRejectsError,
    [protocol.SEND_TRANSACTION_ERROR_CODES.BAD_REQUEST_ERROR]: BadRequestError,
    [protocol.SEND_TRANSACTION_ERROR_CODES.UNKNOWN_APP_ERROR]: UnknownAppError
};
class SendTransactionParser extends RpcParser {
    convertToRpcRequest(request) {
        return {
            method: 'sendTransaction',
            params: [JSON.stringify(request)]
        };
    }
    parseAndThrowError(response) {
        let ErrorConstructor = UnknownError;
        if (response.error.code in sendTransactionErrors) {
            ErrorConstructor = sendTransactionErrors[response.error.code] || UnknownError;
        }
        throw new ErrorConstructor(response.error.message);
    }
    convertFromRpcResponse(rpcResponse) {
        return {
            boc: rpcResponse.result
        };
    }
}
const sendTransactionParser = new SendTransactionParser();

class HttpBridgeGatewayStorage {
    constructor(storage, bridgeUrl) {
        this.storage = storage;
        this.storeKey = 'ton-connect-storage_http-bridge-gateway::' + bridgeUrl;
    }
    storeLastEventId(lastEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storage.setItem(this.storeKey, lastEventId);
        });
    }
    removeLastEventId() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storage.removeItem(this.storeKey);
        });
    }
    getLastEventId() {
        return __awaiter(this, void 0, void 0, function* () {
            const stored = yield this.storage.getItem(this.storeKey);
            if (!stored) {
                return null;
            }
            return stored;
        });
    }
}

function removeUrlLastSlash(url) {
    if (url.slice(-1) === '/') {
        return url.slice(0, -1);
    }
    return url;
}
function addPathToUrl(url, path) {
    return removeUrlLastSlash(url) + '/' + path;
}
function isTelegramUrl(link) {
    if (!link) {
        return false;
    }
    const url = new URL(link);
    return url.protocol === 'tg:' || url.hostname === 't.me';
}
function encodeTelegramUrlParameters(parameters) {
    return parameters
        .replaceAll('.', '%2E')
        .replaceAll('-', '%2D')
        .replaceAll('_', '%5F')
        .replaceAll('&', '-')
        .replaceAll('=', '__')
        .replaceAll('%', '--');
}

/**
 * Delays the execution of code for a specified number of milliseconds.
 * @param {number} timeout - The number of milliseconds to delay the execution.
 * @param {DelayOptions} [options] - Optional configuration options for the delay.
 * @return {Promise<void>} - A promise that resolves after the specified delay, or rejects if the delay is aborted.
 */
function delay(timeout, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var _a, _b;
            if ((_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.aborted) {
                reject(new TonConnectError('Delay aborted'));
                return;
            }
            const timeoutId = setTimeout(() => resolve(), timeout);
            (_b = options === null || options === void 0 ? void 0 : options.signal) === null || _b === void 0 ? void 0 : _b.addEventListener('abort', () => {
                clearTimeout(timeoutId);
                reject(new TonConnectError('Delay aborted'));
            });
        });
    });
}

/**
 * Creates an AbortController instance with an optional AbortSignal.
 *
 * @param {AbortSignal} [signal] - An optional AbortSignal to use for aborting the controller.
 * @returns {AbortController} - An instance of AbortController.
 */
function createAbortController(signal) {
    const abortController = new AbortController();
    if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
        abortController.abort();
    }
    else {
        signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', () => abortController.abort(), { once: true });
    }
    return abortController;
}

/**
 * Function to call ton api until we get response.
 * Because ton network is pretty unstable we need to make sure response is final.
 * @param {T} fn - function to call
 * @param {CallForSuccessOptions} [options] - optional configuration options
 */
function callForSuccess(fn, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const attempts = (_a = options === null || options === void 0 ? void 0 : options.attempts) !== null && _a !== void 0 ? _a : 10;
        const delayMs = (_b = options === null || options === void 0 ? void 0 : options.delayMs) !== null && _b !== void 0 ? _b : 200;
        const abortController = createAbortController(options === null || options === void 0 ? void 0 : options.signal);
        if (typeof fn !== 'function') {
            throw new TonConnectError(`Expected a function, got ${typeof fn}`);
        }
        let i = 0;
        let lastError;
        while (i < attempts) {
            if (abortController.signal.aborted) {
                throw new TonConnectError(`Aborted after attempts ${i}`);
            }
            try {
                return yield fn({ signal: abortController.signal });
            }
            catch (err) {
                lastError = err;
                i++;
                if (i < attempts) {
                    yield delay(delayMs);
                }
            }
        }
        throw lastError;
    });
}

function logDebug(...args) {
    {
        try {
            console.debug('[TON_CONNECT_SDK]', ...args);
        }
        catch (_a) { }
    }
}
function logError(...args) {
    {
        try {
            console.error('[TON_CONNECT_SDK]', ...args);
        }
        catch (_a) { }
    }
}
function logWarning(...args) {
    {
        try {
            console.warn('[TON_CONNECT_SDK]', ...args);
        }
        catch (_a) { }
    }
}

/**
 * Create a resource.
 *
 * @template T - The type of the resource.
 * @template Args - The type of the arguments for creating the resource.
 *
 * @param {(...args: Args) => Promise<T>} createFn - A function that creates the resource.
 * @param {(resource: T) => Promise<void>} [disposeFn] - An optional function that disposes the resource.
 */
function createResource(createFn, disposeFn) {
    let currentResource = null;
    let currentArgs = null;
    let currentPromise = null;
    let currentSignal = null;
    let abortController = null;
    // create a new resource
    const create = (signal, ...args) => __awaiter(this, void 0, void 0, function* () {
        currentSignal = signal !== null && signal !== void 0 ? signal : null;
        abortController === null || abortController === void 0 ? void 0 : abortController.abort();
        abortController = createAbortController(signal);
        if (abortController.signal.aborted) {
            throw new TonConnectError('Resource creation was aborted');
        }
        currentArgs = args !== null && args !== void 0 ? args : null;
        const promise = createFn(abortController.signal, ...args);
        currentPromise = promise;
        const resource = yield promise;
        if (currentPromise !== promise && resource !== currentResource) {
            yield disposeFn(resource);
            throw new TonConnectError('Resource creation was aborted by a new resource creation');
        }
        currentResource = resource;
        return currentResource;
    });
    // get the current resource
    const current = () => {
        return currentResource !== null && currentResource !== void 0 ? currentResource : null;
    };
    // dispose the current resource
    const dispose = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const resource = currentResource;
            currentResource = null;
            const promise = currentPromise;
            currentPromise = null;
            try {
                abortController === null || abortController === void 0 ? void 0 : abortController.abort();
            }
            catch (e) { }
            yield Promise.allSettled([
                resource ? disposeFn(resource) : Promise.resolve(),
                promise ? disposeFn(yield promise) : Promise.resolve()
            ]);
        }
        catch (e) { }
    });
    // recreate the current resource
    const recreate = (delayMs) => __awaiter(this, void 0, void 0, function* () {
        const resource = currentResource;
        const promise = currentPromise;
        const args = currentArgs;
        const signal = currentSignal;
        yield delay(delayMs);
        if (resource === currentResource &&
            promise === currentPromise &&
            args === currentArgs &&
            signal === currentSignal) {
            return yield create(currentSignal, ...(args !== null && args !== void 0 ? args : []));
        }
        throw new TonConnectError('Resource recreation was aborted by a new resource creation');
    });
    return {
        create,
        current,
        dispose,
        recreate
    };
}

/**
 * Executes a function and provides deferred behavior, allowing for a timeout and abort functionality.
 *
 * @param {Deferrable<T>} fn - The function to execute. It should return a promise that resolves with the desired result.
 * @param {DeferOptions} options - Optional configuration options for the defer behavior.
 * @returns {Promise<T>} - A promise that resolves with the result of the executed function, or rejects with an error if it times out or is aborted.
 */
function timeout(fn, options) {
    const timeout = options === null || options === void 0 ? void 0 : options.timeout;
    const signal = options === null || options === void 0 ? void 0 : options.signal;
    const abortController = createAbortController(signal);
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        if (abortController.signal.aborted) {
            reject(new TonConnectError('Operation aborted'));
            return;
        }
        let timeoutId;
        if (typeof timeout !== 'undefined') {
            timeoutId = setTimeout(() => {
                abortController.abort();
                reject(new TonConnectError(`Timeout after ${timeout}ms`));
            }, timeout);
        }
        abortController.signal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject(new TonConnectError('Operation aborted'));
        }, { once: true });
        const deferOptions = { timeout, abort: abortController.signal };
        yield fn((...args) => {
            clearTimeout(timeoutId);
            resolve(...args);
        }, () => {
            clearTimeout(timeoutId);
            reject();
        }, deferOptions);
    }));
}

class BridgeGateway {
    constructor(storage, bridgeUrl, sessionId, listener, errorsListener) {
        this.bridgeUrl = bridgeUrl;
        this.sessionId = sessionId;
        this.listener = listener;
        this.errorsListener = errorsListener;
        this.ssePath = 'events';
        this.postPath = 'message';
        this.heartbeatMessage = 'heartbeat';
        this.defaultTtl = 300;
        this.defaultReconnectDelay = 2000;
        this.defaultResendDelay = 5000;
        this.eventSource = createResource((signal, openingDeadlineMS) => __awaiter(this, void 0, void 0, function* () {
            const eventSourceConfig = {
                bridgeUrl: this.bridgeUrl,
                ssePath: this.ssePath,
                sessionId: this.sessionId,
                bridgeGatewayStorage: this.bridgeGatewayStorage,
                errorHandler: this.errorsHandler.bind(this),
                messageHandler: this.messagesHandler.bind(this),
                signal: signal,
                openingDeadlineMS: openingDeadlineMS
            };
            return yield createEventSource(eventSourceConfig);
        }), (resource) => __awaiter(this, void 0, void 0, function* () {
            resource.close();
        }));
        this.bridgeGatewayStorage = new HttpBridgeGatewayStorage(storage, bridgeUrl);
    }
    get isReady() {
        const eventSource = this.eventSource.current();
        return (eventSource === null || eventSource === void 0 ? void 0 : eventSource.readyState) === EventSource.OPEN;
    }
    get isClosed() {
        const eventSource = this.eventSource.current();
        return (eventSource === null || eventSource === void 0 ? void 0 : eventSource.readyState) !== EventSource.OPEN;
    }
    get isConnecting() {
        const eventSource = this.eventSource.current();
        return (eventSource === null || eventSource === void 0 ? void 0 : eventSource.readyState) === EventSource.CONNECTING;
    }
    registerSession(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.eventSource.create(options === null || options === void 0 ? void 0 : options.signal, options === null || options === void 0 ? void 0 : options.openingDeadlineMS);
        });
    }
    send(message, receiver, topic, ttlOrOptions) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: remove deprecated method
            const options = {};
            if (typeof ttlOrOptions === 'number') {
                options.ttl = ttlOrOptions;
            }
            else {
                options.ttl = ttlOrOptions === null || ttlOrOptions === void 0 ? void 0 : ttlOrOptions.ttl;
                options.signal = ttlOrOptions === null || ttlOrOptions === void 0 ? void 0 : ttlOrOptions.signal;
                options.attempts = ttlOrOptions === null || ttlOrOptions === void 0 ? void 0 : ttlOrOptions.attempts;
            }
            const url = new URL(addPathToUrl(this.bridgeUrl, this.postPath));
            url.searchParams.append('client_id', this.sessionId);
            url.searchParams.append('to', receiver);
            url.searchParams.append('ttl', ((options === null || options === void 0 ? void 0 : options.ttl) || this.defaultTtl).toString());
            url.searchParams.append('topic', topic);
            const body = protocol.Base64.encode(message);
            yield callForSuccess((options) => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.post(url, body, options.signal);
                if (!response.ok) {
                    throw new TonConnectError(`Bridge send failed, status ${response.status}`);
                }
            }), {
                attempts: (_a = options === null || options === void 0 ? void 0 : options.attempts) !== null && _a !== void 0 ? _a : Number.MAX_SAFE_INTEGER,
                delayMs: this.defaultResendDelay,
                signal: options === null || options === void 0 ? void 0 : options.signal
            });
        });
    }
    pause() {
        this.eventSource.dispose().catch(e => logError(`Bridge pause failed, ${e}`));
    }
    unPause() {
        return __awaiter(this, void 0, void 0, function* () {
            const RECREATE_WITHOUT_DELAY = 0;
            yield this.eventSource.recreate(RECREATE_WITHOUT_DELAY);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.eventSource.dispose().catch(e => logError(`Bridge close failed, ${e}`));
        });
    }
    setListener(listener) {
        this.listener = listener;
    }
    setErrorsListener(errorsListener) {
        this.errorsListener = errorsListener;
    }
    post(url, body, signal) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url, {
                method: 'post',
                body: body,
                signal: signal
            });
            if (!response.ok) {
                throw new TonConnectError(`Bridge send failed, status ${response.status}`);
            }
            return response;
        });
    }
    errorsHandler(eventSource, e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isConnecting) {
                eventSource.close();
                throw new TonConnectError('Bridge error, failed to connect');
            }
            if (this.isReady) {
                try {
                    this.errorsListener(e);
                }
                catch (e) { }
                return;
            }
            if (this.isClosed) {
                eventSource.close();
                logDebug(`Bridge reconnecting, ${this.defaultReconnectDelay}ms delay`);
                return yield this.eventSource.recreate(this.defaultReconnectDelay);
            }
            throw new TonConnectError('Bridge error, unknown state');
        });
    }
    messagesHandler(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (e.data === this.heartbeatMessage) {
                return;
            }
            yield this.bridgeGatewayStorage.storeLastEventId(e.lastEventId);
            if (this.isClosed) {
                return;
            }
            let bridgeIncomingMessage;
            try {
                bridgeIncomingMessage = JSON.parse(e.data);
            }
            catch (e) {
                throw new TonConnectError(`Bridge message parse failed, message ${e.data}`);
            }
            this.listener(bridgeIncomingMessage);
        });
    }
}
/**
 * Creates an event source.
 * @param {CreateEventSourceConfig} config - Configuration for creating an event source.
 */
function createEventSource(config) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield timeout((resolve, reject, deferOptions) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const abortController = createAbortController(deferOptions.signal);
            const signal = abortController.signal;
            if (signal.aborted) {
                reject(new TonConnectError('Bridge connection aborted'));
                return;
            }
            const url = new URL(addPathToUrl(config.bridgeUrl, config.ssePath));
            url.searchParams.append('client_id', config.sessionId);
            const lastEventId = yield config.bridgeGatewayStorage.getLastEventId();
            if (lastEventId) {
                url.searchParams.append('last_event_id', lastEventId);
            }
            if (signal.aborted) {
                reject(new TonConnectError('Bridge connection aborted'));
                return;
            }
            const eventSource = new EventSource(url.toString());
            eventSource.onerror = (reason) => __awaiter(this, void 0, void 0, function* () {
                if (signal.aborted) {
                    eventSource.close();
                    reject(new TonConnectError('Bridge connection aborted'));
                    return;
                }
                try {
                    const newInstance = yield config.errorHandler(eventSource, reason);
                    if (newInstance !== eventSource) {
                        eventSource.close();
                    }
                    if (newInstance && newInstance !== eventSource) {
                        resolve(newInstance);
                    }
                }
                catch (e) {
                    eventSource.close();
                    reject(e);
                }
            });
            eventSource.onopen = () => {
                if (signal.aborted) {
                    eventSource.close();
                    reject(new TonConnectError('Bridge connection aborted'));
                    return;
                }
                resolve(eventSource);
            };
            eventSource.onmessage = (event) => {
                if (signal.aborted) {
                    eventSource.close();
                    reject(new TonConnectError('Bridge connection aborted'));
                    return;
                }
                config.messageHandler(event);
            };
            (_a = config.signal) === null || _a === void 0 ? void 0 : _a.addEventListener('abort', () => {
                eventSource.close();
                reject(new TonConnectError('Bridge connection aborted'));
            });
        }), { timeout: config.openingDeadlineMS, signal: config.signal });
    });
}

function isPendingConnectionHttp(connection) {
    return !('connectEvent' in connection);
}

class BridgeConnectionStorage {
    constructor(storage) {
        this.storage = storage;
        this.storeKey = 'ton-connect-storage_bridge-connection';
    }
    storeConnection(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection.type === 'injected') {
                return this.storage.setItem(this.storeKey, JSON.stringify(connection));
            }
            if (!isPendingConnectionHttp(connection)) {
                const rawSession = {
                    sessionKeyPair: connection.session.sessionCrypto.stringifyKeypair(),
                    walletPublicKey: connection.session.walletPublicKey,
                    bridgeUrl: connection.session.bridgeUrl
                };
                const rawConnection = {
                    type: 'http',
                    connectEvent: connection.connectEvent,
                    session: rawSession,
                    lastWalletEventId: connection.lastWalletEventId,
                    nextRpcRequestId: connection.nextRpcRequestId
                };
                return this.storage.setItem(this.storeKey, JSON.stringify(rawConnection));
            }
            const rawConnection = {
                type: 'http',
                connectionSource: connection.connectionSource,
                sessionCrypto: connection.sessionCrypto.stringifyKeypair()
            };
            return this.storage.setItem(this.storeKey, JSON.stringify(rawConnection));
        });
    }
    removeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storage.removeItem(this.storeKey);
        });
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const stored = yield this.storage.getItem(this.storeKey);
            if (!stored) {
                return null;
            }
            const connection = JSON.parse(stored);
            if (connection.type === 'injected') {
                return connection;
            }
            if ('connectEvent' in connection) {
                const sessionCrypto = new protocol.SessionCrypto(connection.session.sessionKeyPair);
                return {
                    type: 'http',
                    connectEvent: connection.connectEvent,
                    lastWalletEventId: connection.lastWalletEventId,
                    nextRpcRequestId: connection.nextRpcRequestId,
                    session: {
                        sessionCrypto,
                        bridgeUrl: connection.session.bridgeUrl,
                        walletPublicKey: connection.session.walletPublicKey
                    }
                };
            }
            return {
                type: 'http',
                sessionCrypto: new protocol.SessionCrypto(connection.sessionCrypto),
                connectionSource: connection.connectionSource
            };
        });
    }
    getHttpConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.getConnection();
            if (!connection) {
                throw new TonConnectError('Trying to read HTTP connection source while nothing is stored');
            }
            if (connection.type === 'injected') {
                throw new TonConnectError('Trying to read HTTP connection source while injected connection is stored');
            }
            return connection;
        });
    }
    getHttpPendingConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.getConnection();
            if (!connection) {
                throw new TonConnectError('Trying to read HTTP connection source while nothing is stored');
            }
            if (connection.type === 'injected') {
                throw new TonConnectError('Trying to read HTTP connection source while injected connection is stored');
            }
            if (!isPendingConnectionHttp(connection)) {
                throw new TonConnectError('Trying to read HTTP-pending connection while http connection is stored');
            }
            return connection;
        });
    }
    getInjectedConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.getConnection();
            if (!connection) {
                throw new TonConnectError('Trying to read Injected bridge connection source while nothing is stored');
            }
            if ((connection === null || connection === void 0 ? void 0 : connection.type) === 'http') {
                throw new TonConnectError('Trying to read Injected bridge connection source while HTTP connection is stored');
            }
            return connection;
        });
    }
    storedConnectionType() {
        return __awaiter(this, void 0, void 0, function* () {
            const stored = yield this.storage.getItem(this.storeKey);
            if (!stored) {
                return null;
            }
            const connection = JSON.parse(stored);
            return connection.type;
        });
    }
    storeLastWalletEventId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.getConnection();
            if (connection && connection.type === 'http' && !isPendingConnectionHttp(connection)) {
                connection.lastWalletEventId = id;
                return this.storeConnection(connection);
            }
        });
    }
    getLastWalletEventId() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.getConnection();
            if (connection && 'lastWalletEventId' in connection) {
                return connection.lastWalletEventId;
            }
            return undefined;
        });
    }
    increaseNextRpcRequestId() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.getConnection();
            if (connection && 'nextRpcRequestId' in connection) {
                const lastId = connection.nextRpcRequestId || 0;
                connection.nextRpcRequestId = lastId + 1;
                return this.storeConnection(connection);
            }
        });
    }
    getNextRpcRequestId() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.getConnection();
            if (connection && 'nextRpcRequestId' in connection) {
                return connection.nextRpcRequestId || 0;
            }
            return 0;
        });
    }
}

const PROTOCOL_VERSION = 2;

class BridgeProvider {
    constructor(storage, walletConnectionSource) {
        this.storage = storage;
        this.walletConnectionSource = walletConnectionSource;
        this.type = 'http';
        this.standardUniversalLink = 'tc://';
        this.pendingRequests = new Map();
        this.session = null;
        this.gateway = null;
        this.pendingGateways = [];
        this.listeners = [];
        this.defaultOpeningDeadlineMS = 12000;
        this.defaultRetryTimeoutMS = 2000;
        this.connectionStorage = new BridgeConnectionStorage(storage);
    }
    static fromStorage(storage) {
        return __awaiter(this, void 0, void 0, function* () {
            const bridgeConnectionStorage = new BridgeConnectionStorage(storage);
            const connection = yield bridgeConnectionStorage.getHttpConnection();
            if (isPendingConnectionHttp(connection)) {
                return new BridgeProvider(storage, connection.connectionSource);
            }
            return new BridgeProvider(storage, { bridgeUrl: connection.session.bridgeUrl });
        });
    }
    connect(message, options) {
        var _a;
        const abortController = createAbortController(options === null || options === void 0 ? void 0 : options.signal);
        (_a = this.abortController) === null || _a === void 0 ? void 0 : _a.abort();
        this.abortController = abortController;
        this.closeGateways();
        const sessionCrypto = new protocol.SessionCrypto();
        this.session = {
            sessionCrypto,
            bridgeUrl: 'bridgeUrl' in this.walletConnectionSource
                ? this.walletConnectionSource.bridgeUrl
                : ''
        };
        this.connectionStorage
            .storeConnection({
            type: 'http',
            connectionSource: this.walletConnectionSource,
            sessionCrypto
        })
            .then(() => __awaiter(this, void 0, void 0, function* () {
            if (abortController.signal.aborted) {
                return;
            }
            yield callForSuccess(_options => {
                var _a;
                return this.openGateways(sessionCrypto, {
                    openingDeadlineMS: (_a = options === null || options === void 0 ? void 0 : options.openingDeadlineMS) !== null && _a !== void 0 ? _a : this.defaultOpeningDeadlineMS,
                    signal: _options === null || _options === void 0 ? void 0 : _options.signal
                });
            }, {
                attempts: Number.MAX_SAFE_INTEGER,
                delayMs: this.defaultRetryTimeoutMS,
                signal: abortController.signal
            });
        }));
        const universalLink = 'universalLink' in this.walletConnectionSource &&
            this.walletConnectionSource.universalLink
            ? this.walletConnectionSource.universalLink
            : this.standardUniversalLink;
        return this.generateUniversalLink(universalLink, message);
    }
    restoreConnection(options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const abortController = createAbortController(options === null || options === void 0 ? void 0 : options.signal);
            (_a = this.abortController) === null || _a === void 0 ? void 0 : _a.abort();
            this.abortController = abortController;
            if (abortController.signal.aborted) {
                return;
            }
            this.closeGateways();
            const storedConnection = yield this.connectionStorage.getHttpConnection();
            if (!storedConnection) {
                return;
            }
            if (abortController.signal.aborted) {
                return;
            }
            const openingDeadlineMS = (_b = options === null || options === void 0 ? void 0 : options.openingDeadlineMS) !== null && _b !== void 0 ? _b : this.defaultOpeningDeadlineMS;
            if (isPendingConnectionHttp(storedConnection)) {
                this.session = {
                    sessionCrypto: storedConnection.sessionCrypto,
                    bridgeUrl: 'bridgeUrl' in this.walletConnectionSource
                        ? this.walletConnectionSource.bridgeUrl
                        : ''
                };
                return yield this.openGateways(storedConnection.sessionCrypto, {
                    openingDeadlineMS: openingDeadlineMS,
                    signal: abortController === null || abortController === void 0 ? void 0 : abortController.signal
                });
            }
            if (Array.isArray(this.walletConnectionSource)) {
                throw new TonConnectError('Internal error. Connection source is array while WalletConnectionSourceHTTP was expected.');
            }
            this.session = storedConnection.session;
            if (this.gateway) {
                logDebug('Gateway is already opened, closing previous gateway');
                yield this.gateway.close();
            }
            this.gateway = new BridgeGateway(this.storage, this.walletConnectionSource.bridgeUrl, storedConnection.session.sessionCrypto.sessionId, this.gatewayListener.bind(this), this.gatewayErrorsListener.bind(this));
            if (abortController.signal.aborted) {
                return;
            }
            // notify listeners about stored connection
            this.listeners.forEach(listener => listener(storedConnection.connectEvent));
            // wait for the connection to be opened
            try {
                yield callForSuccess(options => this.gateway.registerSession({
                    openingDeadlineMS: openingDeadlineMS,
                    signal: options.signal
                }), {
                    attempts: Number.MAX_SAFE_INTEGER,
                    delayMs: this.defaultRetryTimeoutMS,
                    signal: abortController.signal
                });
            }
            catch (e) {
                yield this.disconnect({ signal: abortController.signal });
                return;
            }
        });
    }
    sendRequest(request, optionsOrOnRequestSent) {
        // TODO: remove deprecated method
        const options = {};
        if (typeof optionsOrOnRequestSent === 'function') {
            options.onRequestSent = optionsOrOnRequestSent;
        }
        else {
            options.onRequestSent = optionsOrOnRequestSent === null || optionsOrOnRequestSent === void 0 ? void 0 : optionsOrOnRequestSent.onRequestSent;
            options.signal = optionsOrOnRequestSent === null || optionsOrOnRequestSent === void 0 ? void 0 : optionsOrOnRequestSent.signal;
            options.attempts = optionsOrOnRequestSent === null || optionsOrOnRequestSent === void 0 ? void 0 : optionsOrOnRequestSent.attempts;
        }
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.gateway || !this.session || !('walletPublicKey' in this.session)) {
                throw new TonConnectError('Trying to send bridge request without session');
            }
            const id = (yield this.connectionStorage.getNextRpcRequestId()).toString();
            yield this.connectionStorage.increaseNextRpcRequestId();
            logDebug('Send http-bridge request:', Object.assign(Object.assign({}, request), { id }));
            const encodedRequest = this.session.sessionCrypto.encrypt(JSON.stringify(Object.assign(Object.assign({}, request), { id })), protocol.hexToByteArray(this.session.walletPublicKey));
            try {
                yield this.gateway.send(encodedRequest, this.session.walletPublicKey, request.method, { attempts: options === null || options === void 0 ? void 0 : options.attempts, signal: options === null || options === void 0 ? void 0 : options.signal });
                (_a = options === null || options === void 0 ? void 0 : options.onRequestSent) === null || _a === void 0 ? void 0 : _a.call(options);
                this.pendingRequests.set(id.toString(), resolve);
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    closeConnection() {
        this.closeGateways();
        this.listeners = [];
        this.session = null;
        this.gateway = null;
    }
    disconnect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let called = false;
                let timeoutId = null;
                const onRequestSent = () => {
                    if (!called) {
                        called = true;
                        this.removeBridgeAndSession().then(resolve);
                    }
                };
                try {
                    this.closeGateways();
                    const abortController = createAbortController(options === null || options === void 0 ? void 0 : options.signal);
                    timeoutId = setTimeout(() => {
                        abortController.abort();
                    }, this.defaultOpeningDeadlineMS);
                    yield this.sendRequest({ method: 'disconnect', params: [] }, {
                        onRequestSent: onRequestSent,
                        signal: abortController.signal,
                        attempts: 1
                    });
                }
                catch (e) {
                    logDebug('Disconnect error:', e);
                    if (!called) {
                        this.removeBridgeAndSession().then(resolve);
                    }
                }
                finally {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    onRequestSent();
                }
            }));
        });
    }
    listen(callback) {
        this.listeners.push(callback);
        return () => (this.listeners = this.listeners.filter(listener => listener !== callback));
    }
    pause() {
        var _a;
        (_a = this.gateway) === null || _a === void 0 ? void 0 : _a.pause();
        this.pendingGateways.forEach(bridge => bridge.pause());
    }
    unPause() {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = this.pendingGateways.map(bridge => bridge.unPause());
            if (this.gateway) {
                promises.push(this.gateway.unPause());
            }
            yield Promise.all(promises);
        });
    }
    pendingGatewaysListener(gateway, bridgeUrl, bridgeIncomingMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pendingGateways.includes(gateway)) {
                yield gateway.close();
                return;
            }
            this.closeGateways({ except: gateway });
            if (this.gateway) {
                logDebug('Gateway is already opened, closing previous gateway');
                yield this.gateway.close();
            }
            this.session.bridgeUrl = bridgeUrl;
            this.gateway = gateway;
            this.gateway.setErrorsListener(this.gatewayErrorsListener.bind(this));
            this.gateway.setListener(this.gatewayListener.bind(this));
            return this.gatewayListener(bridgeIncomingMessage);
        });
    }
    gatewayListener(bridgeIncomingMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletMessage = JSON.parse(this.session.sessionCrypto.decrypt(protocol.Base64.decode(bridgeIncomingMessage.message).toUint8Array(), protocol.hexToByteArray(bridgeIncomingMessage.from)));
            logDebug('Wallet message received:', walletMessage);
            if (!('event' in walletMessage)) {
                const id = walletMessage.id.toString();
                const resolve = this.pendingRequests.get(id);
                if (!resolve) {
                    logDebug(`Response id ${id} doesn't match any request's id`);
                    return;
                }
                resolve(walletMessage);
                this.pendingRequests.delete(id);
                return;
            }
            if (walletMessage.id !== undefined) {
                const lastId = yield this.connectionStorage.getLastWalletEventId();
                if (lastId !== undefined && walletMessage.id <= lastId) {
                    logError(`Received event id (=${walletMessage.id}) must be greater than stored last wallet event id (=${lastId}) `);
                    return;
                }
                if (walletMessage.event !== 'connect') {
                    yield this.connectionStorage.storeLastWalletEventId(walletMessage.id);
                }
            }
            // `this.listeners` might be modified in the event handler
            const listeners = this.listeners;
            if (walletMessage.event === 'connect') {
                yield this.updateSession(walletMessage, bridgeIncomingMessage.from);
            }
            if (walletMessage.event === 'disconnect') {
                logDebug(`Removing bridge and session: received disconnect event`);
                yield this.removeBridgeAndSession();
            }
            listeners.forEach(listener => listener(walletMessage));
        });
    }
    gatewayErrorsListener(e) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new TonConnectError(`Bridge error ${JSON.stringify(e)}`);
        });
    }
    updateSession(connectEvent, walletPublicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            this.session = Object.assign(Object.assign({}, this.session), { walletPublicKey });
            const tonAddrItem = connectEvent.payload.items.find(item => item.name === 'ton_addr');
            const connectEventToSave = Object.assign(Object.assign({}, connectEvent), { payload: Object.assign(Object.assign({}, connectEvent.payload), { items: [tonAddrItem] }) });
            yield this.connectionStorage.storeConnection({
                type: 'http',
                session: this.session,
                lastWalletEventId: connectEvent.id,
                connectEvent: connectEventToSave,
                nextRpcRequestId: 0
            });
        });
    }
    removeBridgeAndSession() {
        return __awaiter(this, void 0, void 0, function* () {
            this.closeConnection();
            yield this.connectionStorage.removeConnection();
        });
    }
    generateUniversalLink(universalLink, message) {
        if (isTelegramUrl(universalLink)) {
            return this.generateTGUniversalLink(universalLink, message);
        }
        return this.generateRegularUniversalLink(universalLink, message);
    }
    generateRegularUniversalLink(universalLink, message) {
        const url = new URL(universalLink);
        url.searchParams.append('v', PROTOCOL_VERSION.toString());
        url.searchParams.append('id', this.session.sessionCrypto.sessionId);
        url.searchParams.append('r', JSON.stringify(message));
        return url.toString();
    }
    generateTGUniversalLink(universalLink, message) {
        const urlToWrap = this.generateRegularUniversalLink('about:blank', message);
        const linkParams = urlToWrap.split('?')[1];
        const startapp = 'tonconnect-' + encodeTelegramUrlParameters(linkParams);
        // TODO: Remove this line after all dApps and the wallets-list.json have been updated
        const updatedUniversalLink = this.convertToDirectLink(universalLink);
        const url = new URL(updatedUniversalLink);
        url.searchParams.append('startapp', startapp);
        return url.toString();
    }
    // TODO: Remove this method after all dApps and the wallets-list.json have been updated
    convertToDirectLink(universalLink) {
        const url = new URL(universalLink);
        if (url.searchParams.has('attach')) {
            url.searchParams.delete('attach');
            url.pathname += '/start';
        }
        return url.toString();
    }
    openGateways(sessionCrypto, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(this.walletConnectionSource)) {
                // close all gateways before opening new ones
                this.pendingGateways.map(bridge => bridge.close().catch());
                // open new gateways
                this.pendingGateways = this.walletConnectionSource.map(source => {
                    const gateway = new BridgeGateway(this.storage, source.bridgeUrl, sessionCrypto.sessionId, () => { }, () => { });
                    gateway.setListener(message => this.pendingGatewaysListener(gateway, source.bridgeUrl, message));
                    return gateway;
                });
                yield Promise.allSettled(this.pendingGateways.map(bridge => callForSuccess((_options) => {
                    var _a;
                    if (!this.pendingGateways.some(item => item === bridge)) {
                        return bridge.close();
                    }
                    return bridge.registerSession({
                        openingDeadlineMS: (_a = options === null || options === void 0 ? void 0 : options.openingDeadlineMS) !== null && _a !== void 0 ? _a : this.defaultOpeningDeadlineMS,
                        signal: _options.signal
                    });
                }, {
                    attempts: Number.MAX_SAFE_INTEGER,
                    delayMs: this.defaultRetryTimeoutMS,
                    signal: options === null || options === void 0 ? void 0 : options.signal
                })));
                return;
            }
            else {
                if (this.gateway) {
                    logDebug(`Gateway is already opened, closing previous gateway`);
                    yield this.gateway.close();
                }
                this.gateway = new BridgeGateway(this.storage, this.walletConnectionSource.bridgeUrl, sessionCrypto.sessionId, this.gatewayListener.bind(this), this.gatewayErrorsListener.bind(this));
                return yield this.gateway.registerSession({
                    openingDeadlineMS: options === null || options === void 0 ? void 0 : options.openingDeadlineMS,
                    signal: options === null || options === void 0 ? void 0 : options.signal
                });
            }
        });
    }
    closeGateways(options) {
        var _a;
        (_a = this.gateway) === null || _a === void 0 ? void 0 : _a.close();
        this.pendingGateways
            .filter(item => item !== (options === null || options === void 0 ? void 0 : options.except))
            .forEach(bridge => bridge.close());
        this.pendingGateways = [];
    }
}

function hasProperty(value, propertyKey) {
    return hasProperties(value, [propertyKey]);
}
function hasProperties(value, propertyKeys) {
    if (!value || typeof value !== 'object') {
        return false;
    }
    return propertyKeys.every(propertyKey => propertyKey in value);
}

function isJSBridgeWithMetadata(value) {
    try {
        if (!hasProperty(value, 'tonconnect') || !hasProperty(value.tonconnect, 'walletInfo')) {
            return false;
        }
        return hasProperties(value.tonconnect.walletInfo, [
            'name',
            'app_name',
            'image',
            'about_url',
            'platforms'
        ]);
    }
    catch (_a) {
        return false;
    }
}

/**
 * In memory storage like localStorage, but without persistence.
 * Uses as a fallback for localStorage in Safari's private mode.
 */
class InMemoryStorage {
    constructor() {
        this.storage = {};
    }
    static getInstance() {
        if (!InMemoryStorage.instance) {
            InMemoryStorage.instance = new InMemoryStorage();
        }
        return InMemoryStorage.instance;
    }
    get length() {
        return Object.keys(this.storage).length;
    }
    clear() {
        this.storage = {};
    }
    getItem(key) {
        var _a;
        return (_a = this.storage[key]) !== null && _a !== void 0 ? _a : null;
    }
    key(index) {
        var _a;
        const keys = Object.keys(this.storage);
        if (index < 0 || index >= keys.length) {
            return null;
        }
        return (_a = keys[index]) !== null && _a !== void 0 ? _a : null;
    }
    removeItem(key) {
        delete this.storage[key];
    }
    setItem(key, value) {
        this.storage[key] = value;
    }
}

function getWindow() {
    if (typeof window === 'undefined') {
        return undefined;
    }
    return window;
}
/**
 * The function try to get window keys, if it is not available it returns empty array.
 * As an example, for Safari's private mode it returns empty array, because the browser does not allow to get window keys.
 */
function tryGetWindowKeys() {
    const window = getWindow();
    if (!window) {
        return [];
    }
    try {
        return Object.keys(window);
    }
    catch (_a) {
        return [];
    }
}
function getDocument() {
    if (typeof document === 'undefined') {
        return undefined;
    }
    return document;
}
function getWebPageManifest() {
    var _a;
    const origin = (_a = getWindow()) === null || _a === void 0 ? void 0 : _a.location.origin;
    if (origin) {
        return origin + '/tonconnect-manifest.json';
    }
    return '';
}
/**
 * Returns `localStorage` if it is available. In Safari's private mode, it returns `InMemoryStorage`. In Node.js, it throws an error.
 */
function tryGetLocalStorage() {
    if (isLocalStorageAvailable()) {
        return localStorage;
    }
    if (isNodeJs()) {
        throw new TonConnectError('`localStorage` is unavailable, but it is required for TonConnect. For more details, see https://github.com/ton-connect/sdk/tree/main/packages/sdk#init-connector');
    }
    return InMemoryStorage.getInstance();
}
/**
 * Checks if `localStorage` is available.
 */
function isLocalStorageAvailable() {
    // We use a try/catch block because Safari's private mode throws an error when attempting to access localStorage.
    try {
        return typeof localStorage !== 'undefined';
    }
    catch (_a) {
        return false;
    }
}
/**
 * Checks if the environment is Node.js.
 */
function isNodeJs() {
    return (typeof process !== 'undefined' && process.versions != null && process.versions.node != null);
}

class InjectedProvider {
    constructor(storage, injectedWalletKey) {
        this.injectedWalletKey = injectedWalletKey;
        this.type = 'injected';
        this.unsubscribeCallback = null;
        this.listenSubscriptions = false;
        this.listeners = [];
        const window = InjectedProvider.window;
        if (!InjectedProvider.isWindowContainsWallet(window, injectedWalletKey)) {
            throw new WalletNotInjectedError();
        }
        this.connectionStorage = new BridgeConnectionStorage(storage);
        this.injectedWallet = window[injectedWalletKey].tonconnect;
    }
    static fromStorage(storage) {
        return __awaiter(this, void 0, void 0, function* () {
            const bridgeConnectionStorage = new BridgeConnectionStorage(storage);
            const connection = yield bridgeConnectionStorage.getInjectedConnection();
            return new InjectedProvider(storage, connection.jsBridgeKey);
        });
    }
    static isWalletInjected(injectedWalletKey) {
        return InjectedProvider.isWindowContainsWallet(this.window, injectedWalletKey);
    }
    static isInsideWalletBrowser(injectedWalletKey) {
        if (InjectedProvider.isWindowContainsWallet(this.window, injectedWalletKey)) {
            return this.window[injectedWalletKey].tonconnect.isWalletBrowser;
        }
        return false;
    }
    static getCurrentlyInjectedWallets() {
        if (!this.window) {
            return [];
        }
        const windowKeys = tryGetWindowKeys();
        const wallets = windowKeys.filter(([_, value]) => isJSBridgeWithMetadata(value));
        return wallets.map(([jsBridgeKey, wallet]) => ({
            name: wallet.tonconnect.walletInfo.name,
            appName: wallet.tonconnect.walletInfo.app_name,
            aboutUrl: wallet.tonconnect.walletInfo.about_url,
            imageUrl: wallet.tonconnect.walletInfo.image,
            tondns: wallet.tonconnect.walletInfo.tondns,
            jsBridgeKey,
            injected: true,
            embedded: wallet.tonconnect.isWalletBrowser,
            platforms: wallet.tonconnect.walletInfo.platforms
        }));
    }
    static isWindowContainsWallet(window, injectedWalletKey) {
        return (!!window &&
            injectedWalletKey in window &&
            typeof window[injectedWalletKey] === 'object' &&
            'tonconnect' in window[injectedWalletKey]);
    }
    connect(message) {
        this._connect(PROTOCOL_VERSION, message);
    }
    restoreConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logDebug(`Injected Provider restoring connection...`);
                const connectEvent = yield this.injectedWallet.restoreConnection();
                logDebug('Injected Provider restoring connection response', connectEvent);
                if (connectEvent.event === 'connect') {
                    this.makeSubscriptions();
                    this.listeners.forEach(listener => listener(connectEvent));
                }
                else {
                    yield this.connectionStorage.removeConnection();
                }
            }
            catch (e) {
                yield this.connectionStorage.removeConnection();
                console.error(e);
            }
        });
    }
    closeConnection() {
        if (this.listenSubscriptions) {
            this.injectedWallet.disconnect();
        }
        this.closeAllListeners();
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                const onRequestSent = () => {
                    this.closeAllListeners();
                    this.connectionStorage.removeConnection().then(resolve);
                };
                try {
                    this.injectedWallet.disconnect();
                    onRequestSent();
                }
                catch (e) {
                    logDebug(e);
                    this.sendRequest({
                        method: 'disconnect',
                        params: []
                    }, onRequestSent);
                }
            });
        });
    }
    closeAllListeners() {
        var _a;
        this.listenSubscriptions = false;
        this.listeners = [];
        (_a = this.unsubscribeCallback) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    listen(eventsCallback) {
        this.listeners.push(eventsCallback);
        return () => (this.listeners = this.listeners.filter(listener => listener !== eventsCallback));
    }
    sendRequest(request, optionsOrOnRequestSent) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: remove deprecated method
            const options = {};
            if (typeof optionsOrOnRequestSent === 'function') {
                options.onRequestSent = optionsOrOnRequestSent;
            }
            else {
                options.onRequestSent = optionsOrOnRequestSent === null || optionsOrOnRequestSent === void 0 ? void 0 : optionsOrOnRequestSent.onRequestSent;
                options.signal = optionsOrOnRequestSent === null || optionsOrOnRequestSent === void 0 ? void 0 : optionsOrOnRequestSent.signal;
            }
            const id = (yield this.connectionStorage.getNextRpcRequestId()).toString();
            yield this.connectionStorage.increaseNextRpcRequestId();
            logDebug('Send injected-bridge request:', Object.assign(Object.assign({}, request), { id }));
            const result = this.injectedWallet.send(Object.assign(Object.assign({}, request), { id }));
            result.then(response => logDebug('Wallet message received:', response));
            (_a = options === null || options === void 0 ? void 0 : options.onRequestSent) === null || _a === void 0 ? void 0 : _a.call(options);
            return result;
        });
    }
    _connect(protocolVersion, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logDebug(`Injected Provider connect request: protocolVersion: ${protocolVersion}, message:`, message);
                const connectEvent = yield this.injectedWallet.connect(protocolVersion, message);
                logDebug('Injected Provider connect response:', connectEvent);
                if (connectEvent.event === 'connect') {
                    yield this.updateSession();
                    this.makeSubscriptions();
                }
                this.listeners.forEach(listener => listener(connectEvent));
            }
            catch (e) {
                logDebug('Injected Provider connect error:', e);
                const connectEventError = {
                    event: 'connect_error',
                    payload: {
                        code: 0,
                        message: e === null || e === void 0 ? void 0 : e.toString()
                    }
                };
                this.listeners.forEach(listener => listener(connectEventError));
            }
        });
    }
    makeSubscriptions() {
        this.listenSubscriptions = true;
        this.unsubscribeCallback = this.injectedWallet.listen(e => {
            logDebug('Wallet message received:', e);
            if (this.listenSubscriptions) {
                this.listeners.forEach(listener => listener(e));
            }
            if (e.event === 'disconnect') {
                this.disconnect();
            }
        });
    }
    updateSession() {
        return this.connectionStorage.storeConnection({
            type: 'injected',
            jsBridgeKey: this.injectedWalletKey,
            nextRpcRequestId: 0
        });
    }
}
InjectedProvider.window = getWindow();

/**
 * Default storage to save protocol data, uses `localStorage` if it is available. In Safari's private mode, it uses `InMemoryStorage`. In Node.js, it throws an error.
 */
class DefaultStorage {
    constructor() {
        this.localStorage = tryGetLocalStorage();
    }
    getItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.localStorage.getItem(key);
        });
    }
    removeItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.localStorage.removeItem(key);
        });
    }
    setItem(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.localStorage.setItem(key, value);
        });
    }
}

/**
 * Checks if `WalletInfo` is `WalletInfoInjectable` and `WalletInfo` is injected to the current webpage (`walletInfo.injected === true`).
 * @param value WalletInfo to check.
 */
function isWalletInfoCurrentlyInjected(value) {
    return isWalletInfoInjectable(value) && value.injected;
}
/**
 * Checks if `WalletInfo` is `WalletInfoInjectable` and dApp is opened inside this wallet's browser.
 * @param value WalletInfo to check.
 */
function isWalletInfoCurrentlyEmbedded(value) {
    return isWalletInfoCurrentlyInjected(value) && value.embedded;
}
/**
 * Checks if `WalletInfo` is `WalletInfoInjected`, but doesn't check if it is injected to the page or not.
 * @param value WalletInfo to check.
 */
function isWalletInfoInjectable(value) {
    return 'jsBridgeKey' in value;
}
/**
 * Checks if `WalletInfo` is `WalletInfoRemote`.
 * @param value WalletInfo to check.
 */
function isWalletInfoRemote(value) {
    return 'bridgeUrl' in value;
}
/**
 * @deprecated use `isWalletInfoInjectable` or `isWalletInfoCurrentlyInjected` instead.
 * @param value WalletInfo to check.
 */
function isWalletInfoInjected(value) {
    return 'jsBridgeKey' in value;
}

const FALLBACK_WALLETS_LIST = [
    {
        app_name: 'telegram-wallet',
        name: 'Wallet',
        image: 'https://wallet.tg/images/logo-288.png',
        about_url: 'https://wallet.tg/',
        universal_url: 'https://t.me/wallet?attach=wallet',
        bridge: [
            {
                type: 'sse',
                url: 'https://walletbot.me/tonconnect-bridge/bridge'
            }
        ],
        platforms: ['ios', 'android', 'macos', 'windows', 'linux']
    },
    {
        app_name: 'tonkeeper',
        name: 'Tonkeeper',
        image: 'https://tonkeeper.com/assets/tonconnect-icon.png',
        tondns: 'tonkeeper.ton',
        about_url: 'https://tonkeeper.com',
        universal_url: 'https://app.tonkeeper.com/ton-connect',
        deepLink: 'tonkeeper-tc://',
        bridge: [
            {
                type: 'sse',
                url: 'https://bridge.tonapi.io/bridge'
            },
            {
                type: 'js',
                key: 'tonkeeper'
            }
        ],
        platforms: ['ios', 'android', 'chrome', 'firefox', 'macos']
    },
    {
        app_name: 'mytonwallet',
        name: 'MyTonWallet',
        image: 'https://static.mytonwallet.io/icon-256.png',
        about_url: 'https://mytonwallet.io',
        universal_url: 'https://connect.mytonwallet.org',
        bridge: [
            {
                type: 'js',
                key: 'mytonwallet'
            },
            {
                type: 'sse',
                url: 'https://tonconnectbridge.mytonwallet.org/bridge/'
            }
        ],
        platforms: ['chrome', 'windows', 'macos', 'linux', 'ios', 'android', 'firefox']
    },
    {
        app_name: 'tonhub',
        name: 'Tonhub',
        image: 'https://tonhub.com/tonconnect_logo.png',
        about_url: 'https://tonhub.com',
        universal_url: 'https://tonhub.com/ton-connect',
        bridge: [
            {
                type: 'js',
                key: 'tonhub'
            },
            {
                type: 'sse',
                url: 'https://connect.tonhubapi.com/tonconnect'
            }
        ],
        platforms: ['ios', 'android']
    },
    {
        app_name: 'bitgetTonWallet',
        name: 'Bitget Wallet',
        image: 'https://raw.githubusercontent.com/bitgetwallet/download/refs/heads/main/logo/png/bitget_wallet_logo_288_mini.png',
        about_url: 'https://web3.bitget.com',
        deepLink: 'bitkeep://',
        bridge: [
            {
                type: 'js',
                key: 'bitgetTonWallet'
            },
            {
                type: 'sse',
                url: 'https://ton-connect-bridge.bgwapi.io/bridge'
            }
        ],
        platforms: ['ios', 'android', 'chrome'],
        universal_url: 'https://bkcode.vip/ton-connect'
    },
    {
        app_name: 'okxMiniWallet',
        name: 'OKX Mini Wallet',
        image: 'https://static.okx.com/cdn/assets/imgs/2411/8BE1A4A434D8F58A.png',
        about_url: 'https://www.okx.com/web3',
        universal_url: 'https://t.me/OKX_WALLET_BOT?attach=wallet',
        bridge: [
            {
                type: 'sse',
                url: 'https://www.okx.com/tonbridge/discover/rpc/bridge'
            }
        ],
        platforms: ['ios', 'android', 'macos', 'windows', 'linux']
    },
    {
        app_name: 'binanceWeb3TonWallet',
        name: 'Binance Web3 Wallet',
        image: 'https://public.bnbstatic.com/static/binance-w3w/ton-provider/binancew3w.png',
        about_url: 'https://www.binance.com/en/web3wallet',
        deepLink: 'bnc://app.binance.com/cedefi/ton-connect',
        bridge: [
            {
                type: 'js',
                key: 'binancew3w'
            },
            {
                type: 'sse',
                url: 'https://wallet.binance.com/tonbridge/bridge'
            }
        ],
        platforms: ['ios', 'android', 'macos', 'windows', 'linux'],
        universal_url: 'https://app.binance.com/cedefi/ton-connect'
    },
    {
        app_name: 'fintopio-tg',
        name: 'Fintopio',
        image: 'https://fintopio.com/tonconnect-icon.png',
        about_url: 'https://fintopio.com',
        universal_url: 'https://t.me/fintopio?attach=wallet',
        bridge: [
            {
                type: 'sse',
                url: 'https://wallet-bridge.fintopio.com/bridge'
            }
        ],
        platforms: ['ios', 'android', 'macos', 'windows', 'linux']
    },
    {
        app_name: 'okxTonWallet',
        name: 'OKX Wallet',
        image: 'https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png',
        about_url: 'https://www.okx.com/web3',
        universal_url: 'https://www.okx.com/download?appendQuery=true&deeplink=okx://web3/wallet/tonconnect',
        bridge: [
            {
                type: 'js',
                key: 'okxTonWallet'
            },
            {
                type: 'sse',
                url: 'https://www.okx.com/tonbridge/discover/rpc/bridge'
            }
        ],
        platforms: ['chrome', 'safari', 'firefox', 'ios', 'android']
    },
    {
        app_name: 'hot',
        name: 'HOT',
        image: 'https://raw.githubusercontent.com/hot-dao/media/main/logo.png',
        about_url: 'https://hot-labs.org/',
        universal_url: 'https://t.me/herewalletbot?attach=wallet',
        bridge: [
            {
                type: 'sse',
                url: 'https://sse-bridge.hot-labs.org'
            },
            {
                type: 'js',
                key: 'hotWallet'
            }
        ],
        platforms: ['ios', 'android', 'macos', 'windows', 'linux']
    },
    {
        app_name: 'bybitTonWallet',
        name: 'Bybit Wallet',
        image: 'https://raw.githubusercontent.com/bybit-web3/bybit-web3.github.io/main/docs/images/bybit-logo.png',
        about_url: 'https://www.bybit.com/web3',
        universal_url: 'https://app.bybit.com/ton-connect',
        deepLink: 'bybitapp://',
        bridge: [
            {
                type: 'js',
                key: 'bybitTonWallet'
            },
            {
                type: 'sse',
                url: 'https://api-node.bybit.com/spot/api/web3/bridge/ton/bridge'
            }
        ],
        platforms: ['ios', 'android', 'chrome']
    },
    {
        app_name: 'dewallet',
        name: 'DeWallet',
        image: 'https://raw.githubusercontent.com/delab-team/manifests-images/main/WalletAvatar.png',
        about_url: 'https://delabwallet.com',
        universal_url: 'https://t.me/dewallet?attach=wallet',
        bridge: [
            {
                type: 'sse',
                url: 'https://bridge.dewallet.pro/bridge'
            }
        ],
        platforms: ['ios', 'android', 'macos', 'windows', 'linux']
    },
    {
        app_name: 'safepalwallet',
        name: 'SafePal',
        image: 'https://s.pvcliping.com/web/public_image/SafePal_x288.png',
        tondns: '',
        about_url: 'https://www.safepal.com',
        universal_url: 'https://link.safepal.io/ton-connect',
        deepLink: 'safepal-tc://',
        bridge: [
            {
                type: 'sse',
                url: 'https://ton-bridge.safepal.com/tonbridge/v1/bridge'
            },
            {
                type: 'js',
                key: 'safepalwallet'
            }
        ],
        platforms: ['ios', 'android', 'chrome', 'firefox']
    },
    {
        app_name: 'GateWallet',
        name: 'GateWallet',
        image: 'https://img.gatedataimg.com/prd-ordinal-imgs/036f07bb8730716e/gateio-0925.png',
        about_url: 'https://www.gate.io/',
        bridge: [
            {
                type: 'js',
                key: 'gatetonwallet'
            },
            {
                type: 'sse',
                url: 'https://dapp.gateio.services/tonbridge_api/bridge/v1'
            }
        ],
        platforms: ['ios', 'android'],
        universal_url: 'https://gateio.go.link/gateio/web3?adj_t=1ff8khdw_1fu4ccc7'
    },
    {
        app_name: 'openmask',
        name: 'OpenMask',
        image: 'https://raw.githubusercontent.com/OpenProduct/openmask-extension/main/public/openmask-logo-288.png',
        about_url: 'https://www.openmask.app/',
        bridge: [
            {
                type: 'js',
                key: 'openmask'
            }
        ],
        platforms: ['chrome']
    },
    {
        app_name: 'BitgetWeb3',
        name: 'BitgetWeb3',
        image: 'https://img.bitgetimg.com/image/third/1731638059795.png',
        about_url: '​https://www.bitget.com',
        universal_url: 'https://t.me/BitgetOfficialBot?attach=wallet',
        bridge: [
            {
                type: 'sse',
                url: 'https://ton-connect-bridge.bgwapi.io/bridge'
            }
        ],
        platforms: ['ios', 'android', 'windows', 'macos', 'linux']
    },
    {
        app_name: 'tobi',
        name: 'Tobi',
        image: 'https://app.tobiwallet.app/icons/logo-288.png',
        about_url: 'https://tobi.fun',
        universal_url: 'https://t.me/TobiCopilotBot?attach=wallet',
        bridge: [
            {
                type: 'sse',
                url: 'https://ton-bridge.tobiwallet.app/bridge'
            }
        ],
        platforms: ['ios', 'android', 'macos', 'windows', 'linux']
    },
    {
        app_name: 'xtonwallet',
        name: 'XTONWallet',
        image: 'https://xtonwallet.com/assets/img/icon-256-back.png',
        about_url: 'https://xtonwallet.com',
        bridge: [
            {
                type: 'js',
                key: 'xtonwallet'
            }
        ],
        platforms: ['chrome', 'firefox']
    },
    {
        app_name: 'tonwallet',
        name: 'TON Wallet',
        image: 'https://wallet.ton.org/assets/ui/qr-logo.png',
        about_url: 'https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd',
        bridge: [
            {
                type: 'js',
                key: 'tonwallet'
            }
        ],
        platforms: ['chrome']
    }
];

class WalletsListManager {
    constructor(options) {
        this.walletsListCache = null;
        this.walletsListCacheCreationTimestamp = null;
        this.walletsListSource = 'https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json';
        if (options === null || options === void 0 ? void 0 : options.walletsListSource) {
            this.walletsListSource = options.walletsListSource;
        }
        if (options === null || options === void 0 ? void 0 : options.cacheTTLMs) {
            this.cacheTTLMs = options.cacheTTLMs;
        }
    }
    getWallets() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cacheTTLMs &&
                this.walletsListCacheCreationTimestamp &&
                Date.now() > this.walletsListCacheCreationTimestamp + this.cacheTTLMs) {
                this.walletsListCache = null;
            }
            if (!this.walletsListCache) {
                this.walletsListCache = this.fetchWalletsList();
                this.walletsListCache
                    .then(() => {
                    this.walletsListCacheCreationTimestamp = Date.now();
                })
                    .catch(() => {
                    this.walletsListCache = null;
                    this.walletsListCacheCreationTimestamp = null;
                });
            }
            return this.walletsListCache;
        });
    }
    getEmbeddedWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            const walletsList = yield this.getWallets();
            const embeddedWallets = walletsList.filter(isWalletInfoCurrentlyEmbedded);
            if (embeddedWallets.length !== 1) {
                return null;
            }
            return embeddedWallets[0];
        });
    }
    fetchWalletsList() {
        return __awaiter(this, void 0, void 0, function* () {
            let walletsList = [];
            try {
                const walletsResponse = yield fetch(this.walletsListSource);
                walletsList = yield walletsResponse.json();
                if (!Array.isArray(walletsList)) {
                    throw new FetchWalletsError('Wrong wallets list format, wallets list must be an array.');
                }
                const wrongFormatWallets = walletsList.filter(wallet => !this.isCorrectWalletConfigDTO(wallet));
                if (wrongFormatWallets.length) {
                    logError(`Wallet(s) ${wrongFormatWallets
                        .map(wallet => wallet.name)
                        .join(', ')} config format is wrong. They were removed from the wallets list.`);
                    walletsList = walletsList.filter(wallet => this.isCorrectWalletConfigDTO(wallet));
                }
            }
            catch (e) {
                logError(e);
                walletsList = FALLBACK_WALLETS_LIST;
            }
            let currentlyInjectedWallets = [];
            try {
                currentlyInjectedWallets = InjectedProvider.getCurrentlyInjectedWallets();
            }
            catch (e) {
                logError(e);
            }
            return this.mergeWalletsLists(this.walletConfigDTOListToWalletConfigList(walletsList), currentlyInjectedWallets);
        });
    }
    walletConfigDTOListToWalletConfigList(walletConfigDTO) {
        return walletConfigDTO.map(walletConfigDTO => {
            const walletConfigBase = {
                name: walletConfigDTO.name,
                appName: walletConfigDTO.app_name,
                imageUrl: walletConfigDTO.image,
                aboutUrl: walletConfigDTO.about_url,
                tondns: walletConfigDTO.tondns,
                platforms: walletConfigDTO.platforms
            };
            const walletConfig = walletConfigBase;
            walletConfigDTO.bridge.forEach(bridge => {
                if (bridge.type === 'sse') {
                    walletConfig.bridgeUrl = bridge.url;
                    walletConfig.universalLink =
                        walletConfigDTO.universal_url;
                    walletConfig.deepLink = walletConfigDTO.deepLink;
                }
                if (bridge.type === 'js') {
                    const jsBridgeKey = bridge.key;
                    walletConfig.jsBridgeKey = jsBridgeKey;
                    walletConfig.injected =
                        InjectedProvider.isWalletInjected(jsBridgeKey);
                    walletConfig.embedded =
                        InjectedProvider.isInsideWalletBrowser(jsBridgeKey);
                }
            });
            return walletConfig;
        });
    }
    mergeWalletsLists(list1, list2) {
        const names = new Set(list1.concat(list2).map(item => item.name));
        return [...names.values()].map(name => {
            const list1Item = list1.find(item => item.name === name);
            const list2Item = list2.find(item => item.name === name);
            return Object.assign(Object.assign({}, (list1Item && Object.assign({}, list1Item))), (list2Item && Object.assign({}, list2Item)));
        });
    }
    // eslint-disable-next-line complexity
    isCorrectWalletConfigDTO(value) {
        if (!value || !(typeof value === 'object')) {
            return false;
        }
        const containsName = 'name' in value;
        const containsAppName = 'app_name' in value;
        const containsImage = 'image' in value;
        const containsAbout = 'about_url' in value;
        const containsPlatforms = 'platforms' in value;
        if (!containsName ||
            !containsImage ||
            !containsAbout ||
            !containsPlatforms ||
            !containsAppName) {
            return false;
        }
        if (!value.platforms ||
            !Array.isArray(value.platforms) ||
            !value.platforms.length) {
            return false;
        }
        if (!('bridge' in value) ||
            !Array.isArray(value.bridge) ||
            !value.bridge.length) {
            return false;
        }
        const bridge = value.bridge;
        if (bridge.some(item => !item || typeof item !== 'object' || !('type' in item))) {
            return false;
        }
        const sseBridge = bridge.find(item => item.type === 'sse');
        if (sseBridge) {
            if (!('url' in sseBridge) ||
                !sseBridge.url ||
                !value.universal_url) {
                return false;
            }
        }
        const jsBridge = bridge.find(item => item.type === 'js');
        if (jsBridge) {
            if (!('key' in jsBridge) || !jsBridge.key) {
                return false;
            }
        }
        return true;
    }
}

/**
 * Thrown when wallet doesn't support requested feature method.
 */
class WalletNotSupportFeatureError extends TonConnectError {
    get info() {
        return "Wallet doesn't support requested feature method.";
    }
    constructor(...args) {
        super(...args);
        Object.setPrototypeOf(this, WalletNotSupportFeatureError.prototype);
    }
}

function checkSendTransactionSupport(features, options) {
    const supportsDeprecatedSendTransactionFeature = features.includes('SendTransaction');
    const sendTransactionFeature = features.find(feature => feature && typeof feature === 'object' && feature.name === 'SendTransaction');
    if (!supportsDeprecatedSendTransactionFeature && !sendTransactionFeature) {
        throw new WalletNotSupportFeatureError("Wallet doesn't support SendTransaction feature.");
    }
    if (sendTransactionFeature && sendTransactionFeature.maxMessages !== undefined) {
        if (sendTransactionFeature.maxMessages < options.requiredMessagesNumber) {
            throw new WalletNotSupportFeatureError(`Wallet is not able to handle such SendTransaction request. Max support messages number is ${sendTransactionFeature.maxMessages}, but ${options.requiredMessagesNumber} is required.`);
        }
        return;
    }
    logWarning("Connected wallet didn't provide information about max allowed messages in the SendTransaction request. Request may be rejected by the wallet.");
}

/**
 * Create a request version event.
 */
function createRequestVersionEvent() {
    return {
        type: 'request-version'
    };
}
/**
 * Create a response version event.
 * @param version
 */
function createResponseVersionEvent(version) {
    return {
        type: 'response-version',
        version: version
    };
}
/**
 * Create a version info.
 * @param version
 */
function createVersionInfo(version) {
    return {
        ton_connect_sdk_lib: version.ton_connect_sdk_lib,
        ton_connect_ui_lib: version.ton_connect_ui_lib
    };
}
function createConnectionInfo(version, wallet) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const isTonProof = ((_a = wallet === null || wallet === void 0 ? void 0 : wallet.connectItems) === null || _a === void 0 ? void 0 : _a.tonProof) && 'proof' in wallet.connectItems.tonProof;
    const authType = isTonProof ? 'ton_proof' : 'ton_addr';
    return {
        wallet_address: (_c = (_b = wallet === null || wallet === void 0 ? void 0 : wallet.account) === null || _b === void 0 ? void 0 : _b.address) !== null && _c !== void 0 ? _c : null,
        wallet_type: (_d = wallet === null || wallet === void 0 ? void 0 : wallet.device.appName) !== null && _d !== void 0 ? _d : null,
        wallet_version: (_e = wallet === null || wallet === void 0 ? void 0 : wallet.device.appVersion) !== null && _e !== void 0 ? _e : null,
        auth_type: authType,
        custom_data: Object.assign({ chain_id: (_g = (_f = wallet === null || wallet === void 0 ? void 0 : wallet.account) === null || _f === void 0 ? void 0 : _f.chain) !== null && _g !== void 0 ? _g : null, provider: (_h = wallet === null || wallet === void 0 ? void 0 : wallet.provider) !== null && _h !== void 0 ? _h : null }, createVersionInfo(version))
    };
}
/**
 * Create a connection init event.
 */
function createConnectionStartedEvent(version) {
    return {
        type: 'connection-started',
        custom_data: createVersionInfo(version)
    };
}
/**
 * Create a connection completed event.
 * @param version
 * @param wallet
 */
function createConnectionCompletedEvent(version, wallet) {
    return Object.assign({ type: 'connection-completed', is_success: true }, createConnectionInfo(version, wallet));
}
/**
 * Create a connection error event.
 * @param version
 * @param error_message
 * @param errorCode
 */
function createConnectionErrorEvent(version, error_message, errorCode) {
    return {
        type: 'connection-error',
        is_success: false,
        error_message: error_message,
        error_code: errorCode !== null && errorCode !== void 0 ? errorCode : null,
        custom_data: createVersionInfo(version)
    };
}
/**
 * Create a connection restoring started event.
 */
function createConnectionRestoringStartedEvent(version) {
    return {
        type: 'connection-restoring-started',
        custom_data: createVersionInfo(version)
    };
}
/**
 * Create a connection restoring completed event.
 * @param version
 * @param wallet
 */
function createConnectionRestoringCompletedEvent(version, wallet) {
    return Object.assign({ type: 'connection-restoring-completed', is_success: true }, createConnectionInfo(version, wallet));
}
/**
 * Create a connection restoring error event.
 * @param version
 * @param errorMessage
 */
function createConnectionRestoringErrorEvent(version, errorMessage) {
    return {
        type: 'connection-restoring-error',
        is_success: false,
        error_message: errorMessage,
        custom_data: createVersionInfo(version)
    };
}
function createTransactionInfo(wallet, transaction) {
    var _a, _b, _c, _d;
    return {
        valid_until: (_a = String(transaction.validUntil)) !== null && _a !== void 0 ? _a : null,
        from: (_d = (_b = transaction.from) !== null && _b !== void 0 ? _b : (_c = wallet === null || wallet === void 0 ? void 0 : wallet.account) === null || _c === void 0 ? void 0 : _c.address) !== null && _d !== void 0 ? _d : null,
        messages: transaction.messages.map(message => {
            var _a, _b;
            return ({
                address: (_a = message.address) !== null && _a !== void 0 ? _a : null,
                amount: (_b = message.amount) !== null && _b !== void 0 ? _b : null
            });
        })
    };
}
/**
 * Create a transaction init event.
 * @param version
 * @param wallet
 * @param transaction
 */
function createTransactionSentForSignatureEvent(version, wallet, transaction) {
    return Object.assign(Object.assign({ type: 'transaction-sent-for-signature' }, createConnectionInfo(version, wallet)), createTransactionInfo(wallet, transaction));
}
/**
 * Create a transaction signed event.
 * @param version
 * @param wallet
 * @param transaction
 * @param signedTransaction
 */
function createTransactionSignedEvent(version, wallet, transaction, signedTransaction) {
    return Object.assign(Object.assign({ type: 'transaction-signed', is_success: true, signed_transaction: signedTransaction.boc }, createConnectionInfo(version, wallet)), createTransactionInfo(wallet, transaction));
}
/**
 * Create a transaction error event.
 * @param version
 * @param wallet
 * @param transaction
 * @param errorMessage
 * @param errorCode
 */
function createTransactionSigningFailedEvent(version, wallet, transaction, errorMessage, errorCode) {
    return Object.assign(Object.assign({ type: 'transaction-signing-failed', is_success: false, error_message: errorMessage, error_code: errorCode !== null && errorCode !== void 0 ? errorCode : null }, createConnectionInfo(version, wallet)), createTransactionInfo(wallet, transaction));
}
/**
 * Create a disconnect event.
 * @param version
 * @param wallet
 * @param scope
 * @returns
 */
function createDisconnectionEvent(version, wallet, scope) {
    return Object.assign({ type: 'disconnection', scope: scope }, createConnectionInfo(version, wallet));
}

/**
 * A concrete implementation of EventDispatcher that dispatches events to the browser window.
 */
class BrowserEventDispatcher {
    constructor() {
        /**
         * The window object, possibly undefined in a server environment.
         * @private
         */
        this.window = getWindow();
    }
    /**
     * Dispatches an event with the given name and details to the browser window.
     * @param eventName - The name of the event to dispatch.
     * @param eventDetails - The details of the event to dispatch.
     * @returns A promise that resolves when the event has been dispatched.
     */
    dispatchEvent(eventName, eventDetails) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const event = new CustomEvent(eventName, { detail: eventDetails });
            (_a = this.window) === null || _a === void 0 ? void 0 : _a.dispatchEvent(event);
        });
    }
    /**
     * Adds an event listener to the browser window.
     * @param eventName - The name of the event to listen for.
     * @param listener - The listener to add.
     * @param options - The options for the listener.
     * @returns A function that removes the listener.
     */
    addEventListener(eventName, listener, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.window) === null || _a === void 0 ? void 0 : _a.addEventListener(eventName, listener, options);
            return () => {
                var _a;
                return (_a = this.window) === null || _a === void 0 ? void 0 : _a.removeEventListener(eventName, listener);
            };
        });
    }
}

/**
 * Tracker for TonConnect user actions, such as transaction signing, connection, etc.
 *
 * List of events:
 *  * `connection-started`: when a user starts connecting a wallet.
 *  * `connection-completed`: when a user successfully connected a wallet.
 *  * `connection-error`: when a user cancels a connection or there is an error during the connection process.
 *  * `connection-restoring-started`: when the dApp starts restoring a connection.
 *  * `connection-restoring-completed`: when the dApp successfully restores a connection.
 *  * `connection-restoring-error`: when the dApp fails to restore a connection.
 *  * `disconnection`: when a user starts disconnecting a wallet.
 *  * `transaction-sent-for-signature`: when a user sends a transaction for signature.
 *  * `transaction-signed`: when a user successfully signs a transaction.
 *  * `transaction-signing-failed`: when a user cancels transaction signing or there is an error during the signing process.
 *
 * If you want to track user actions, you can subscribe to the window events with prefix `ton-connect-`:
 *
 * @example
 * window.addEventListener('ton-connect-transaction-sent-for-signature', (event) => {
 *    console.log('Transaction init', event.detail);
 * });
 *
 * @internal
 */
class TonConnectTracker {
    constructor(options) {
        var _a;
        /**
         * Event prefix for user actions.
         * @private
         */
        this.eventPrefix = 'ton-connect-';
        /**
         * TonConnect UI version.
         */
        this.tonConnectUiVersion = null;
        this.eventDispatcher = (_a = options === null || options === void 0 ? void 0 : options.eventDispatcher) !== null && _a !== void 0 ? _a : new BrowserEventDispatcher();
        this.tonConnectSdkVersion = options.tonConnectSdkVersion;
        this.init().catch();
    }
    /**
     * Version of the library.
     */
    get version() {
        return createVersionInfo({
            ton_connect_sdk_lib: this.tonConnectSdkVersion,
            ton_connect_ui_lib: this.tonConnectUiVersion
        });
    }
    /**
     * Called once when the tracker is created and request version other libraries.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.setRequestVersionHandler();
                this.tonConnectUiVersion = yield this.requestTonConnectUiVersion();
            }
            catch (e) { }
        });
    }
    /**
     * Set request version handler.
     * @private
     */
    setRequestVersionHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.eventDispatcher.addEventListener('ton-connect-request-version', () => __awaiter(this, void 0, void 0, function* () {
                yield this.eventDispatcher.dispatchEvent('ton-connect-response-version', createResponseVersionEvent(this.tonConnectSdkVersion));
            }));
        });
    }
    /**
     * Request TonConnect UI version.
     * @private
     */
    requestTonConnectUiVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.eventDispatcher.addEventListener('ton-connect-ui-response-version', (event) => {
                        resolve(event.detail.version);
                    }, { once: true });
                    yield this.eventDispatcher.dispatchEvent('ton-connect-ui-request-version', createRequestVersionEvent());
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    /**
     * Emit user action event to the window.
     * @param eventDetails
     * @private
     */
    dispatchUserActionEvent(eventDetails) {
        try {
            this.eventDispatcher
                .dispatchEvent(`${this.eventPrefix}${eventDetails.type}`, eventDetails)
                .catch();
        }
        catch (e) { }
    }
    /**
     * Track connection init event.
     * @param args
     */
    trackConnectionStarted(...args) {
        try {
            const event = createConnectionStartedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        }
        catch (e) { }
    }
    /**
     * Track connection success event.
     * @param args
     */
    trackConnectionCompleted(...args) {
        try {
            const event = createConnectionCompletedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        }
        catch (e) { }
    }
    /**
     * Track connection error event.
     * @param args
     */
    trackConnectionError(...args) {
        try {
            const event = createConnectionErrorEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        }
        catch (e) { }
    }
    /**
     * Track connection restoring init event.
     * @param args
     */
    trackConnectionRestoringStarted(...args) {
        try {
            const event = createConnectionRestoringStartedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        }
        catch (e) { }
    }
    /**
     * Track connection restoring success event.
     * @param args
     */
    trackConnectionRestoringCompleted(...args) {
        try {
            const event = createConnectionRestoringCompletedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        }
        catch (e) { }
    }
    /**
     * Track connection restoring error event.
     * @param args
     */
    trackConnectionRestoringError(...args) {
        try {
            const event = createConnectionRestoringErrorEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        }
        catch (e) { }
    }
    /**
     * Track disconnect event.
     * @param args
     */
    trackDisconnection(...args) {
        try {
            const event = createDisconnectionEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        }
        catch (e) { }
    }
    /**
     * Track transaction init event.
     * @param args
     */
    trackTransactionSentForSignature(...args) {
        try {
            const event = createTransactionSentForSignatureEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        }
        catch (e) { }
    }
    /**
     * Track transaction signed event.
     * @param args
     */
    trackTransactionSigned(...args) {
        try {
            const event = createTransactionSignedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        }
        catch (e) { }
    }
    /**
     * Track transaction error event.
     * @param args
     */
    trackTransactionSigningFailed(...args) {
        try {
            const event = createTransactionSigningFailedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        }
        catch (e) { }
    }
}

const tonConnectSdkVersion = "3.0.6";

class TonConnect {
    constructor(options) {
        this.walletsList = new WalletsListManager();
        this._wallet = null;
        this.provider = null;
        this.statusChangeSubscriptions = [];
        this.statusChangeErrorSubscriptions = [];
        this.dappSettings = {
            manifestUrl: (options === null || options === void 0 ? void 0 : options.manifestUrl) || getWebPageManifest(),
            storage: (options === null || options === void 0 ? void 0 : options.storage) || new DefaultStorage()
        };
        this.walletsList = new WalletsListManager({
            walletsListSource: options === null || options === void 0 ? void 0 : options.walletsListSource,
            cacheTTLMs: options === null || options === void 0 ? void 0 : options.walletsListCacheTTLMs
        });
        this.tracker = new TonConnectTracker({
            eventDispatcher: options === null || options === void 0 ? void 0 : options.eventDispatcher,
            tonConnectSdkVersion: tonConnectSdkVersion
        });
        if (!this.dappSettings.manifestUrl) {
            throw new DappMetadataError('Dapp tonconnect-manifest.json must be specified if window.location.origin is undefined. See more https://github.com/ton-connect/docs/blob/main/requests-responses.md#app-manifest');
        }
        this.bridgeConnectionStorage = new BridgeConnectionStorage(this.dappSettings.storage);
        if (!(options === null || options === void 0 ? void 0 : options.disableAutoPauseConnection)) {
            this.addWindowFocusAndBlurSubscriptions();
        }
    }
    /**
     * Returns available wallets list.
     */
    static getWallets() {
        return this.walletsList.getWallets();
    }
    /**
     * Shows if the wallet is connected right now.
     */
    get connected() {
        return this._wallet !== null;
    }
    /**
     * Current connected account or null if no account is connected.
     */
    get account() {
        var _a;
        return ((_a = this._wallet) === null || _a === void 0 ? void 0 : _a.account) || null;
    }
    /**
     * Current connected wallet or null if no account is connected.
     */
    get wallet() {
        return this._wallet;
    }
    set wallet(value) {
        this._wallet = value;
        this.statusChangeSubscriptions.forEach(callback => callback(this._wallet));
    }
    /**
     * Returns available wallets list.
     */
    getWallets() {
        return this.walletsList.getWallets();
    }
    /**
     * Allows to subscribe to connection status changes and handle connection errors.
     * @param callback will be called after connections status changes with actual wallet or null.
     * @param errorsHandler (optional) will be called with some instance of TonConnectError when connect error is received.
     * @returns unsubscribe callback.
     */
    onStatusChange(callback, errorsHandler) {
        this.statusChangeSubscriptions.push(callback);
        if (errorsHandler) {
            this.statusChangeErrorSubscriptions.push(errorsHandler);
        }
        return () => {
            this.statusChangeSubscriptions = this.statusChangeSubscriptions.filter(item => item !== callback);
            if (errorsHandler) {
                this.statusChangeErrorSubscriptions = this.statusChangeErrorSubscriptions.filter(item => item !== errorsHandler);
            }
        };
    }
    connect(wallet, requestOrOptions) {
        var _a, _b;
        // TODO: remove deprecated method
        const options = {};
        if (typeof requestOrOptions === 'object' && 'tonProof' in requestOrOptions) {
            options.request = requestOrOptions;
        }
        if (typeof requestOrOptions === 'object' &&
            ('openingDeadlineMS' in requestOrOptions ||
                'signal' in requestOrOptions ||
                'request' in requestOrOptions)) {
            options.request = requestOrOptions === null || requestOrOptions === void 0 ? void 0 : requestOrOptions.request;
            options.openingDeadlineMS = requestOrOptions === null || requestOrOptions === void 0 ? void 0 : requestOrOptions.openingDeadlineMS;
            options.signal = requestOrOptions === null || requestOrOptions === void 0 ? void 0 : requestOrOptions.signal;
        }
        if (this.connected) {
            throw new WalletAlreadyConnectedError();
        }
        const abortController = createAbortController(options === null || options === void 0 ? void 0 : options.signal);
        (_a = this.abortController) === null || _a === void 0 ? void 0 : _a.abort();
        this.abortController = abortController;
        if (abortController.signal.aborted) {
            throw new TonConnectError('Connection was aborted');
        }
        (_b = this.provider) === null || _b === void 0 ? void 0 : _b.closeConnection();
        this.provider = this.createProvider(wallet);
        abortController.signal.addEventListener('abort', () => {
            var _a;
            (_a = this.provider) === null || _a === void 0 ? void 0 : _a.closeConnection();
            this.provider = null;
        });
        this.tracker.trackConnectionStarted();
        return this.provider.connect(this.createConnectRequest(options === null || options === void 0 ? void 0 : options.request), {
            openingDeadlineMS: options === null || options === void 0 ? void 0 : options.openingDeadlineMS,
            signal: abortController.signal
        });
    }
    /**
     * Try to restore existing session and reconnect to the corresponding wallet. Call it immediately when your app is loaded.
     */
    restoreConnection(options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.tracker.trackConnectionRestoringStarted();
            const abortController = createAbortController(options === null || options === void 0 ? void 0 : options.signal);
            (_a = this.abortController) === null || _a === void 0 ? void 0 : _a.abort();
            this.abortController = abortController;
            if (abortController.signal.aborted) {
                this.tracker.trackConnectionRestoringError('Connection restoring was aborted');
                return;
            }
            // TODO: potentially race condition here
            const [bridgeConnectionType, embeddedWallet] = yield Promise.all([
                this.bridgeConnectionStorage.storedConnectionType(),
                this.walletsList.getEmbeddedWallet()
            ]);
            if (abortController.signal.aborted) {
                this.tracker.trackConnectionRestoringError('Connection restoring was aborted');
                return;
            }
            let provider = null;
            try {
                switch (bridgeConnectionType) {
                    case 'http':
                        provider = yield BridgeProvider.fromStorage(this.dappSettings.storage);
                        break;
                    case 'injected':
                        provider = yield InjectedProvider.fromStorage(this.dappSettings.storage);
                        break;
                    default:
                        if (embeddedWallet) {
                            provider = this.createProvider(embeddedWallet);
                        }
                        else {
                            return;
                        }
                }
            }
            catch (_c) {
                this.tracker.trackConnectionRestoringError('Provider is not restored');
                yield this.bridgeConnectionStorage.removeConnection();
                provider === null || provider === void 0 ? void 0 : provider.closeConnection();
                provider = null;
                return;
            }
            if (abortController.signal.aborted) {
                provider === null || provider === void 0 ? void 0 : provider.closeConnection();
                this.tracker.trackConnectionRestoringError('Connection restoring was aborted');
                return;
            }
            if (!provider) {
                logError('Provider is not restored');
                this.tracker.trackConnectionRestoringError('Provider is not restored');
                return;
            }
            (_b = this.provider) === null || _b === void 0 ? void 0 : _b.closeConnection();
            this.provider = provider;
            provider.listen(this.walletEventsListener.bind(this));
            const onAbortRestore = () => {
                this.tracker.trackConnectionRestoringError('Connection restoring was aborted');
                provider === null || provider === void 0 ? void 0 : provider.closeConnection();
                provider = null;
            };
            abortController.signal.addEventListener('abort', onAbortRestore);
            const restoreConnectionTask = callForSuccess((_options) => __awaiter(this, void 0, void 0, function* () {
                yield (provider === null || provider === void 0 ? void 0 : provider.restoreConnection({
                    openingDeadlineMS: options === null || options === void 0 ? void 0 : options.openingDeadlineMS,
                    signal: _options.signal
                }));
                abortController.signal.removeEventListener('abort', onAbortRestore);
                if (this.connected) {
                    this.tracker.trackConnectionRestoringCompleted(this.wallet);
                }
                else {
                    this.tracker.trackConnectionRestoringError('Connection restoring failed');
                }
            }), {
                attempts: Number.MAX_SAFE_INTEGER,
                delayMs: 2000,
                signal: options === null || options === void 0 ? void 0 : options.signal
            });
            const restoreConnectionTimeout = new Promise(resolve => setTimeout(() => resolve(), 12000) // connection deadline
            );
            return Promise.race([restoreConnectionTask, restoreConnectionTimeout]);
        });
    }
    sendTransaction(transaction, optionsOrOnRequestSent) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: remove deprecated method
            const options = {};
            if (typeof optionsOrOnRequestSent === 'function') {
                options.onRequestSent = optionsOrOnRequestSent;
            }
            else {
                options.onRequestSent = optionsOrOnRequestSent === null || optionsOrOnRequestSent === void 0 ? void 0 : optionsOrOnRequestSent.onRequestSent;
                options.signal = optionsOrOnRequestSent === null || optionsOrOnRequestSent === void 0 ? void 0 : optionsOrOnRequestSent.signal;
            }
            const abortController = createAbortController(options === null || options === void 0 ? void 0 : options.signal);
            if (abortController.signal.aborted) {
                throw new TonConnectError('Transaction sending was aborted');
            }
            this.checkConnection();
            checkSendTransactionSupport(this.wallet.device.features, {
                requiredMessagesNumber: transaction.messages.length
            });
            this.tracker.trackTransactionSentForSignature(this.wallet, transaction);
            const { validUntil } = transaction, tx = __rest(transaction, ["validUntil"]);
            const from = transaction.from || this.account.address;
            const network = transaction.network || this.account.chain;
            const response = yield this.provider.sendRequest(sendTransactionParser.convertToRpcRequest(Object.assign(Object.assign({}, tx), { valid_until: validUntil, from,
                network })), { onRequestSent: options.onRequestSent, signal: abortController.signal });
            if (sendTransactionParser.isError(response)) {
                this.tracker.trackTransactionSigningFailed(this.wallet, transaction, response.error.message, response.error.code);
                return sendTransactionParser.parseAndThrowError(response);
            }
            const result = sendTransactionParser.convertFromRpcResponse(response);
            this.tracker.trackTransactionSigned(this.wallet, transaction, result);
            return result;
        });
    }
    /**
     * Disconnect form thw connected wallet and drop current session.
     */
    disconnect(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connected) {
                throw new WalletNotConnectedError();
            }
            const abortController = createAbortController(options === null || options === void 0 ? void 0 : options.signal);
            const prevAbortController = this.abortController;
            this.abortController = abortController;
            if (abortController.signal.aborted) {
                throw new TonConnectError('Disconnect was aborted');
            }
            this.onWalletDisconnected('dapp');
            yield ((_a = this.provider) === null || _a === void 0 ? void 0 : _a.disconnect({
                signal: abortController.signal
            }));
            prevAbortController === null || prevAbortController === void 0 ? void 0 : prevAbortController.abort();
        });
    }
    /**
     * Pause bridge HTTP connection. Might be helpful, if you want to pause connections while browser tab is unfocused,
     * or if you use SDK with NodeJS and want to save server resources.
     */
    pauseConnection() {
        var _a;
        if (((_a = this.provider) === null || _a === void 0 ? void 0 : _a.type) !== 'http') {
            return;
        }
        this.provider.pause();
    }
    /**
     * Unpause bridge HTTP connection if it is paused.
     */
    unPauseConnection() {
        var _a;
        if (((_a = this.provider) === null || _a === void 0 ? void 0 : _a.type) !== 'http') {
            return Promise.resolve();
        }
        return this.provider.unPause();
    }
    addWindowFocusAndBlurSubscriptions() {
        const document = getDocument();
        if (!document) {
            return;
        }
        try {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseConnection();
                }
                else {
                    this.unPauseConnection().catch();
                }
            });
        }
        catch (e) {
            logError('Cannot subscribe to the document.visibilitychange: ', e);
        }
    }
    createProvider(wallet) {
        let provider;
        if (!Array.isArray(wallet) && isWalletConnectionSourceJS(wallet)) {
            provider = new InjectedProvider(this.dappSettings.storage, wallet.jsBridgeKey);
        }
        else {
            provider = new BridgeProvider(this.dappSettings.storage, wallet);
        }
        provider.listen(this.walletEventsListener.bind(this));
        return provider;
    }
    walletEventsListener(e) {
        switch (e.event) {
            case 'connect':
                this.onWalletConnected(e.payload);
                break;
            case 'connect_error':
                this.onWalletConnectError(e.payload);
                break;
            case 'disconnect':
                this.onWalletDisconnected('wallet');
        }
    }
    onWalletConnected(connectEvent) {
        const tonAccountItem = connectEvent.items.find(item => item.name === 'ton_addr');
        const tonProofItem = connectEvent.items.find(item => item.name === 'ton_proof');
        if (!tonAccountItem) {
            throw new TonConnectError('ton_addr connection item was not found');
        }
        const wallet = {
            device: connectEvent.device,
            provider: this.provider.type,
            account: {
                address: tonAccountItem.address,
                chain: tonAccountItem.network,
                walletStateInit: tonAccountItem.walletStateInit,
                publicKey: tonAccountItem.publicKey
            }
        };
        if (tonProofItem) {
            wallet.connectItems = {
                tonProof: tonProofItem
            };
        }
        this.wallet = wallet;
        this.tracker.trackConnectionCompleted(wallet);
    }
    onWalletConnectError(connectEventError) {
        const error = connectErrorsParser.parseError(connectEventError);
        this.statusChangeErrorSubscriptions.forEach(errorsHandler => errorsHandler(error));
        logDebug(error);
        this.tracker.trackConnectionError(connectEventError.message, connectEventError.code);
        if (error instanceof ManifestNotFoundError || error instanceof ManifestContentErrorError) {
            logError(error);
            throw error;
        }
    }
    onWalletDisconnected(scope) {
        this.tracker.trackDisconnection(this.wallet, scope);
        this.wallet = null;
    }
    checkConnection() {
        if (!this.connected) {
            throw new WalletNotConnectedError();
        }
    }
    createConnectRequest(request) {
        const items = [
            {
                name: 'ton_addr'
            }
        ];
        if (request === null || request === void 0 ? void 0 : request.tonProof) {
            items.push({
                name: 'ton_proof',
                payload: request.tonProof
            });
        }
        return {
            manifestUrl: this.dappSettings.manifestUrl,
            items
        };
    }
}
TonConnect.walletsList = new WalletsListManager();
/**
 * Check if specified wallet is injected and available to use with the app.
 * @param walletJSKey target wallet's js bridge key.
 */
TonConnect.isWalletInjected = (walletJSKey) => InjectedProvider.isWalletInjected(walletJSKey);
/**
 * Check if the app is opened inside specified wallet's browser.
 * @param walletJSKey target wallet's js bridge key.
 */
TonConnect.isInsideWalletBrowser = (walletJSKey) => InjectedProvider.isInsideWalletBrowser(walletJSKey);

const noBounceableTag = 0x51;
const testOnlyTag = 0x80;
/**
 * Converts raw TON address to no-bounceable user-friendly format. [See details]{@link https://ton.org/docs/learn/overviews/addresses#user-friendly-address}
 * @param hexAddress raw TON address formatted as "0:<hex string without 0x>".
 * @param [testOnly=false] convert address to test-only form. [See details]{@link https://ton.org/docs/learn/overviews/addresses#user-friendly-address}
 */
function toUserFriendlyAddress(hexAddress, testOnly = false) {
    const { wc, hex } = parseHexAddress(hexAddress);
    let tag = noBounceableTag;
    if (testOnly) {
        tag |= testOnlyTag;
    }
    const addr = new Int8Array(34);
    addr[0] = tag;
    addr[1] = wc;
    addr.set(hex, 2);
    const addressWithChecksum = new Uint8Array(36);
    addressWithChecksum.set(addr);
    addressWithChecksum.set(crc16(addr), 34);
    let addressBase64 = protocol.Base64.encode(addressWithChecksum);
    return addressBase64.replace(/\+/g, '-').replace(/\//g, '_');
}
function parseHexAddress(hexAddress) {
    if (!hexAddress.includes(':')) {
        throw new WrongAddressError(`Wrong address ${hexAddress}. Address must include ":".`);
    }
    const parts = hexAddress.split(':');
    if (parts.length !== 2) {
        throw new WrongAddressError(`Wrong address ${hexAddress}. Address must include ":" only once.`);
    }
    const wc = parseInt(parts[0]);
    if (wc !== 0 && wc !== -1) {
        throw new WrongAddressError(`Wrong address ${hexAddress}. WC must be eq 0 or -1, but ${wc} received.`);
    }
    const hex = parts[1];
    if ((hex === null || hex === void 0 ? void 0 : hex.length) !== 64) {
        throw new WrongAddressError(`Wrong address ${hexAddress}. Hex part must be 64bytes length, but ${hex === null || hex === void 0 ? void 0 : hex.length} received.`);
    }
    return {
        wc,
        hex: hexToBytes(hex)
    };
}
function crc16(data) {
    const poly = 0x1021;
    let reg = 0;
    const message = new Uint8Array(data.length + 2);
    message.set(data);
    for (let byte of message) {
        let mask = 0x80;
        while (mask > 0) {
            reg <<= 1;
            if (byte & mask) {
                reg += 1;
            }
            mask >>= 1;
            if (reg > 0xffff) {
                reg &= 0xffff;
                reg ^= poly;
            }
        }
    }
    return new Uint8Array([Math.floor(reg / 256), reg % 256]);
}
const toByteMap = {};
for (let ord = 0; ord <= 0xff; ord++) {
    let s = ord.toString(16);
    if (s.length < 2) {
        s = '0' + s;
    }
    toByteMap[s] = ord;
}
function hexToBytes(hex) {
    hex = hex.toLowerCase();
    const length2 = hex.length;
    if (length2 % 2 !== 0) {
        throw new ParseHexError('Hex string must have length a multiple of 2: ' + hex);
    }
    const length = length2 / 2;
    const result = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        const doubled = i * 2;
        const hexSubstring = hex.substring(doubled, doubled + 2);
        if (!toByteMap.hasOwnProperty(hexSubstring)) {
            throw new ParseHexError('Invalid hex character: ' + hexSubstring);
        }
        result[i] = toByteMap[hexSubstring];
    }
    return result;
}

Object.defineProperty(exports, 'CHAIN', {
    enumerable: true,
    get: function () { return protocol.CHAIN; }
});
Object.defineProperty(exports, 'CONNECT_EVENT_ERROR_CODES', {
    enumerable: true,
    get: function () { return protocol.CONNECT_EVENT_ERROR_CODES; }
});
Object.defineProperty(exports, 'CONNECT_ITEM_ERROR_CODES', {
    enumerable: true,
    get: function () { return protocol.CONNECT_ITEM_ERROR_CODES; }
});
Object.defineProperty(exports, 'SEND_TRANSACTION_ERROR_CODES', {
    enumerable: true,
    get: function () { return protocol.SEND_TRANSACTION_ERROR_CODES; }
});
exports.BadRequestError = BadRequestError;
exports.BrowserEventDispatcher = BrowserEventDispatcher;
exports.FetchWalletsError = FetchWalletsError;
exports.LocalstorageNotFoundError = LocalstorageNotFoundError;
exports.ParseHexError = ParseHexError;
exports.TonConnect = TonConnect;
exports.TonConnectError = TonConnectError;
exports.UnknownAppError = UnknownAppError;
exports.UnknownError = UnknownError;
exports.UserRejectsError = UserRejectsError;
exports.WalletAlreadyConnectedError = WalletAlreadyConnectedError;
exports.WalletNotConnectedError = WalletNotConnectedError;
exports.WalletNotInjectedError = WalletNotInjectedError;
exports.WalletsListManager = WalletsListManager;
exports.WrongAddressError = WrongAddressError;
exports.createConnectionCompletedEvent = createConnectionCompletedEvent;
exports.createConnectionErrorEvent = createConnectionErrorEvent;
exports.createConnectionRestoringCompletedEvent = createConnectionRestoringCompletedEvent;
exports.createConnectionRestoringErrorEvent = createConnectionRestoringErrorEvent;
exports.createConnectionRestoringStartedEvent = createConnectionRestoringStartedEvent;
exports.createConnectionStartedEvent = createConnectionStartedEvent;
exports.createDisconnectionEvent = createDisconnectionEvent;
exports.createRequestVersionEvent = createRequestVersionEvent;
exports.createResponseVersionEvent = createResponseVersionEvent;
exports.createTransactionSentForSignatureEvent = createTransactionSentForSignatureEvent;
exports.createTransactionSignedEvent = createTransactionSignedEvent;
exports.createTransactionSigningFailedEvent = createTransactionSigningFailedEvent;
exports.createVersionInfo = createVersionInfo;
exports.default = TonConnect;
exports.encodeTelegramUrlParameters = encodeTelegramUrlParameters;
exports.isTelegramUrl = isTelegramUrl;
exports.isWalletInfoCurrentlyEmbedded = isWalletInfoCurrentlyEmbedded;
exports.isWalletInfoCurrentlyInjected = isWalletInfoCurrentlyInjected;
exports.isWalletInfoInjectable = isWalletInfoInjectable;
exports.isWalletInfoInjected = isWalletInfoInjected;
exports.isWalletInfoRemote = isWalletInfoRemote;
exports.toUserFriendlyAddress = toUserFriendlyAddress;
//# sourceMappingURL=index.cjs.map
