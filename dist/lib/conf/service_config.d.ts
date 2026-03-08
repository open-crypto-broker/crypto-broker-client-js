export declare const serviceConfig: {
    methodConfig: {
        name: {}[];
        retryPolicy: {
            maxAttempts: number;
            initialBackoff: string;
            maxBackoff: string;
            backoffMultiplier: number;
            retryableStatusCodes: string[];
        };
    }[];
};
