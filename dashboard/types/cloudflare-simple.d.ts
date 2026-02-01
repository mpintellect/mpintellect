// types/cloudflare-simple.d.ts
// Minimal Cloudflare types for D1, KV, R2

declare global {
  // D1 Database Types
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    exec<T = unknown>(query: string): Promise<D1ExecResult>;
  }

  interface D1PreparedStatement {
    bind(...params: any[]): D1PreparedStatement;
    all<T = unknown>(): Promise<D1Result<T>>;
    run<T = unknown>(): Promise<D1Result<T>>;
    first<T = unknown>(colName?: string): Promise<T>;
  }

  interface D1Result<T = unknown> {
    results: T[];
    success: boolean;
    meta: {
      duration: number;
      last_row_id: number | null;
      changes: number;
      served_by: string;
    };
  }

  interface D1ExecResult {
    count: number;
    duration: number;
  }

  // KV Namespace Types
  interface KVNamespace {
    get(key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }): Promise<any>;
    put(key: string, value: string | ArrayBuffer | ReadableStream, options?: KVNamespacePutOptions): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: KVNamespaceListOptions): Promise<KVNamespaceListResult>;
  }

  interface KVNamespacePutOptions {
    expiration?: number;
    expirationTtl?: number;
    metadata?: any;
  }

  interface KVNamespaceListOptions {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }

  interface KVNamespaceListResult {
    keys: Array<{ name: string; expiration?: number; metadata?: any }>;
    list_complete: boolean;
    cursor?: string;
  }

  // R2 Bucket Types
  interface R2Bucket {
    get(key: string, options?: R2GetOptions): Promise<R2Object | null>;
    put(key: string, value: R2PutValue, options?: R2PutOptions): Promise<R2Object>;
    delete(key: string): Promise<void>;
    list(options?: R2ListOptions): Promise<R2ListResult>;
  }

  type R2PutValue = string | ArrayBuffer | ArrayBufferView | Blob | Buffer | ReadableStream;

  interface R2GetOptions {
    onlyIf?: R2Conditional;
    range?: R2Range;
  }

  interface R2Conditional {
    etagMatches?: string;
    etagDoesNotMatch?: string;
    uploadedBefore?: Date;
    uploadedAfter?: Date;
  }

  interface R2Range {
    offset?: number;
    length?: number;
    suffix?: number;
  }

  interface R2PutOptions {
    httpMetadata?: R2HTTPMetadata;
    customMetadata?: Record<string, string>;
    md5?: ArrayBuffer | string;
    sha1?: ArrayBuffer | string;
    sha256?: ArrayBuffer | string;
    sha384?: ArrayBuffer | string;
    sha512?: ArrayBuffer | string;
  }

  interface R2HTTPMetadata {
    contentType?: string;
    contentLanguage?: string;
    contentDisposition?: string;
    contentEncoding?: string;
    cacheControl?: string;
    cacheExpiry?: Date;
  }

  interface R2Object {
    key: string;
    version: string;
    size: number;
    etag: string;
    httpEtag: string;
    checksums: R2Checksums;
    uploaded: Date;
    httpMetadata?: R2HTTPMetadata;
    customMetadata?: Record<string, string>;
    writeHttpMetadata(headers: Headers): void;
    body: ReadableStream;
    arrayBuffer(): Promise<ArrayBuffer>;
    text(): Promise<string>;
    json<T>(): Promise<T>;
    blob(): Promise<Blob>;
  }

  interface R2Checksums {
    md5?: ArrayBuffer;
    sha1?: ArrayBuffer;
    sha256?: ArrayBuffer;
    sha384?: ArrayBuffer;
    sha512?: ArrayBuffer;
  }

  interface R2ListOptions {
    prefix?: string;
    delimiter?: string;
    cursor?: string;
    limit?: number;
    include?: ('httpMetadata' | 'customMetadata')[];
  }

  interface R2ListResult {
    objects: R2Object[];
    truncated: boolean;
    cursor?: string;
    delimitedPrefixes?: string[];
  }

  // Request Context
  interface CloudflareRequestContext {
    env: {
      DB: D1Database;
      KV?: KVNamespace;
      R2?: R2Bucket;
      [key: string]: any;
    };
    cf?: any;
    ctx?: any;
  }
}

// Export empty to make this a module
export {};