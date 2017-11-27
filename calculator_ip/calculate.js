var $subnet = $('.form-group.subnet');
var lastSelectedSubnet = localStorage.getItem('subnet');
for (var i = 1; i <= 32; i++) {
    var bin = '';
    for (var j = 0; j < 32; j++) {
        bin += j < i ? '1' : '0';
    }
    var ip = '';
    for (var j = 0; j < 4; j++) {
        var tmp = parseInt(bin.slice(j * 8, (j + 1) * 8), 2);
        ip += tmp + (j < 3 ? '.' : '');
    }
    var $option = $(`
        <option value="`+ i + `"` + (parseInt(lastSelectedSubnet) === i ? ' selected' : '') + `>` + ip + ' (' + i + ')' + `</option>
    `);
    $subnet.find('select').append($option);
}

$subnet.find('select').change(function() {
    localStorage.setItem('subnet', $(this).val());
});
var ipShowError = {
    show: function() {
        $('.error-msg').removeClass('hide');
    },
    hide: function() {
        $('.error-msg').addClass('hide');
    }
}

function ValidateIPaddress(ip) {
    return ip.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/) !== null;
}

function calNetAddr(ip, subnetCIDR) {
    var result = [];
    var subnetSet = binToDecSet(getBinSubnet(subnetCIDR)).split('.');
    ip = ip.split('.');
    for (var i = 0; i < 4; i++) {
        var tmp = Number(ip[i]);
        result.push(tmp & parseInt(subnetSet[i]));
    }
    return result.join('.');
}

function getWildCard(subnetCIDR) {
    var result = '';
    for (var i = 0; i < 32; i++) {
        result += i < subnetCIDR ? 0 : 1;
    }
    return result;
}

function getUsableIPRange(netAddr, wildCard) {
    if (parseInt(wildCard, 2) <= 1) {
        return '-';
    }
    var tmp = netAddr.split('.');
    for (i in tmp) {
        tmp[i] = parseInt(tmp[i]);
    }
    var start = [tmp[0], tmp[1], tmp[2], (tmp[3] + 1)].join('.');
    for (var i = 0; i < 4; i++) {
        tmp[i] += parseInt(wildCard.slice(i * 8, (i + 1) * 8), 2);
    }
    var end = [tmp[0], tmp[1], tmp[2], (tmp[3] - 1)].join('.');
    return start + ' - ' + end;
}

function getBroadCastAddr(netAddr, wildCard) {
    if (parseInt(wildCard, 2) === 0) {
        return netAddr;
    }
    var tmp = netAddr.split('.');
    for (i in tmp) {
        tmp[i] = parseInt(tmp[i]);
    }
    for (var i = 0; i < 4; i++) {
        tmp[i] += parseInt(wildCard.slice(i * 8, (i + 1) * 8), 2);
    }
    return tmp.join('.');
}

function getClass(addr) {
    addr = addr.split('.');
    var Class;
    for (i in addr) {
        addr[i] = parseInt(addr[i]);
    }
    if (parseInt(addr[0]) < 128) {
        Class = 'A'
    }
    else if (parseInt(addr[0]) < 192) {
        Class = 'B'
    }
    else if (parseInt(addr[0]) < 224) {
        Class = 'C'
    }
    else {
        Class = 'C'
    }
    return Class;
}

function getBinSubnet(subnetCIDR) {
    var subnetBin = '';
    for (var i = 0; i < 32; i++) {
        subnetBin += i < subnetCIDR ? 1 : 0;
    }
    return subnetBin;
}

function binToDecSet(bin) {
    var result = [];
    for (var i = 0; i < 4; i++) {
        result.push(parseInt(bin.slice(i * 8, (i + 1) * 8), 2));
    }
    return result.join('.');
}

function decSetToBin(decSet) {
    var result = '';
    decSet = decSet.split('.');
    for (i in decSet) {
        var tmp = parseInt(decSet[i]).toString(2);
        while (tmp.length < 8) {
            tmp = '0' + tmp;
        }
        result += tmp;
    }
    return result;
}

function isIPPrivate(ip) {
    ip = ip.split('.');
    for (i in ip) {
        ip[i] = parseInt(ip[i]);
    }
    return ip[0] === 10 || (ip[0] === 172 && (ip[1] >= 16 && ip[1] <= 31)) || (ip[0] === 192 && ip[1] === 168) || (ip[0] === 127 && ip[1] === 0 && ip[2] === 0 && ip[3] === 1);
}

