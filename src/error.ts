import UTTTError from "./model/UTTTError";

export default function(error: any, data?: string | number): UTTTError {
  return new UTTTError(
    error.message.replace('%s', data),
    error.code
  );
}