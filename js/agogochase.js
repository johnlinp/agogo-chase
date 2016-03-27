'use strict';
({
    updateRate: 50, // in milliseconds
    moveSpeed: 20, // in pixels, for agogo
    closeDistance: 30, // in pixels, for agogo
    fallDistance: 60, // in pixels, for grass
    fallSpeed: 5, // in pixels, for grass
    state: 'init',
    restPlace: null,
    curTarget: null,
    agogo: null,
    target: null,
    grassList: [],
    main: function() {
        var keyword = 'agogo';
        var url = document.location.href;
        var title = document.title;

        if (url.toLowerCase().search(keyword) == -1 &&
                title.toLowerCase().search(keyword) == -1) {
            return;
        }

        this.setMouseListener();

        this.makeAgogo();
        this.makeTarget();
        this.setAgogoBeginAndRestPosition();

        this.startChasing();
    },
    setMouseListener: function() {
        var me = this;
        document.addEventListener('mouseup', function(evt) {
            me.makeGrass(evt.pageX, evt.pageY);
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
    makeTarget: function() {
        this.target = document.createElement('div');
        this.target.setAttribute('id', 'agogo-chase-target');
        document.body.appendChild(this.target);
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
            me.updateTarget();
            me.updateGrass();
            console.log(me.state);
        }, this.updateRate);
    },
    updateAgogo: function() {
        this.moveAgogoPosition();
    },
    updateTarget: function() {
        this.setElementLeftTop(this.target, this.curTarget.x, this.curTarget.y);
    },
    updateGrass: function() {
        var me = this;
        this.grassList.forEach(function(grass) {
            var rect = grass.getBoundingClientRect();
            var targetTop = parseInt(grass.getAttribute('data-fall-top'));
            if (rect.top > targetTop) {
                return;
            }
            me.setElementLeftTop(grass, rect.left, rect.top + me.fallSpeed);
        });
    },
    addAgogoRunningClass: function(targetClassName) {
        var me = this;
        var allClassNames = [
            'agogo-running-right',
            'agogo-running-left',
        ];

        this.makeSureClass(this.agogo, 'agogo-running', true);

        allClassNames.forEach(function(iterClassName) {
            if (iterClassName == targetClassName) {
                me.makeSureClass(me.agogo, iterClassName, true);
            } else {
                me.makeSureClass(me.agogo, iterClassName, false);
            }
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
    moveAgogoPosition: function(rect) {
        var rect = this.agogo.getBoundingClientRect();

        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;

        var distanceX = this.curTarget.x - centerX;
        var distanceY = this.curTarget.y - centerY;
        var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < this.closeDistance) {
            if (this.state == 'running-to-rest') {
                this.state = 'resting';
            } else if (this.state == 'running-to-grass') {
                this.state = 'eating';
            }
            return;
        }

        if (centerX < this.curTarget.x) {
            this.addAgogoRunningClass('agogo-running-right');
        } else {
            this.addAgogoRunningClass('agogo-running-left');
        }

        var ratio = this.moveSpeed / distance;
        var newLeft = rect.left + (this.curTarget.x - centerX) * ratio;
        var newTop = rect.top + (this.curTarget.y - centerY) * ratio;

        this.setElementLeftTop(this.agogo, newLeft, newTop);
    },
    setAgogoBeginAndRestPosition: function() {
        var place = this.getRandomInt(4);
        var agogoWidth = this.agogo.offsetWidth;
        var agogoHeight = this.agogo.offsetHeight;
        var randomLeft = this.getRandomInt(screen.width - agogoWidth);
        var randomTop = this.getRandomInt(screen.height - agogoHeight);

        switch (place) {
            case 0: // top
                this.setElementLeftTop(this.agogo, randomLeft, -agogoWidth);
                this.restPlace = {
                    x: screen.width - agogoWidth / 2,
                    y: screen.height - agogoHeight - agogoHeight / 2,
                };
                break;
            case 1: // left
                this.setElementLeftTop(this.agogo, -agogoHeight, randomTop);
                this.restPlace = {
                    x: screen.width - agogoWidth / 2,
                    y: agogoHeight / 2,
                };
                break;
            case 2: // right
                this.setElementLeftTop(this.agogo, screen.width, randomTop);
                this.restPlace = {
                    x: agogoWidth / 2,
                    y: screen.height - agogoHeight - agogoHeight / 2,
                };
                break;
            case 3: // bottom
                this.setElementLeftTop(this.agogo, randomLeft, screen.height);
                this.restPlace = {
                    x: agogoWidth / 2,
                    y: agogoHeight / 2,
                };
                break;
        }
    },
    getRandomInt: function(range) {
        return Math.floor((Math.random() * range));
    },
    setElementLeftTop: function(element, left, top) {
        element.style.left = left + 'px';
        element.style.top = top + 'px';
    },
}).main();