function getAllNetwork(ip, subnetCIDR) {
    if (subnetCIDR === 8 || subnetCIDR === 16 || subnetCIDR === 24 || subnetCIDR === 32) {
        return null;
    }
    var ipBin = decSetToBin(ip);
    var subnetBin = getBinSubnet(subnetCIDR);
    var wildCard = getWildCard(subnetCIDR);
    var groupIndex = -1;
    for (var i = 0; i < 4; i++) {
        if (parseInt(subnetBin.slice(i*8, (i+1)*8), 2) < Math.pow(2, 8) - 1) {
            if (groupIndex === -1) {
                groupIndex = i;
            }
            var start = ipBin.substring(0, i * 8);
            var end = ipBin.substring((i+1)*8, ipBin.length);
            for (var j = 0; j < 8; j++) {
                start += 0;
            }
            ipBin = start + end;
        }
    }
    var ipStart = ipBin;
    var result = [];
    for (var i = 0; i < Math.pow(2, subnetBin.slice(groupIndex * 8, (groupIndex + 1) * 8).match(/1/g).length); i++) {
        result.push({network: binToDecSet(ipBin), range: getUsableIPRange(binToDecSet(ipBin), wildCard), broadcast: getBroadCastAddr(binToDecSet(ipBin), wildCard)})
        var start = ipBin.slice(0, groupIndex * 8);
        var end = ipBin.slice((groupIndex + 1) * 8, ipBin.length);
        // console.log((parseInt(ipBin.slice(groupIndex * 8, (groupIndex + 1) * 8), 2) + parseInt(wildCard.slice(groupIndex * 8, (groupIndex + 1) * 8), 2) + 1).toString(2));
        console.log(ipBin)
        var mid = (parseInt(ipBin.slice(groupIndex * 8, (groupIndex + 1) * 8), 2) + parseInt(wildCard.slice(groupIndex * 8, (groupIndex + 1) * 8), 2) + 1).toString(2);
        while (mid.length < 8) {
            mid = '0' + mid;
        }
        ipBin = start + mid + end;
    }
    return {title: 'All Possible /' + subnetCIDR + ' Networks for ' + binToDecSet(ipStart).replace(/\.0\./g, '.*.').replace(/\.0$/, '.*'), result: result};
}

$('form').submit(function (e) {
    e.preventDefault();
    $('.result-wrapper').addClass('hide');
    $('.all-networks').addClass('hide');
    $('.all-networks').find('tbody').empty();
    ipShowError.hide();
    var rawData = $(this).serializeArray();
    var data = {}
    for (i in rawData) {
        data[rawData[i].name] = rawData[i].value;
    }
    if (!ValidateIPaddress(data.ip)) {
        ipShowError.show();
    } else {
        var wildCard = getWildCard(parseInt(data.subnet));
        var netAddr = calNetAddr(data.ip, parseInt(data.subnet));
        var totalIPs = Math.pow(2, (wildCard.match(/1/g) || []).length);
        var result = [];
        result.push(data.ip);
        result.push(netAddr);
        result.push(getUsableIPRange(netAddr, wildCard));
        result.push(getBroadCastAddr(netAddr, wildCard));
        result.push(totalIPs);
        result.push(totalIPs > 1 ? totalIPs - 2 : 0);
        result.push(binToDecSet(getBinSubnet(data.subnet)));
        result.push(binToDecSet(wildCard));
        result.push(getBinSubnet(data.subnet));
        result.push(getClass(data.ip));
        result.push('/' + data.subnet);
        result.push(isIPPrivate(data.ip) ? 'Private' : 'Public');
        result.push(data.ip + '/' + data.subnet);
        result.push(decSetToBin(data.ip));
        result.push(parseInt(decSetToBin(data.ip), 2));
        result.push(parseInt(decSetToBin(data.ip), 2).toString(16));
        for (var i = 0; i < $('table tr').length; i++) {
            if (result[i] === undefined) {
                break;
            }
            $('table tr:eq(' + i + ')').find('td:eq(1)').text(result[i]);
        }
        $('.result-wrapper').removeClass('hide');
        var allNetworkResult = getAllNetwork(data.ip, parseInt(data.subnet));
        var networks = allNetworkResult.result;
        if (networks) {
            $('.all-networks').find('#table-title').text(allNetworkResult.title);
            for (i in networks) {
                var $row = $(`
                    <tr>
                        <td>` + networks[i].network + `</td>
                        <td>` + networks[i].range + `</td>
                        <td>` + networks[i].broadcast + `</td>
                    </tr>
                `);
                $('.all-networks').find('tbody').append($row);
            }
            $('.all-networks').removeClass('hide');
        }
    }
});