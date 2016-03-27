'use strict';
({
    updateRate: 50, // in milliseconds
    moveDistance: 20, // in pixels
    closeDistance: 30, // in pixels
    restPlace: null,
    curTarget: null,
    agogo: null,
    target: null,
    main: function() {
        var keyword = 'agogo';
        var url = document.location.href;
        var title = document.title;

        if (url.toLowerCase().search(keyword) == -1 &&
                title.toLowerCase().search(keyword) == -1) {
            return;
        }

        this.setMouseMoveListener();

        this.makeAgogo();
        this.makeTarget();
        this.setAgogoBeginAndRestPosition();

        this.startChasing();
    },
    setMouseMoveListener: function() {
        var me = this;
        document.addEventListener('mouseclick', function(evt) {
            // drop grass
        });
    },
    makeTarget: function() {
        this.target = document.createElement('div');
        this.target.setAttribute('id', 'agogo-chase-target');
        document.body.appendChild(this.target);
    },
    makeAgogo: function() {
        this.agogo = document.createElement('div');
        this.agogo.setAttribute('id', 'agogo-chase');
        this.agogo.classList.add('agogo-running');
        document.body.appendChild(this.agogo);
    },
    startChasing: function() {
        var me = this;
        this.curTarget = this.restPlace;
        setInterval(function() {
            me.updateAgogo();
            me.updateTarget();
        }, this.updateRate);
    },
    updateAgogo: function() {
        this.moveAgogoPosition();
        this.changeAgogoClass();
    },
    updateTarget: function() {
        this.target.style.left = this.curTarget.x + 'px';
        this.target.style.top = this.curTarget.y + 'px';
    },
    changeAgogoClass: function() {
        var rect = this.agogo.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;

        if (centerX < this.curTarget.x) {
            this.addAgogoClass('agogo-running-right');
        } else {
            this.addAgogoClass('agogo-running-left');
        }
    },
    addAgogoClass: function(targetClassName) {
        var me = this;
        var allClassNames = [
            'agogo-running-right',
            'agogo-running-left',
        ];

        allClassNames.forEach(function(iterClassName) {
            if (iterClassName == targetClassName) {
                if (!me.agogo.classList.contains(iterClassName)) {
                    me.agogo.classList.add(iterClassName);
                }
            } else {
                if (me.agogo.classList.contains(iterClassName)) {
                    me.agogo.classList.remove(iterClassName);
                }
            }
        });
    },
    moveAgogoPosition: function(rect) {
        var rect = this.agogo.getBoundingClientRect();

        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;

        var distanceX = this.curTarget.x - centerX;
        var distanceY = this.curTarget.y - centerY;
        var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < this.closeDistance) {
            return;
        }

        console.log(distance);

        var ratio = this.moveDistance / distance;
        var newLeft = rect.left + (this.curTarget.x - centerX) * ratio;
        var newTop = rect.top + (this.curTarget.y - centerY) * ratio;

        this.agogo.style.left = newLeft + 'px';
        this.agogo.style.top = newTop + 'px';
    },
    setAgogoBeginAndRestPosition: function() {
        var place = Math.floor((Math.random() * 4));
        var agogoWidth = this.agogo.offsetWidth;
        var agogoHeight = this.agogo.offsetHeight;
        var randomLeft = Math.floor((Math.random() * (screen.width - agogoWidth)));
        var randomTop = Math.floor((Math.random() * (screen.height - agogoHeight)));

        switch (place) {
            case 0: // top
                this.agogo.style.left = randomLeft + 'px';
                this.agogo.style.top = '-' + agogoWidth + 'px';
                this.restPlace = {
                    x: screen.width - agogoWidth / 2,
                    y: screen.height - agogoHeight - agogoHeight / 2,
                };
                break;
            case 1: // left
                this.agogo.style.left = '-' + agogoHeight + 'px';
                this.agogo.style.top = randomTop + 'px';
                this.restPlace = {
                    x: screen.width - agogoWidth / 2,
                    y: agogoHeight / 2,
                };
                break;
            case 2: // right
                this.agogo.style.left = screen.width + 'px';
                this.agogo.style.top = randomTop + 'px';
                this.restPlace = {
                    x: agogoWidth / 2,
                    y: screen.height - agogoHeight - agogoHeight / 2,
                };
                break;
            case 3: // bottom
                this.agogo.style.left = randomLeft + 'px';
                this.agogo.style.top = screen.height + 'px';
                this.restPlace = {
                    x: agogoWidth / 2,
                    y: agogoHeight / 2,
                };
                break;
        }
    },
}).main();
