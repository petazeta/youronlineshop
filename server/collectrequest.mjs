import config from './cfg/mainserver.mjs';
export default async function collectRequest(request) {
  const buffers = [];
  let totalLength=0;
  for await (const chunk of request) {
    buffers.push(chunk);
    totalLength += chunk.length;
    if (totalLength > config.requestMaxSize) {
      request.connection.destroy();
      const myError = new Error('Max request length exceeded');
      myError.name="400";
      throw myError;
    }
  }
  const body = Buffer.concat(buffers).toString();
  let data;
  try {
    data = JSON.parse(body);
    if (!data.action) throw new Error('No action passed');
  }
  catch (er) {
    er.name="400";
    throw er;
  }
  return data;
}