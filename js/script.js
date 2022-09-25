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
	makeNode('body', 'clock', localStorage.nodeObject)
	clockUpdate()
	setInterval(clockUpdate, 1000)

	/* Shortcuts */
	loadShortcuts()

	// Drag Shortcuts
	$('.shortcut').on('dragstart', function (event) {
		$(this).attr('id', 'dragging')
		$.event.addProp('dataTransfer')
		event.dataTransfer.setData('Text', event.target.id)
		$('.shortcut-trash').show()
		$(this).css('opacity', '0.01')
	})
	$('.shortcut').on('dragend', function () {
		$(this).css('opacity', '1')
		$(this).removeAttr('id')
		$('.shortcut-trash').hide()
		updateShortcuts()
	})
	$('.shortcuts').on('dragover', function (event) {
		event.preventDefault()
	})
	$('.shortcut').on('dragover', function () {
		$('#dragging').insertBefore($(this))
	})

	//  Shortcut Trash
	makeNode('body', 'shortcut_trash', localStorage.nodeObject)
	$('.shortcut-trash').on('dragover', function (event) {
		event.preventDefault()
	})
	var counter = 0
	$('.shortcut-trash').on('dragenter', function (event) {
		counter++
		$('.shortcut-trash').css({
			'background-color':
				'hsl(var(--color-background-h),var(--color-background-s),calc(var(--color-background-l) + 17%),0.5)',
			fill: 'hsl(var(--color-primary-h),var(--color-primary-s),var(--color-primary-l),0.75)',
		})
	})
	$('.shortcut-trash').on('dragleave', function (event) {
		counter--
		if (counter === 0) {
			$('.shortcut-trash').css({
				'background-color':
					'hsl(var(--color-background-h),var(--color-background-s),calc(var(--color-background-l) + 15%),0.25)',
				fill: 'hsl(var(--color-primary-h),var(--color-primary-s),var(--color-primary-l),0.5)',
			})
		}
	})
	$('.shortcut-trash').on('drop', function (event) {
		$('#dragging').remove()
		$('.shortcut-trash').hide()
		updateShortcuts()
	})

	/* Settings */
	makeNode('body', 'settings_icon', localStorage.nodeObject),
	makeNode('body', 'settings_pane', localStorage.nodeObject)
	$('.settings-options').html(nodeMaker('appearance_tab', localStorage.nodeObject))
	$('#appearance_tab').addClass('selected')

	// Open and close settings
	function openSettings() {
		$('.shortcut').attr({ tabindex: -1 })
		$('.settings-icon').attr({ tabindex: -1 })
		$('.settings-pane').css({display: 'flex', opacity: 1})
		$('.selected').focus()
	}
	function closeSettings() {
		$('.shortcut').attr({ tabindex: 0 })
		$('.settings-icon').attr({ tabindex: 0 })
		$('.settings-pane').hide().css('opacity', 0)
	}
	$(document).keydown(function (event) {
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
		$('.settings-options > *').css('display', 'none')
		$('.settings-options').html(nodeMaker(event.target.id, localStorage.nodeObject))

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
	$('body').append($('<div>').addClass('shortcuts'))
	if (localStorage.shortcuts) {
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
	$(parent).append(
		nodeMaker(node, key)
	)
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
   	// 	$('<div>').addClass('clock').append($('<div>').addClass('time'), $('<div>').addClass('day'))
	localStorage.nodeObject = JSON.stringify({
		clock: {
			tag: 'div',
			cls: 'clock',
			child: [
				{
					tag: 'div',
					cls: 'time'
				},
				{
					tag: 'div',
					cls: 'day'
				}
			]
		},
		shortcut_trash: {
			tag: 'div',
			cls: 'shortcut-trash',
			child: {
				tag: 'svg',
				attr: {
					width: '100%',
					xmlns: 'http://www.w3.org/2000/svg',
					x: '0px',
					y: '0px',
					viewBox: '0 0 24 24',
				},
				child: [
					{
						tag: 'path',
						attr: {
							d: 'M0 0h24v24H0V0z',
							fill: 'none',
						},
					},
					{
						tag: 'path',
						attr: {
							d: 'M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z',
						},
					},
				],
			},
		},
		settings_icon: {
			tag: 'button',
			cls: 'settings-icon',
			child: {
				tag: 'svg',
				attr: {
					width: '100%',
					xmlns: 'http://www.w3.org/2000/svg',
					x: '0px',
					y: '0px',
					viewBox: '0 0 32 32',
				},
				child: {
					tag: 'path',
					attr: {
						d: 'M29.6,12.7c-0.1-0.5-0.6-0.8-1.1-0.8c-1.2,0.2-2.4-0.4-3-1.5c-0.6-1-0.5-2.4,0.2-3.3c0.3-0.4,0.3-1-0.1-1.3 C24,4.3,22.1,3.2,20,2.6c-0.5-0.1-1,0.1-1.2,0.6C18.3,4.3,17.2,5,16,5s-2.3-0.7-2.8-1.8C13,2.7,12.5,2.4,12,2.6 C9.9,3.2,8,4.3,6.4,5.9C6,6.2,6,6.8,6.3,7.2c0.7,1,0.8,2.3,0.2,3.3c-0.6,1-1.8,1.6-3,1.5c-0.5-0.1-1,0.3-1.1,0.8 C2.1,13.8,2,14.9,2,16s0.1,2.2,0.4,3.3C2.5,19.8,3,20.1,3.5,20c1.2-0.2,2.4,0.4,3,1.5c0.6,1,0.5,2.4-0.2,3.3c-0.3,0.4-0.3,1,0.1,1.3 c1.6,1.5,3.6,2.7,5.7,3.3c0.5,0.1,1-0.1,1.2-0.6c0.5-1.1,1.6-1.8,2.8-1.8s2.3,0.7,2.8,1.8c0.2,0.4,0.5,0.6,0.9,0.6 c0.1,0,0.2,0,0.3,0c2.1-0.6,4.1-1.8,5.7-3.3c0.4-0.4,0.4-0.9,0.1-1.3c-0.7-1-0.8-2.3-0.2-3.3c0.6-1,1.8-1.6,3-1.5 c0.5,0.1,1-0.3,1.1-0.8c0.3-1.1,0.4-2.2,0.4-3.3S29.9,13.8,29.6,12.7z M16,20c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S18.2,20,16,20z',
					},
				},
			},
		},
		settings_pane: {
			tag: 'div',
			cls: 'settings-pane',
			child: [
				{
					tag: 'nav',
					cls: 'settings-nav',
					child: {
						tag: 'ul',
						child: [
							{
								tag: 'li',
								child: {
									tag: 'button',
									cls: 'settings-tab',
									attr: {
										id: 'appearance_tab',
										tabindex: 0,
									},
									child: '🎨 &nbsp Appearance',
								},
							},
							{
								tag: 'li',
								child: {
									tag: 'button',
									cls: 'settings-tab',
									attr: {
										id: 'bookmarks_tab',
										tabindex: 0,
									},
									child: '🚩 &nbsp Bookmarks',
								},
							},
							{
								tag: 'li',
								child: {
									tag: 'button',
									cls: 'settings-tab',
									attr: {
										id: 'shortcuts_tab',
										tabindex: 0,
									},
									child: '🏁 &nbsp Shortcuts	',
								},
							},
						],
					},
				},
				{
					tag: 'div',
					cls: 'settings-options',
				},
			],
		},
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
