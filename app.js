/**
 * Created by thangnv on 6/24/15.
 */
'use strict';
const fs        = require('fs'),
    request     = require('request'),
    gm = require('gm'),
    //readChunk   = require('read-chunk'),
    fileType    = require('file-type');
let flag=false;


request('https://unsplash.com', function (error,response,body) {
        if(!error && response.statusCode == 200){
            console.log('ok');
            getImageUrl(body);
        } else {
            console.log('Please retype another url ...');
        }

    }
);

function getImageUrl (body) {
    var reg = /\<img src\=\"[ ]?https?:\/\/[a-z0-9\-\.\/\?\&\=]+(\")?/ig;
    var list =body.match(reg);
    for (var i = 0 ; i < list.length ;i++){
        downloadImage(list[i].substring(10,list[i].length),'image_'+i);
    }
}
function downloadImage(url,name){
    console.time('download');
    console.log(url);
    var ext = 'jpg';
    var req = request.get(url);
        req.on('error', function (error) {
            console.log(error);
        });
        req.once('data',function(chunk){
            ext = fileType(chunk).ext;
            //console.log(ext);
            if(fileType(chunk).ext != ('jpg'|'gif'|'png'|'jpeg')){
                 return;
            }
        });
    //req.pipe(imageResize(640,480));
    req.pipe(fs.createWriteStream('./images_origin/'+name+'.'+ext))
        .on('finish',function(){
            console.timeEnd('download');
            console.log('Done !!');
            //resize anh
            gm('./images_origin/'+name+'.'+ext)
            .resize(640,480).threshold(100)
            .write('./images_convert/'+name+'.'+ext, function (err) {
                if (!err) console.log('Done to resize file\n *************');
            });
        })
        .on('error', function (error) {
            console.log(error.message);
        });
}
