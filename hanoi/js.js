$(document).ready(init);

function init(){
	var pieceSelected = false;
	var $box = $('.box');
	var thisColumnFullMeansAWin = $('.tower3');
	$('#play').click(function(){
		difficulty = parseInt($('#level').val());
		for (var i = difficulty+1; i <= 5 ; i++){
		$('.disk[data-id="'+ i +'"]').remove();		
	}
	$('.disk').show();
	})
	$box.click(function(){

		if (!pieceSelected){

			thePiece = $(this).children().first().children().first().remove();
			pieceSelected=true;

		}else if($(this).children().first().children().length === 0 || $(this).children().first().children().first().data('id') < thePiece.data('id')){
				$(this).children().first().prepend(thePiece)
				pieceSelected=false;
			}
	
		if (thisColumnFullMeansAWin.children().length === difficulty){
			
			alert('Congratulations! You won!');
		}
	})
}

