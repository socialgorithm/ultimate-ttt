import UTTTError from "./model/UTTTError";

/**
 * Utility function to generate game errors identified by a code
 * @param error Original error object
 * @param data Extra information to replace inside the error object
 * @returns {UTTTError} Game error
 */
export default function(error: any, data?: any): UTTTError {
  return new UTTTError(
    error.message.replace('%s', data),
    error.code
  );
}