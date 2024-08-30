$(document).ready(function () {
	/* Shortcuts */

	loadShortcuts()

	// Drag Shortcuts
	$('.shortcut').on('dragstart', function (event) {
		$(this).addClass('dragging')
		$.event.addProp('dataTransfer')
		event.dataTransfer.setData('Text', event.target.id)
		$('.shortcut-trash').show()
		$(this).css('opacity', '0.01')
	})
	$('.shortcut').on('dragend', function () {
		$(this).removeClass('dragging')
		$(this).css('opacity', '1')
		$('.shortcut-trash').hide()
		updateShortcuts()
	})
	$('.shortcuts').on('dragover', function (event) {
		event.preventDefault()
		const neighbour = getNeighbour(event.clientX)
		if (neighbour == null) $('.shortcuts').append($('.dragging'))
		else $('.dragging').insertBefore(neighbour)
	})
	function getNeighbour(x) {
		const neighbours = $('.shortcut:not(.dragging)').toArray()
		return neighbours.reduce(
			function (closest, child) {
				const box = child.getBoundingClientRect()
				const offset = x - box.left - box.width / 2
				if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }
				else return closest
			},
			{ offset: Number.NEGATIVE_INFINITY }
		).element
	}

	// Shortcut Trash
	$('.shortcut-trash').on('dragover', function (event) {
		event.preventDefault()
	})
	var counter = 0
	$('.shortcut-trash').on('dragenter', function (event) {
		counter++
		document.querySelector('.shortcut-trash').classList.toggle('drag-enter')
	})
	$('.shortcut-trash').on('dragleave', function (event) {
		counter--
		document.querySelector('.shortcut-trash').classList.toggle('drag-enter')
	})
	$('.shortcut-trash').on('drop', function (event) {
		$('.dragging').remove()
		$('.shortcut-trash').hide()
		document.querySelector('.shortcut-trash').classList.toggle('drag-enter')
		updateShortcuts()
	})

	/* Settings */

	// Open and close settings
	function openSettings() {
		$('.settings-pane').css('display', 'flex')
		$('.selected').focus()
	}
	function closeSettings() {
		$('.settings-pane').hide()
	}
	$(document).keydown(function (event) {
		// revolving tab navigation feature for settings pane
		var current_tab = $('.settings-tab.selected').attr('id')
		var first_tab = $('.settings-tab').first().attr('id')
		var last_tab = $('.settings-tab').last().attr('id')
		if (event.which == 9 && !event.shiftKey && $('.settings-pane').css('display') != 'none') {
			if (current_tab == last_tab) {
				event.preventDefault()
				$('#' + first_tab).focus()
			}
		}
		if (event.which == 9 && event.shiftKey && $('.settings-pane').css('display') != 'none') {
			if (current_tab == first_tab) {
				event.preventDefault()
				$('#' + last_tab).focus()
			}
		}
	})

	// Open settings with settings icon
	$('.settings-icon').click(function () {
		if ($('.settings-pane').css('display') == 'none') {
			openSettings()
		} else {
			closeSettings()
		}
		$('.settings-icon').blur()
	})

	// Open settings with keyboard shortcut "shift + ."
	$(document).keydown(function (event) {
		if (event.which === 190 && event.shiftKey) {
			if ($('.settings-pane').css('display') == 'none') {
				openSettings()
			} else {
				closeSettings()
			}
		}
	})

	// Close settings when clicked outside
	$(document).click(function (event) {
		var container = $('.settings-pane')
		var icon = $('.settings-icon')
		if (
			!container.is(event.target) &&
			!container.has(event.target).length &&
			!icon.is(event.target) &&
			!icon.has(event.target).length
		) {
			closeSettings()
		}
	})

	// Close settings when esc key is hit
	$(document).keydown(function (event) {
		if (event.which === 27) {
			closeSettings()
		}
	})

	// Settings Tabs
	$('.settings-tab').focus(function (event) {
		$(this).click()

		$('#' + $('.settings-tab.selected').attr('id').split('-')[0] + '-options').css(
			'display',
			'none'
		)

		$('.settings-tab').removeClass('selected')
		$(this).addClass('selected')

		$('#' + $('.settings-tab.selected').attr('id').split('-')[0] + '-options').css(
			'display',
			'block'
		)

		// load settings inputs

		if (event.target.id == 'appearance-tab') {
			bkgImgBtnStatus()
		}

		if (event.target.id == 'shortcuts-tab') {
			updateShortcutsAlignmentSelector()
		}
	})

	/* Settings Functions */

	// Load Background Image
	if (localStorage.backgroundImage) {
		$('body').css('background-image', localStorage.backgroundImage)
	}

	// Change Background Image
	function bkgImgBtnStatus() {
		if (localStorage.backgroundImage) {
			$('#setting-background-image button').html('Remove')
		} else {
			$('#setting-background-image button').html('Upload Image')
		}
	}
	$(document).on('change', '#input-background-image', function () {
		// upload background image
		if (this.files && this.files[0]) {
			var img = document.createElement('img')
			img.src = URL.createObjectURL(this.files[0])
			img.onload = function () {
				var canvas = document.createElement('canvas')
				var context = canvas.getContext('2d')
				canvas.height = this.naturalHeight
				canvas.width = this.naturalWidth
				context.drawImage(this, 0, 0)
				var url = 'url(' + canvas.toDataURL('image/jpeg') + ')'
				$('body').css('background-image', url)
				localStorage.backgroundImage = url
				bkgImgBtnStatus()
			}
			document.querySelector('#input-background-image').value = ''
		}
	})
	$(document).on('click', '#setting-background-image button', function () {
		// remove background image
		if (localStorage.backgroundImage) {
			$('body').css('background-image', 'none')
			delete localStorage.backgroundImage
			bkgImgBtnStatus()
		} else {
			$('#input-background-image').click()
		}
	})

	// Align Shortcuts
	function alignShortcuts() {
		if (localStorage.shortcutsAlignment == 'Center') {
			$('.shortcuts').css('margin', '3vh auto 0 auto')
		} else if (localStorage.shortcutsAlignment == 'Left') {
			$('.shortcuts').css('margin', '3vh auto 0 0')
		} else if (localStorage.shortcutsAlignment == 'Right') {
			$('.shortcuts').css('margin', '3vh 0 0 auto')
		}
	}
	alignShortcuts()

	$(document).on('change', '#input-align-shortcuts', function () {
		localStorage.shortcutsAlignment = $('#input-align-shortcuts').find(':selected').text()
		alignShortcuts()
	})

	function updateShortcutsAlignmentSelector() {
		if (localStorage.shortcutsAlignment)
			$('#input-align-shortcuts').val(localStorage.shortcutsAlignment)
	}

	// Change Colors
	$(document).on('change', '#input-color-primary', function () {
		localStorage.colorPrimary = JSON.stringify(hexToHSL($(this).val()))
		updateColors()
	})
	$(document).on('change', '#input-color-accent', function () {
		localStorage.colorAccent = JSON.stringify(hexToHSL($(this).val()))
		updateColors()
	})
	$(document).on('change', '#input-color-background', function () {
		localStorage.colorBackground = JSON.stringify(hexToHSL($(this).val()))
		updateColors()
	})

	function updateColors() {
		if (localStorage.colorPrimary) {
			document.documentElement.style.setProperty(
				'--color-primary-h',
				JSON.parse(localStorage.colorPrimary).h
			)
			document.documentElement.style.setProperty(
				'--color-primary-s',
				JSON.parse(localStorage.colorPrimary).s
			)
			document.documentElement.style.setProperty(
				'--color-primary-l',
				JSON.parse(localStorage.colorPrimary).l
			)
		}
		if (localStorage.colorAccent) {
			document.documentElement.style.setProperty(
				'--color-accent-h',
				JSON.parse(localStorage.colorAccent).h
			)
			document.documentElement.style.setProperty(
				'--color-accent-s',
				JSON.parse(localStorage.colorAccent).s
			)
			document.documentElement.style.setProperty(
				'--color-accent-l',
				JSON.parse(localStorage.colorAccent).l
			)
		}
		if (localStorage.colorBackground) {
			document.documentElement.style.setProperty(
				'--color-background-h',
				JSON.parse(localStorage.colorBackground).h
			)
			document.documentElement.style.setProperty(
				'--color-background-s',
				JSON.parse(localStorage.colorBackground).s
			)
			document.documentElement.style.setProperty(
				'--color-background-l',
				JSON.parse(localStorage.colorBackground).l
			)
		}
	}
	updateColors()

	if (localStorage.colorPrimary)
		$('#input-color-primary').val(JSON.parse(localStorage.colorPrimary).hex)
	if (localStorage.colorAccent)
		$('#input-color-accent').val(JSON.parse(localStorage.colorAccent).hex)
	if (localStorage.colorBackground)
		$('#input-color-background').val(JSON.parse(localStorage.colorBackground).hex)
})

