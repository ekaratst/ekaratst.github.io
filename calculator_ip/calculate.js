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
for(var i =1; i<=32; i++)
{
    $("select.subnet").append("<option value=\""+ i +"\" >"+ convertSubnetCIDR(i) + '/' + i +"</option>")
}