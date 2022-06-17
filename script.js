var folder = "./assets/images";
let j = 0
$.ajax({
    url : folder,
    success: function (data) {
        $(data).find("a").attr("href", function (i, val) {
            if( val.match(/\.(jpe?g|png|gif)$/) ) { 

                $("body").append(`<img src="${val}" id = "img${j}">`);
                const img = document.getElementById('img' + j)
                img.onload = function() {
                    console.log(this.width + 'x' + this.height);
                }
                j++;

            } 
        });
    }
});

LOL 