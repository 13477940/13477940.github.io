const encode_regex = /[\+=\/]/g;
const decode_regex = /[\._\-]/g;

var website = {};

(()=>{
	website["encode"] = (buffer) => {
		return buffer.toString('base64').replace(encode_regex, encodeChar);
	};
	function encodeChar(c) {
	  switch (c) {
	    case '+': return '.';
	    case '=': return '-';
	    case '/': return '_';
	  }
	}
})();

(()=>{
	website["decode"] = (string) => {
		return new Buffer(string.replace(decode_regex, decodeChar), 'base64');
	};
	function decodeChar(c) {
	  switch (c) {
	    case '.': return '+';
	    case '-': return '=';
	    case '_': return '/';
	  }
	}
})();
