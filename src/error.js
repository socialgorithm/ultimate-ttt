export default function(error, data){
  return new Error(
    error.message.replace('%s', data),
    error.code
  );
}