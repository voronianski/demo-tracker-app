/**
 * Some helpful app methods
 */

/*
 * Calculate difference between db date of init and current one
 * oldDate {String} - timer start date
 */
exports.dateDifference = function (oldDate) {
	var today = new Date(),
		past = new Date(oldDate),
		ms = today - past, 
		h, m, s;
	
	h = Math.floor(ms / 3600000);
	m = Math.floor((ms % 3600000) / 60000);
	s = Math.floor(((ms % 3600000) % 60000) / 1000);

	return h + ':' + m + ':' + s;
}

/*
 * Replace string characters at special position
 * string {String} - string in which do changes
 * index {Number} - where to change
 * character {String} - letter that will replace old one 
 */
exports.replaceAt = function (string, index, character) {
	return string.substr(0, index) + character + string.substr(index + character.length);
}

/*
 * Make 0:00:00 into 0h 00m 00s
 * time {String} - ellapsed time string
 */
exports.replaceDots = function (time) {
	if (typeof(time) !== 'string') {
		return false;
	}

	var arr = time.split(':');

	return arr[0] + 'h ' + arr[1] + 'm ' + arr[2] + 's';
}
