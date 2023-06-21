$(document).ready(function () {
	// Load DOM data
	if (!localStorage.nodeObject) {
		loadNodeObject()
	}
	// Load Background Image
	if (localStorage.backgroundImage) {
		$('body').css('background-image', localStorage.backgroundImage)
	}

	/* Clock */
	clockUpdate()
	setInterval(clockUpdate, 1000)

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
		document.querySelector('.shortcut-trash').classList.toggle('drag-over')
	})
	$('.shortcut-trash').on('dragleave', function (event) {
		counter--
		document.querySelector('.shortcut-trash').classList.toggle('drag-over')
	})
	$('.shortcut-trash').on('drop', function (event) {
		$('.dragging').remove()
		$('.shortcut-trash').hide()
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
		var current_tab = $('.settings-options div').attr('class')
		var first_tab = $('.settings-tab').first().attr('id')
		var last_tab = $('.settings-tab').last().attr('id')
		if (event.which == 9 && !event.shiftKey && $('.settings-pane').css('display') != 'none') {
			if (current_tab.split('-')[0] == last_tab.split('_')[0]) {
				event.preventDefault()
				$('#' + first_tab).focus()
			}
		}
		if (event.which == 9 && event.shiftKey && $('.settings-pane').css('display') != 'none') {
			if (current_tab.split('-')[0] == first_tab.split('_')[0]) {
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

	//Close settings when esc key is hit
	$(document).keydown(function (event) {
		if (event.which === 27) {
			closeSettings()
		}
	})

	//Settings Tabs
	$('.settings-tab').focus(function (event) {
		$(this).click()
		$('.settings-tab').removeClass('selected')
		$(this).addClass('selected')
		$('.settings-options').html('')
		makeNode('.settings-options', event.target.id, localStorage.nodeObject)

		if (event.target.id == 'appearance_tab') {
			bkgImgBtnStatus()
		}
	})

	/* Settings Functions */

	//Change Background Image
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
})

/* Function Definitions */

// Update time for clock
function clockUpdate() {
	var clock = new Date()
	var hour = clock.getHours()
	var min = clock.getMinutes()
	var day = clock.getDay()
	var date = clock.getDate()
	var month = clock.getMonth()
	var monthIndex = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]
	var dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	if (hour > 12) {
		hour = hour - 12
	}
	if (min < 10) {
		min = '0' + min
	}
	$('.time').html(hour + ':' + min)
	$('.day').html(dayIndex[day] + ', ' + date + ' ' + monthIndex[month])
}

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

// Create DOM elements
function nodeMaker(node, key) {
	if (key) {
		key = JSON.parse(key)
		node = key[node]
	}
	var element
	if (node.tag == 'svg' || node.tag == 'path') {
		element = document.createElementNS('http://www.w3.org/2000/svg', node.tag)
		if (node.attr) {
			$.each(node.attr, function (i, val) {
				element.setAttribute(i, val)
			})
		}
		if (node.child) {
			if ($.type(node.child) == 'object') {
				element.appendChild(nodeMaker(node.child))
			} else if ($.type(node.child) == 'array') {
				$.each(node.child, function (i, val) {
					element.appendChild(nodeMaker(val))
				})
			}
		}
	} else {
		element = $('<' + node.tag + '>')
		if (node.cls) {
			if ($.type(node.cls) == 'string') {
				element.addClass(node.cls)
			} else if ($.type(node.cls) == 'array') {
				$.each(node.cls, function (i, val) {
					element.addClass(val)
				})
			}
		}
		if (node.attr) {
			$.each(node.attr, function (i, val) {
				element.attr(i, val)
			})
		}
		if (node.child) {
			if ($.type(node.child) == 'string') {
				element.html(node.child)
			} else if ($.type(node.child) == 'object') {
				element.html(nodeMaker(node.child))
			} else if ($.type(node.child) == 'array') {
				$.each(node.child, function (i, val) {
					element.append(nodeMaker(val))
				})
			}
		}
		if (node.css) {
			$.each(node.css, function (i, val) {
				element.css(i, val)
			})
		}
	}
	console.log(element)
	return element
}
function makeNode(parent, node, key) {
	$(parent).append(nodeMaker(node, key))
}

// Define DOM elements
function loadNodeObject() {
	/*
        tag      : String
        cls      : String | Array[String]
        attr     : Object
        child    : String | Object | Array[Object]
		css		 : Object
    */
	localStorage.nodeObject = JSON.stringify({
		appearance_tab: {
			tag: 'div',
			cls: 'appearance-tab',
			child: {
				tag: 'form',
				cls: 'form',
				child: {
					tag: 'div',
					attr: { id: 'setting-background-image' },
					css: { 'align-items': 'center' },
					child: [
						{
							tag: 'div',
							child: 'Background Image',
						},
						{
							tag: 'button',
							attr: { type: 'button' },
						},
						{
							tag: 'input',
							attr: { id: 'input-background-image', type: 'file', accept: 'image/*' },
							css: { display: 'none' },
						},
					],
				},
			},
		},
		bookmarks_tab: {
			tag: 'div',
			cls: 'bookmarks-tab',
			child: {
				tag: 'form',
				cls: 'form',
				child: {
					tag: 'div',
					cls: 'form',
					child: [
						{
							tag: 'label',
							attr: { for: 'alignment-shortcuts' },
							child: 'Align Bookmarks',
						},
						{
							tag: 'select',
							attr: { id: 'align-shortcuts', name: 'alignments' },
							child: [
								{
									tag: 'option',
									attr: { value: '' },
									child: 'Center',
								},
								{
									tag: 'option',
									attr: { value: '' },
									child: 'Left',
								},
								{
									tag: 'option',
									attr: { value: '' },
									child: 'Right',
								},
							],
						},
					],
				},
			},
		},
		shortcuts_tab: {
			tag: 'div',
			cls: 'shortcuts-tab',
			child: {
				tag: 'form',
				cls: 'form',
				child: {
					tag: 'div',
					cls: 'form',
					child: [
						{
							tag: 'label',
							attr: { for: 'alignment-shortcuts' },
							child: 'Align Shortcuts',
						},
						{
							tag: 'select',
							attr: { id: 'align-shortcuts', name: 'alignments' },
							child: [
								{
									tag: 'option',
									attr: { value: '' },
									child: 'Center',
								},
								{
									tag: 'option',
									attr: { value: '' },
									child: 'Left',
								},
								{
									tag: 'option',
									attr: { value: '' },
									child: 'Right',
								},
							],
						},
					],
				},
			},
		},
	})
}