/* Function Definitions */

// Load shortcuts on page load from Local Storage
function loadShortcuts() {
	if (localStorage.shortcuts) {
		$('body').append($('<div>').addClass('shortcuts'))
		var shortcuts = JSON.parse(localStorage.shortcuts)
		for (i in shortcuts) {
			var img
			if (!shortcuts[i].icon) {
				img = shortcuts[i].name.slice(0, 1).toUpperCase()
				img = $('<span>').html(img)
			} else {
				img = $('<img>').attr('src', shortcuts[i].icon)
			}
			var div = $('<a>')
				.addClass('shortcut')
				.attr({
					draggable: 'true',
					name: shortcuts[i].name,
					tabindex: 0,
					href: shortcuts[i].url,
				})
				.html(img)
			var label = $('<div>').addClass('label').html(shortcuts[i].name)
			div.append(label)
			$('.shortcuts').append(div)
		}
	}
}

// Update shortcuts data in Local Storage
function updateShortcuts() {
	var shortcuts = new Array()
	$('.shortcut').each(function (i) {
		shortcuts[i] = {
			name: $(this).attr('name'),
			url: $(this).attr('href'),
			icon: $(this).children().attr('src'),
		}
	})
	localStorage.shortcuts = JSON.stringify(shortcuts)
}

