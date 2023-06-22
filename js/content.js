chrome.runtime.onMessage.addListener(function (request, sender, response) {
	//grab website icon
	if (request.topic == 'iconLinks') {
		let iconLinks = []
		document.querySelectorAll('link[rel*="icon"]').forEach(function (val) {
			iconLinks.push(val.href)
		})
		response({ iconLinks: iconLinks })
	}
})
