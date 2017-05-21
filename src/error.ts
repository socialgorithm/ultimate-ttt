export default function(error: any, data?: string | number): Error {
  return new Error(
    error.message.replace('%s', data),
    error.code
  );
}