import { apiOperations, type ApiOperationName } from "./catalog";
import type { ApiClient } from "./client";
import { apiFailure, type ApiResult, type RequestOptions } from "./types";

type OperationOptions<T> = Omit<RequestOptions<T>, "method" | "authenticated"> & {
  pathParams?: Readonly<Record<string, string>>;
};
/** One adapter boundary for the draft contract; callers must validate response data. */
export function createRiderApi(client: ApiClient) {
  return {
    async call<T>(name: ApiOperationName, options: OperationOptions<T>): Promise<ApiResult<T>> {
      const operation = apiOperations[name];
      if (!operation) return apiFailure("VALIDATION", "Unknown API operation.");
      if (operation.requiresIdempotencyKey && !options.idempotencyKey) {
        return apiFailure("VALIDATION", "This action requires a stable idempotency key.");
      }
      const required = [...operation.path.matchAll(/\{([A-Za-z]+)\}/g)].map((match) => match[1]);
      if (required.some((key) => !/^[A-Za-z0-9_-]{1,128}$/.test(options.pathParams?.[key] ?? ""))) {
        return apiFailure("VALIDATION", "A valid resource identifier is required.");
      }
      const path = operation.path.replace(
        /\{([A-Za-z]+)\}/g,
        (_, key: string) => options.pathParams?.[key] ?? "",
      );
      return client.request(path, {
        ...options,
        method: operation.method,
        authenticated: operation.authenticated,
      });
    },
  };
}
