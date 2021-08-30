/**
 * Utility function to generate game errors identified by a code
 * @param error Original error object
 * @param data Extra information to replace inside the error object
 * @returns {UTTTError} Game error
 */
export default function(error: any, data?: any): UTTTError {
  return new UTTTError(
    error.message.replace("%s", data),
    error.code,
  );
}

class UTTTError extends Error {

  constructor(message: string, private code: number) {
      super(message);
      this.code = code;
  }

}
