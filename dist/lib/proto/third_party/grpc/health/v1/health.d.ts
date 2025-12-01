import { BinaryReader, BinaryWriter } from '@bufbuild/protobuf/wire';
export declare const protobufPackage = "grpc.health.v1";
export interface HealthCheckRequest {
    service: string;
}
export interface HealthCheckResponse {
    status: HealthCheckResponse_ServingStatus;
}
export declare enum HealthCheckResponse_ServingStatus {
    UNKNOWN = 0,
    SERVING = 1,
    NOT_SERVING = 2,
    /** SERVICE_UNKNOWN - Used only by the Watch method. */
    SERVICE_UNKNOWN = 3,
    UNRECOGNIZED = -1
}
export declare function healthCheckResponse_ServingStatusFromJSON(object: any): HealthCheckResponse_ServingStatus;
export declare function healthCheckResponse_ServingStatusToJSON(object: HealthCheckResponse_ServingStatus): string;
export interface HealthListRequest {
}
export interface HealthListResponse {
    /** statuses contains all the services and their respective status. */
    statuses: {
        [key: string]: HealthCheckResponse;
    };
}
export interface HealthListResponse_StatusesEntry {
    key: string;
    value: HealthCheckResponse | undefined;
}
export declare const HealthCheckRequest: MessageFns<HealthCheckRequest>;
export declare const HealthCheckResponse: MessageFns<HealthCheckResponse>;
export declare const HealthListRequest: MessageFns<HealthListRequest>;
export declare const HealthListResponse: MessageFns<HealthListResponse>;
export declare const HealthListResponse_StatusesEntry: MessageFns<HealthListResponse_StatusesEntry>;
/**
 * Health is gRPC's mechanism for checking whether a server is able to handle
 * RPCs. Its semantics are documented in
 * https://github.com/grpc/grpc/blob/master/doc/health-checking.md.
 */
export interface Health {
    /**
     * Check gets the health of the specified service. If the requested service
     * is unknown, the call will fail with status NOT_FOUND. If the caller does
     * not specify a service name, the server should respond with its overall
     * health status.
     *
     * Clients should set a deadline when calling Check, and can declare the
     * server unhealthy if they do not receive a timely response.
     */
    Check(request: HealthCheckRequest): Promise<HealthCheckResponse>;
    /**
     * List provides a non-atomic snapshot of the health of all the available
     * services.
     *
     * The server may respond with a RESOURCE_EXHAUSTED error if too many services
     * exist.
     *
     * Clients should set a deadline when calling List, and can declare the server
     * unhealthy if they do not receive a timely response.
     *
     * Clients should keep in mind that the list of health services exposed by an
     * application can change over the lifetime of the process.
     */
    List(request: HealthListRequest): Promise<HealthListResponse>;
}
export declare const HealthServiceName = "grpc.health.v1.Health";
export declare class HealthClientImpl implements Health {
    private readonly rpc;
    private readonly service;
    constructor(rpc: Rpc, opts?: {
        service?: string;
    });
    Check(request: HealthCheckRequest): Promise<HealthCheckResponse>;
    List(request: HealthListRequest): Promise<HealthListResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
    create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
    fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
export {};
