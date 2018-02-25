function caesarShift(input, amount) {
	var output = '';
	for (var i = 0; i < input.length; i ++) {
		var str = input[i];
		if (str.match(/[a-z]/i)) {
			var code = input.charCodeAt(i);
			if ((code >= 65) && (code <= 90))
				str = input.fromCharCode(((code - 65 + amount) % 26) + 65);
			else if ((code >= 97) && (code <= 122))
				str = input.fromCharCode(((code - 97 + amount) % 26) + 97);
		}
		output += str;
	}
	return output;
}

function substitution(input, ) {
    var map = {
        a: 'q', b: 'w', c: 'e',
        d: 'r', e: 't', f: 'y',
        g: 'u', h: 'i', i: 'o',
        j: 'p', k: 'a', l: 's',
        m: 'd', n: 'f', o: 'g',
        p: 'h', q: 'j', r: 'k',
        s: 'l', t: 'z', u: 'x',
        v: 'c', w: 'v', x: 'b',
        y: 'n', z: 'm'
    };
    if(decode) {
        map = (function() {
            var tmp = {};
            var k;
            for(k in map) {
                if(!map.hasOwnProperty(k)) continue;
                tmp[map[k]] = k;
            }
            return tmp;
        })();
    }
    return input.split('').filter(function(v) {
        return map.hasOwnProperty(v.toLowerCase());
    }).map(function(v) {
        return map[v.toLowerCase()].toUpperCase();
    }).join('');
};
