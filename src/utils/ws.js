export function createWS(path) {
  const { protocol, host } = window.location;
  return new WebSocket(`${protocol.replace('http', 'ws')}//${host}${path}`);
}