// HEX to HSL Color space
function hexToHSL(H) {
	// Convert hex to RGB first
	let r = 0,
		g = 0,
		b = 0
	if (H.length == 4) {
		r = '0x' + H[1] + H[1]
		g = '0x' + H[2] + H[2]
		b = '0x' + H[3] + H[3]
	} else if (H.length == 7) {
		r = '0x' + H[1] + H[2]
		g = '0x' + H[3] + H[4]
		b = '0x' + H[5] + H[6]
	}
	// Then to HSL
	r /= 255
	g /= 255
	b /= 255
	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0

	if (delta == 0) h = 0
	else if (cmax == r) h = ((g - b) / delta) % 6
	else if (cmax == g) h = (b - r) / delta + 2
	else h = (r - g) / delta + 4

	h = Math.round(h * 60)

	if (h < 0) h += 360

	l = (cmax + cmin) / 2
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
	s = +(s * 100).toFixed(1)
	l = +(l * 100).toFixed(1)

	h = h.toString()
	s = s.toString() + '%'
	l = l.toString() + '%'

	return { h: h, s: s, l: l, hex: H }
}

/* Legacy */

// // Create DOM elements
// function nodeMaker(node, key) {
// 	if (key) {
// 		key = JSON.parse(key)
// 		node = key[node]
// 	}
// 	var element
// 	if (node.tag == 'svg' || node.tag == 'path') {
// 		element = document.createElementNS('http://www.w3.org/2000/svg', node.tag)
// 		if (node.attr) {
// 			$.each(node.attr, function (i, val) {
// 				element.setAttribute(i, val)
// 			})
// 		}
// 		if (node.child) {
// 			if ($.type(node.child) == 'object') {
// 				element.appendChild(nodeMaker(node.child))
// 			} else if ($.type(node.child) == 'array') {
// 				$.each(node.child, function (i, val) {
// 					element.appendChild(nodeMaker(val))
// 				})
// 			}
// 		}
// 	} else {
// 		element = $('<' + node.tag + '>')
// 		if (node.cls) {
// 			if ($.type(node.cls) == 'string') {
// 				element.addClass(node.cls)
// 			} else if ($.type(node.cls) == 'array') {
// 				$.each(node.cls, function (i, val) {
// 					element.addClass(val)
// 				})
// 			}
// 		}
// 		if (node.attr) {
// 			$.each(node.attr, function (i, val) {
// 				element.attr(i, val)
// 			})
// 		}
// 		if (node.child) {
// 			if ($.type(node.child) == 'string') {
// 				element.html(node.child)
// 			} else if ($.type(node.child) == 'object') {
// 				element.html(nodeMaker(node.child))
// 			} else if ($.type(node.child) == 'array') {
// 				$.each(node.child, function (i, val) {
// 					element.append(nodeMaker(val))
// 				})
// 			}
// 		}
// 		if (node.css) {
// 			$.each(node.css, function (i, val) {
// 				element.css(i, val)
// 			})
// 		}
// 	}
// 	return element
// }
// function makeNode(parent, node, key) {
// 	$(parent).append(nodeMaker(node, key))
// }
