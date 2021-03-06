'use strict';
({
    updateRate: 50, // in milliseconds
    moveSpeed: 20, // in pixels, for agogo
    closeDistance: 30, // in pixels, for agogo
    fallDistance: 60, // in pixels, for grass
    fallSpeed: 5, // in pixels, for grass
    reactGrassTime: 2000, // in milliseconds
    eatingTime: 4000, // in milliseconds
    state: 'init',
    direction: null,
    restPlace: null,
    curTarget: null,
    agogo: null,
    chair: null,
    grassList: [],
    main: function() {
        var keyword = 'agogo';
        var url = document.location.href;
        var title = document.title;

        if (url.toLowerCase().search(keyword) == -1 &&
                title.toLowerCase().search(keyword) == -1) {
            return;
        }

        this.preloadImages();

        this.setMouseListener();

        this.makeAgogo();
        this.initAgogoSettings();
        this.startChasing();
    },
    setMouseListener: function() {
        var me = this;
        document.addEventListener('mouseup', function(evt) {
            me.makeGrass(evt.pageX - pageXOffset, evt.pageY - pageYOffset);
            me.noticeGrass();
        });
    },
    makeGrass: function(mouseX, mouseY) {
        var grass = document.createElement('div');
        var grassNumber = this.getRandomInt(3) + 1;
        grass.classList.add('agogo-chase-grass');
        grass.classList.add('agogo-chase-grass-' + grassNumber);
        document.body.appendChild(grass);

        var rect = grass.getBoundingClientRect();
        this.setElementLeftTop(grass, mouseX - rect.width / 2, mouseY - rect.height / 2);
        grass.setAttribute('data-fall-top', mouseY + this.fallDistance);
        grass.style.visibility = 'visible';

        this.grassList.push(grass);
    },
    noticeGrass: function() {
        var me = this;
        if (this.state == 'running-to-rest') {
            this.state = 'running-to-grass';
            this.aimFirstGrass();
        } else if (this.state == 'resting') {
            this.state = 'smell-grass';
            this.makeSureClass(this.agogo, 'agogo-resting', false);
            this.makeSureClass(this.agogo, 'agogo-smell-grass', true);
            setTimeout(function() {
                me.makeSureClass(me.agogo, 'agogo-smell-grass', false);
                me.state = 'running-to-grass';
                me.aimFirstGrass();
            }, this.reactGrassTime);
        }
    },
    aimFirstGrass: function() {
        if (this.grassList.length == 0) {
            return;
        }

        var firstGrass = this.grassList[0];
        var rect = firstGrass.getBoundingClientRect();
        var fallTop = this.getGrassFallTop(firstGrass);

        this.curTarget = {
            x: rect.left + rect.width / 2,
            y: fallTop,
        };
    },
    hideFirstGrass: function() {
        if (this.grassList.length == 0) {
            return;
        }

        var firstGrass = this.grassList[0];
        firstGrass.style.visibility = 'hidden';
    },
    makeAgogo: function() {
        this.agogo = document.createElement('div');
        this.agogo.setAttribute('id', 'agogo-chase-agogo');
        document.body.appendChild(this.agogo);
    },
    startChasing: function() {
        var me = this;

        this.curTarget = this.restPlace;
        this.state = 'running-to-rest';

        setInterval(function() {
            me.updateAgogo();
            me.updateGrass();
            //console.log(me.state);
        }, this.updateRate);
    },
    updateGrass: function() {
        var me = this;
        this.grassList.forEach(function(grass) {
            var rect = grass.getBoundingClientRect();
            var targetTop = me.getGrassFallTop(grass);
            if (rect.top > targetTop) {
                return;
            }
            me.setElementLeftTop(grass, rect.left, rect.top + me.fallSpeed);
        });
    },
    updateAgogoActionClass: function(targetAction) {
        var me = this;
        var className = null;
        var allActions = [
            'running',
            'eating',
        ];
        var allDirections = [
            'left',
            'right',
        ];

        allActions.forEach(function(iterAction) {
            className = 'agogo-' + iterAction;
            if (iterAction == targetAction) {
                me.makeSureClass(me.agogo, className, true);
            } else {
                me.makeSureClass(me.agogo, className, false);
            }

            allDirections.forEach(function(iterDirection) {
                className = 'agogo-' + iterAction + '-' + iterDirection;
                if (iterAction == targetAction && iterDirection == me.direction) {
                    me.makeSureClass(me.agogo, className, true);
                } else {
                    me.makeSureClass(me.agogo, className, false);
                }
            });
        });
    },
    makeSureClass: function(element, className, shouldExist) {
        if (element.classList.contains(className)) {
            if (!shouldExist) {
                element.classList.remove(className);
            }
        } else {
            if (shouldExist) {
                element.classList.add(className);
            }
        }
    },
    updateAgogo: function(rect) {
        var rect = this.agogo.getBoundingClientRect();

        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;

        var distance = this.calcDistance(this.curTarget.x, this.curTarget.y, centerX, centerY);

        if (distance < this.closeDistance) {
            this.onRunningClose();
            return;
        }

        if (centerX < this.curTarget.x) {
            this.direction = 'right';
        } else {
            this.direction = 'left';
        }
        this.updateAgogoActionClass('running');

        var ratio = this.moveSpeed / distance;
        var newLeft = rect.left + (this.curTarget.x - centerX) * ratio;
        var newTop = rect.top + (this.curTarget.y - centerY) * ratio;

        this.setElementLeftTop(this.agogo, newLeft, newTop);
    },
    onRunningClose: function() {
        var me = this;
        if (this.state == 'running-to-rest') {
            this.state = 'resting';
            this.makeSureClass(this.agogo, 'agogo-running', false);
            this.makeSureClass(this.agogo, 'agogo-resting', true);
        } else if (this.state == 'running-to-grass') {
            this.state = 'eating';
            this.updateAgogoActionClass('eating');
            this.hideFirstGrass();
            setTimeout(function() {
                var oldGrass = me.grassList.shift();
                document.body.removeChild(oldGrass);
                if (me.grassList.length == 0) {
                    me.state = 'running-to-rest';
                    me.curTarget = me.restPlace;
                } else {
                    me.state = 'running-to-grass';
                    me.aimFirstGrass();
                }
            }, this.eatingTime);
        }
    },
    initAgogoSettings: function() {
        var place = this.getRandomInt(4);
        this.setAgogoStartPosition(place);
        this.makeChair(place);
        this.setRestPlace(place);
    },
    setAgogoStartPosition: function(place) {
        var agogoWidth = this.agogo.offsetWidth;
        var agogoHeight = this.agogo.offsetHeight;
        var randomLeft = this.getRandomInt(window.innerWidth - agogoWidth);
        var randomTop = this.getRandomInt(window.innerHeight - agogoHeight);

        switch (place) {
            case 0: // top
                this.setElementLeftTop(this.agogo, randomLeft, -agogoWidth);
                break;
            case 1: // left
                this.setElementLeftTop(this.agogo, -agogoHeight, randomTop);
                break;
            case 2: // right
                this.setElementLeftTop(this.agogo, window.innerWidth, randomTop);
                break;
            case 3: // bottom
                this.setElementLeftTop(this.agogo, randomLeft, window.innerHeight);
                break;
        }
    },
    makeChair: function(place) {
        this.chair = document.createElement('div');
        this.chair.setAttribute('id', 'agogo-chase-chair');
        document.body.appendChild(this.chair);

        var rect = this.chair.getBoundingClientRect();

        switch (place) {
            case 0: // top: bottom-right
                this.setElementLeftTop(this.chair, window.innerWidth - rect.width, window.innerHeight - rect.height);
                break;
            case 1: // left: top-right
                this.setElementLeftTop(this.chair, window.innerWidth - rect.width, 0);
                break;
            case 2: // right: bottom-left
                this.setElementLeftTop(this.chair, 0, window.innerHeight - rect.height);
                break;
            case 3: // bottom: top-left
                this.setElementLeftTop(this.chair, 0, 0);
                break;
        }

        this.chair.style.visibility = 'visible';
    },
    setRestPlace: function(place) {
        var agogoWidth = this.agogo.offsetWidth;
        var agogoHeight = this.agogo.offsetHeight;
        var chairHeight = this.chair.offsetHeight;

        switch (place) {
            case 0: // top: bottom-right
                this.restPlace = {
                    x: window.innerWidth - agogoWidth / 2,
                    y: window.innerHeight - agogoHeight / 2,
                };
                break;
            case 1: // left: top-right
                this.restPlace = {
                    x: window.innerWidth - agogoWidth / 2,
                    y: chairHeight - agogoHeight / 2,
                };
                break;
            case 2: // right: bottom-left
                this.restPlace = {
                    x: agogoWidth / 2,
                    y: window.innerHeight - agogoHeight / 2,
                };
                break;
            case 3: // bottom: top-left
                this.restPlace = {
                    x: agogoWidth / 2,
                    y: chairHeight - agogoHeight / 2,
                };
                break;
        }
    },
    preloadImages: function() {
        var images = [
            'agogo-resting.svg',
            'agogo-smell-grass.svg',
            'agogo-running-left.svg',
            'agogo-running-right.svg',
            'agogo-eating-left.svg',
            'agogo-eating-right.svg',
            'grass-1.svg',
            'grass-2.svg',
            'grass-3.svg',
            'chair.svg',
        ];

        images.forEach(function(image) {
            var img = document.createElement('img');
            img.src = '../images/' + image;
            img.style.visibility = 'hidden';
            document.body.appendChild(img);
        });
    },
    getRandomInt: function(range) {
        return Math.floor((Math.random() * range));
    },
    setElementLeftTop: function(element, left, top) {
        element.style.left = left + 'px';
        element.style.top = top + 'px';
    },
    getGrassFallTop: function(grass) {
        return parseInt(grass.getAttribute('data-fall-top'));
    },
    calcDistance: function(x1, y1, x2, y2) {
        var distanceX = x2 - x1;
        var distanceY = y2 - y1;
        return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    },
}).main();
