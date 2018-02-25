function initJulius(elementId) {
    for (var i = 1; i <= 25; i++) {
        $('ul#' + elementId).append('<li role="presentation" value="' + i + '"><a href="#">' + i + '</a></li>');
    }
}

$(document).ready(function() {
    initJulius('julius-caesar-select');
});