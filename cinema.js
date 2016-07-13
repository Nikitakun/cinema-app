'use strict';

//debounce for scroll and resize handlers
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}


//floating circle class
function MovingCircle() {
  this.parentCircle = document.getElementsByClassName('download-circle')[0],
  this.parentCircleHeight = this.parentCircle.offsetHeight,
  this.parentCircleWidth = this.parentCircle.offsetWidth,
  this.parentCircleVerCenter = this.parentCircleHeight / 2,
  this.parentCircleHorCenter = this.parentCircleWidth / 2,

  this.childCircle = document.getElementsByClassName('download-circle-moving-item')[0],
  this.childCircleHeight = this.childCircle.offsetHeight,
  this.childCircleWidth = this.childCircle.offsetWidth,
  this.childCircleHorOffset = this.childCircleWidth / 4;

  this.angle = 4.7,
  this.childCircleX = 0,
  this.childCircleY = 0,
  this.speed = 0.01;

  this.rotateCircle = this.rotateCircle.bind(this);
}

MovingCircle.prototype.rotateCircle = function() {
  requestAnimationFrame(this.rotateCircle);
  this.childCircle.style.transform = `translate(${this.childCircleX}px, ${this.childCircleY}px)`;
  this.childCircleX = Math.cos(this.angle) * this.parentCircleHorCenter - this.childCircleHorOffset;
  this.childCircleY = this.parentCircleVerCenter + Math.sin(this.angle) * this.parentCircleVerCenter;
  this.angle += this.speed;
};

var movingCircle = new MovingCircle();

window.addEventListener('load', movingCircle.rotateCircle);

//nav toggling
var menuIcon = document.getElementsByClassName('burger-icon-wrapper')[0];
var navScroll;

function onMenuClick(e) {
  e.target.classList.toggle('burger-icon-wrapper--active');
}

menuIcon.addEventListener('click', onMenuClick);

//appearing svg-pointers class
function Pointers() {
  this.svgPointer = document.getElementsByClassName('phone-pointer');
  this.svgContainer = document.getElementsByClassName('svg-cont');
  this.distanceToPointer = this.svgPointer[0].getBoundingClientRect().top + pageYOffset;

  this.drawPointer = this.drawPointer.bind(this);
}

Pointers.prototype.drawPointer = debounce(function() {
    if (pageYOffset >= this.distanceToPointer / 1.5) {
      this.svgPointer[0].classList.add('phone-pointer--reached');
      this.svgPointer[1].classList.add('phone-pointer--reached');
      this.svgContainer[0].classList.add('svg-cont--reached');
      this.svgContainer[1].classList.add('svg-cont--reached');
      window.removeEventListener('scroll', this.drawPointer);
    }
  }, 200);

var pointers = new Pointers();

window.addEventListener('scroll', pointers.drawPointer);

//managing price table toggling
var logos = document.getElementsByClassName('prices__logos-item');
var priceTables = document.getElementsByClassName('prices__table');

[].forEach.call(logos, function(item) {
  item.addEventListener('click', toggleCard);
});

function toggleCard(e) {
  var appleTable = priceTables[0], androidTable = priceTables[1],
  activeColor = 'rgba(234,75,54,0.5)';
  e.currentTarget.classList.add('prices__logos-item--active');
  if (e.currentTarget.classList.contains('apple-logo')) {
    logos[1].classList.remove('prices__logos-item--active');
    androidTable.style.backgroundColor = 'transparent';
    appleTable.style.backgroundColor = activeColor;
  } else {
    logos[0].classList.remove('prices__logos-item--active');
    appleTable.style.backgroundColor = 'transparent';
    androidTable.style.backgroundColor = activeColor;
  }
}

//making smooth scrolling to page sections
function defineDistances() {
	return {
		homeDistance: Math.round(pageYOffset + document.getElementById('Home').getBoundingClientRect().top),
	  featuresDistance: Math.round(pageYOffset + document.getElementById('Features').getBoundingClientRect().top),
	  actionDistance: Math.round(pageYOffset + document.getElementById('In-action').getBoundingClientRect().top),
	  pricesDistance: Math.round(pageYOffset + document.getElementById('Prices').getBoundingClientRect().top),
	  galleryDistance: Math.round(pageYOffset + document.getElementById('Gallery').getBoundingClientRect().top)
	}
}

function NavScroll() {
  this.links = document.getElementsByClassName('main-nav__item-link');

	this.distances = defineDistances();
}

NavScroll.prototype.scrollToSection = function(evt, target) {
  evt.preventDefault();
  var distance = pageYOffset - target;
  var motion = 0.2;
  var velocity = Math.round(distance * motion);
  var self = this;
  requestAnimationFrame(function() {
      if (pageYOffset !== target) {
        if (distance > 0) {
          document.body.scrollTop += velocity;
        } else if (distance < 0) {
          document.body.scrollTop -= velocity;
        }
        if (pageYOffset >= target - 4 && pageYOffset <= target + 4) {
          document.body.scrollTop = target;
          return;
        }
        self.scrollToSection(evt, target);
      } else {
        return;
      }
    });
};

function prepareScrolling() {
	navScroll = new NavScroll();
	[].forEach.call(navScroll.links, function(item, i) {
	    switch(i) {
	      case 0:
	        item.addEventListener('click', function(evt){return navScroll.scrollToSection(evt, navScroll.distances.homeDistance)});
	        break;
	      case 1:
	        item.addEventListener('click', function(evt){return navScroll.scrollToSection(evt, navScroll.distances.featuresDistance)});
	        break;
	      case 2:
	        item.addEventListener('click', function(evt){return navScroll.scrollToSection(evt, navScroll.distances.actionDistance)});
	        break;
	      case 3:
	        item.addEventListener('click', function(evt){return navScroll.scrollToSection(evt, navScroll.distances.pricesDistance)});
	        break;
	      case 4:
	        item.addEventListener('click', function(evt){return navScroll.scrollToSection(evt, navScroll.distances.galleryDistance)});
	        break;
	    }
	});
}

window.addEventListener('load', prepareScrolling);
window.addEventListener('resize', debounce(prepareScrolling, 200));
