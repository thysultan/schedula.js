fiber = schedula(60);

fiber.push(true, null, (a, b) => {
	console.log(a, b);
}, 3, [1, 2]);

(function () {
	var a = document.getElementById('a');
	var b = document.getElementById('b');
	var c = document.getElementById('c');

	var aWidth = 300;
	var bWidth = 300;
	var cWidth = 300;

	a.style.width = aWidth + 'px';
	b.style.width = bWidth + 'px';
	c.style.width = cWidth + 'px';

	function animate (width) {
		a.style.width = width + 'px';
	}

	// schedula
	var id = setInterval(function () {
		if (aWidth !== 301) {
			fiber.push(true, null, animate, 1, [aWidth++]);
		}
	}, 1000/60);

	
	// requestAnimationFrame
	function loop(fn) {
		(function animLoop() {
			if (fn()) {
				requestAnimationFrame(animLoop);
			}
		})();
	}

	function anim () {
		if (bWidth === 300) {
			return false;
		}
		bWidth += 1;
		b.style.width = bWidth + 'px';
		return true;
	}

	// setInterval
	var id2 = setInterval(function() {
		if (cWidth !== 300) {
			cWidth += 1;
			c.style.width = cWidth + 'px';
		}
	}, 1000/60);

	function start () {
  		a.style.width = aWidth = 0;
  		b.style.width = bWidth = 0;
  		c.style.width = cWidth = 0;

  		loop(anim);
	}

	start();

	document.getElementById('reset').addEventListener('click', start);
})();

console.log(fiber.work);