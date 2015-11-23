
//f1 tajes longer to run then f2
function onef(a,b){
	setTimeout(function() {
   	console.log("one f"+a+b);
	}, 3000);
}


function twof(a,b){
	console.log("two f"+b+a);
}


//when brough together in on method, they are nto execute sequentially
function bring_tog(){
	onef()(twof());	
}


bring_tog("yo","d");
//result: 
//two fundefinedundefined
//one fundefinedundefined
