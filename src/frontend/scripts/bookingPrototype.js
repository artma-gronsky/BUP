oCanvas.domReady(function () {
    
});


var canvas = oCanvas.create({
	canvas: "#canvas"
});

var image = canvas.display.image({
	x: 0,
	y: 0,
	//origin: { x: "center", y: "center" },
	image: "img/plan-bara.jpeg"
});

canvas.addChild(image);

var clickOnPlace = false;
canvas.bind("click tap",function(){

    // hack: use children position check;
if(clickOnPlace)
return;

    var x = canvas.mouse.x;
    var y = canvas.mouse.y;

    // it will be place that user can book
    var place = canvas.display.rectangle({
        x: x,
        y: y,
        origin: { x: "center", y: "center" },
        width: 10,
        height: 10,
       // fill: "#009933",
        stroke: "5px #009933",
        join: "round"
    });


    canvas.addChild(place);

    console.log(canvas);

    var dragOptions = { changeZindex: true };
    //place.dragAndDrop(dragOptions);
    
    
    
    place.bind("click tap", function(){
        clickOnPlace = true;
        canvas.removeChild(place);
        
        setTimeout(function(){
            clickOnPlace = false;
        }, 500);
    })

})