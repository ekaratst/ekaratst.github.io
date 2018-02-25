function initJulius(elementId) {
    for (var i = 1; i <= 25; i++) {
        $('ul#' + elementId).append('<li role="presentation" value="' + i + '"><a href="#">' + i + '</a></li>');
    }
}

function initSimpleSubCipher(elementId) {
    var A_ascii = 'A'.charCodeAt(0);
    var $alphabetsOption = $('<select class="form-control alphabet-select" style="width: 60px; display: inline-block;"></select>');
    for (var i = 0; i < 26; i++) {
        $alphabetsOption.append('<option>' + String.fromCharCode(A_ascii + i) + '</option>');
    }
    var $row = $('<div class="row"></div>');
    for (var i = 0; i < 26; i++) {
        var $div = $('<div class="col-xs-3" ></div>');
        $div.append('<div style="width: 40px; display: inline-block;">' + String.fromCharCode(A_ascii + i) + ' =&gt; </div>');
        $div.append($alphabetsOption.clone());
        $div.find('select').attr('name', 'alphabet' + String.fromCharCode(A_ascii + i))
        $row.append($div);
        if ((i+1) % 4 == 0 && i !== 0) {
            $('#' + elementId).append($row);
            $row = $('<div class="row"></div>');
        }
    }
    $('#' + elementId).append($row);
}

$(document).ready(function() {
    initJulius('julius-caesar-select');
    initSimpleSubCipher("simple-substitution");
});