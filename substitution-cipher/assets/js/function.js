function caesarShift(input, amount) {
	var output = '';
	for (var i = 0; i < input.length; i ++) {
		var str = input[i];
		if (str.match(/[a-z]/i)) {
			var code = input.charCodeAt(i);
			if ((code >= 65) && (code <= 90))
				str = String.fromCharCode(((code - 65 + amount) % 26) + 65);
			else if ((code >= 97) && (code <= 122))
				str = String.fromCharCode(((code - 97 + amount) % 26) + 97);
		}
		output += str;
	}
	return output;
}

function substitution(input, map) {
    var output = "";
    for (var i in input) {
        output += map[input[i]];
    }
    return output;
};
