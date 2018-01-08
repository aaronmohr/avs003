var buttons = 128,
	rows = 8;
var cols = rows;
var wLoaded = false,
	nLoaded = false;

$(document).ready(function() {
	
    var holder = $('#board .holder'),
		note = $('.note');
	var notes = [];

	for (var i = 0; i < rows; i++) {
		notes[i] = new Howl({
            urls: ['audio/' + i + '.mp3'],
			onload: loadCount(i + 1)
		});
	}

	$(window).load(function() {
		bindUserActions();
		initControls();
		wLoaded = true;
		for (var i = 0; i < rows; i++) {
			bindNote(i);
		}
	});

	function loadCount(i) {
		if (i === rows) {
			nLoaded = true;
		}
	}

	function bindNote(currNote) {
		$('#board .holder:nth-child(' + cols + 'n + ' + currNote + ')')
		.on('webkitAnimationIteration mozAnimationIteration animationiteration', 
		function() {
			if ($(this).hasClass('active')) {
				var currNote = $(this).attr('data-note');
				notes[currNote].play();
			}
		});
	}

	function bindUserActions() {
		
        $(note).mousedown(function() {
			$(this).toggleClass("active");
			$(this).parent().toggleClass("active");
		});
        
		$(document).mousedown(function() {
			$(note).bind('mouseover', function() {
				$(this).toggleClass("active");
				$(this).parent().toggleClass("active");
			});
		}).mouseup(function() {
			$(note).unbind('mouseover');
		});
		
	}

	function initControls() {
		$('#reset').on('click', function() {
			$('.active').removeClass('active');
		});
		
        $('#audio').on('click', function() {
			if ($(this).hasClass("mute"))
				Howler.unmute();
			else
				Howler.mute();
			$(this).toggleClass('mute');
		});

	}

	//:x Represents ON //;x Represents OFF
    
	function importLoop(dialog) {
		var noteCode = '',
			 noteState,
			 error = false,
			 note;

		noteCode = dialog.find('textarea#importCode').val();
		dialog.dialog("close");

		noteCode = noteCode.replace("[", "");
		noteCode = noteCode.replace("]", "");

		if (noteCode.charAt(0) === ":")
			noteState = 1;
		else if (noteCode.charAt(0) === ";")
			noteState = 0;
		else {
			alert("Your note code wasn't recognised");
			error = true;
		}

		if (!error) {
			$('.active').removeClass('active');
			noteCode = noteCode.substr(1);
			var splitCode = noteCode.split(/:|;/g);
			var noteCounter = 0;

			for (i = 0; i < splitCode.length; i++) {
				var currNum = parseInt(splitCode[i]);

				if (noteState) {
					for (var n = 0; n < currNum; n++) {
						noteCounter++;
						note = $('#board span:nth-child(' + noteCounter + ')');
						note.addClass('active');
						note.children().addClass('active');
					}
				} else {
					noteCounter = noteCounter + currNum;
				}
				noteState = !noteState;
			}
		}
	}
});