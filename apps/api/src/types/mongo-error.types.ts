export interface MongoDuplicateKeyError {
  code: number;
  keyPattern?: Record<string, unknown>;
}
