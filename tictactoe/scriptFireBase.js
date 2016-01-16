$(document).ready(assignPlayers);

function assignPlayers(){
	var myFirebase = new Firebase('https://noughts-and-crosses.firebaseio.com/');

	function gameIsBeingPlayed(){
		var $winText = $('#winText');

		myFirebase.on('value',function(dataSnapshot){
			
			if (dataSnapshot.hasChild("Player1")===false){
				console.log('false')
				$('button').show();
				$winText.hide();
				return;
			};



			$('button').hide();
			$winText.text('Please wait, a game is in progress');
			$winText.show();
			console.log('in wait function')
		})
	}

	myFirebase.once('value',function(dataSnapshot){
		if (dataSnapshot.hasChild("Player2")){
			gameIsBeingPlayed();
		};
		// console.log('data',dataSnapshot.val())

	})
	// myFirebase.remove();
	$('button').click(function(){
		myFirebase.once('value',function(dataSnapshot){
				// myFirebase.child("Gamestatus").set('inplay');
				console.log(dataSnapshot.val(),': The val')
				player = dataSnapshot.val() === null ? 'Player1' : 'Player2';
				console.log(player);
				$('button').hide();


				// myFirebase.once('value',function(dataSnapshot){
				// 	if (dataSnapshot.hasChild("Player2")){
				// 		init(myFirebase,player);
				// 	}
				// })

		init(myFirebase,player);
			// $(window).unload(function(){
			// 	myFirebase.child(player).remove()
			// })
	})
	})
}

function init(myFirebase,player){
	

	console.log(player);
	$('body').show();
	var turnNumber = 0;
	myFirebase.child("Turn").set(0);
	console.log(turnNumber);
	var opponentMove;
	player1Squares = [];
	player2Squares = [];
	var otherPlayer, symbol, otherSymbol;
	if (player === 'Player1'){
		otherPlayer = 'Player2';
		symbol = 'crosses';
		otherSymbol = 'noughts';
	}else{
		otherPlayer = 'Player1';
		symbol = 'noughts';
		otherSymbol = 'crosses';
	}

		// myFirebase.on(player,function(){
		// if (player === 'Player1'){
		// 			$('#p1').css('visibility', 'visible');
		// 		}else{
		// 			$('#p2').css('visibility', 'visible');
		// 		}
		// 	})

myFirebase.child(player).child('Move').set('');

myFirebase.child(otherPlayer).on('child_changed',function(dataSnapshot){
	opponentMove = '#' + dataSnapshot.val();

})

		// myFirebase.child("Gamestatus").on('child_changed', endGame('loser'));
		myFirebase.child("Gamestatus").on('value',function(dataSnapshot){
			if (dataSnapshot.val() === 'over'){ endGame('loser')};
			// console.log('Opponent move=====' + opponentMove);
		})

		myFirebase.on('value',function(dataSnapshot){
			turnNumber = dataSnapshot.val().Turn || 0;
			console.log('update screen');
			$(opponentMove).addClass(symbol + ' occupied');
		});
		
		$('td').click(function(){
			$this = $(this);
			console.log('Hello');
			if (!$this.hasClass('occupied')){
				
				if ((player === 'Player1') && (turnNumber % 2 === 0)){		
					myFirebase.child(player).child('Move').set($this.attr('id'));
					$this.attr('class','noughts');
					player1Squares = $this.attr('id').split('').concat(player1Squares);
					turnNumber ++;
					myFirebase.child('Turn').set(turnNumber);
					
				}else if ((player === 'Player2') && (turnNumber % 2 !== 0)){
					
					myFirebase.child(player).child('Move').set($this.attr('id'));
					$this.attr('class','crosses');
					player2Squares = $this.attr('id').split('').concat(player2Squares);
					turnNumber ++;
					myFirebase.child('Turn').set(turnNumber);
				}
			}

			player1Squares.sort();
			player2Squares.sort();
			var player1has3 = (/(.)\1{2}/i).test(player1Squares.join(''));
			var player2has3 = (/(.)\1{2}/i).test(player2Squares.join(''));
			if (player1has3 ){
				endGame('Player 1',myFirebase)
			}
			if (player2has3){
				endGame('Player 2', myFirebase)
			}
			else if (turnNumber === 9){
				endGame('Nobody', myFirebase);
				init();
			}
		})

function endGame(name,myFirebase){
	myFirebase.child('Gamestatus').set('over');
	var $winText = $('#winText');
	turnNumber = 0;
	setTimeout(function(){
		$('body').hide();
		$('td').removeClass('noughts crosses occupied');
		$winText.hide();
		assignPlayers();
	}, 1500)
	$winText.text(name + ' was victorious!!');
	$winText.show();
	myFirebase.remove();
	
}
}
