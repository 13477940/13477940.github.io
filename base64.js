const encode_regex = /[\+=\/]/g;
const decode_regex = /[\._\-]/g;

// Buffer -> Base64 String -> Url Safe Base64 String
export function encode(buffer) {
  return buffer.toString('base64').replace(encode_regex, encodeChar);
}

// Url Safe Base64 String -> Base64 String -> Buffer
export function decode(string) {
  return new Buffer(string.replace(decode_regex, decodeChar), 'base64');
}

function encodeChar(c) {
  switch (c) {
    case '+': return '.';
    case '=': return '-';
    case '/': return '_';
  }
}

function decodeChar(c) {
  switch (c) {
    case '.': return '+';
    case '-': return '=';
    case '_': return '/';
  }
}
