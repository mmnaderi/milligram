;(function() {

	'use strict';

	var i,
		$description 		= document.querySelector('.description'),
		$download 		= document.querySelector('.download'),
		$popoverLinks 	= document.querySelectorAll('[data-popover]'),
		$popovers			= document.querySelectorAll('.popover'),
		$codeSnippets 	= document.querySelectorAll('.code-content'),
		$shareButtons 	= document.querySelectorAll('.share-dialog'),
		$anchors			= document.querySelectorAll('a'),
		request 			= new XMLHttpRequest(),
		entityMapObject 	= { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;', "/": '&#x2F;' };

	function init() {
		for (i = 0; i < $popoverLinks.length; i++) $popoverLinks[i].addEventListener('click', openPopover);
		document.addEventListener('click', closePopover);
		buildSnippets();
		getVersion();
		shareDialog();
		localhost();
	}

	function closePopover(e) {
		for (i = 0; i < $popovers.length; i++) $popovers[i].classList.remove('popover-open');
	}

	function openPopover(e) {
		e.preventDefault();
		if (document.querySelector(this.getAttribute('href')).classList.contains('popover-open')) {
			document.querySelector(this.getAttribute('href')).classList.remove('popover-open');
		}
		else {
			closePopover();
			document.querySelector(this.getAttribute('href')).classList.add('popover-open');
		}
		e.stopImmediatePropagation();
	}

	function escapeHtml(string) {
		return String(string).replace(/[&<>"'\/]/g, function(s) {
			return entityMapObject[s];
		});
	}

	function buildSnippets() {
		for (i = 0; i < $codeSnippets.length; i++) $codeSnippets[i].innerHTML = escapeHtml($codeSnippets[i].innerHTML);
	}

	function getVersion() {
		if ($description || $download) {
			request.open('GET', '//raw.githubusercontent.com/mmnaderi/milligram-rtl/master/package.json', true);
			request.onload = function() {
				if (this.status >= 200 && this.status < 400) {
					var version = JSON.parse( this.response ).version;
					if ($description) $description.innerHTML = $description.innerHTML+' <br><i><small>ورژن فعلی v'+version+'</small></i>';
					$download.setAttribute('href', 'https://github.com/mmnaderi/milligram-rtl/archive/v'+version+'.zip');
				}
				else {
					console.log( '// There was a connection error of some sort' );
				}
			};
			request.send();
		}
	}

	function shareDialog() {
		if ($shareButtons && window.innerWidth > 1200) {
			for (i = 0; i < $shareButtons.length; i++) {
				$shareButtons[i].addEventListener('click', function(e) {
					e.preventDefault();
					window.open(this.href, 'Share Dialog', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=650,height=450,top='+(screen.height/2-450/2)+',left='+(screen.width/2-650/2));
				});
			}
		}
	}

	function localhost() {
		if (window.location.hostname === 'localhost') {
			for (i = 0; i < $anchors.length; i++) $anchors[i].href = $anchors[i].href.replace('https://milligram.github.io', 'http://localhost:8100');
		}
	}

	init();

}());
