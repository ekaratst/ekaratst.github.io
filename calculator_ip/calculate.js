function convertSubnetCIDR(subnetCIDR){
    var bin = "";
    for(var i = 0; i < 32; i++)
    {
        if(i < subnetCIDR){
            bin +=1;
        }
        else {
            bin += 0;
        }
    }
    var result = [];
    for(var i = 0; i < 4; i++){
        var set = bin.slice(8*i, 8*(i+1));
        var dec = parseInt(set, 2);
        result.push(dec);
    }
    return result.join('.');
}

function ValidateIPaddress(ipaddress)   
{  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))  
    {  
        return true;
    }  
    return false;
}  

for(var i =1; i<=32; i++)
{
    $("select.subnet").append("<option value=\""+ i +"\" >"+ convertSubnetCIDR(i) + '/' + i +"</option>")
}

$('form').submit(function(e) {
    e.preventDefault();
    var rawdata = $(this).serializeArray();
    var data = {}; 
    for(var i = 0; i<rawdata.length; i++){
        data[rawdata[i].name] = rawdata[i].value;
    }
    console.log(data);
    if(!ValidateIPaddress(data.ip)){
        alert("Please provide a valid IP address.");
        return;
    }
});