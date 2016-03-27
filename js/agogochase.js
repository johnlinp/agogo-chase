'use strict';
({
    agogoLength: 96, // width and height of agogo
    agogoUpdateRate: 50, // in milliseconds
    agogoMoveDistance: 10, // in pixels
    agogoCloseDistance: 100, // in pixels
    mouseX: null,
    mouseY: null,
    agogo: null,
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
        this.setAgogoBeginPosition();

        this.startChasing();
    },
    setMouseMoveListener: function() {
        var me = this;
        document.addEventListener('mousemove', function(evt) {
            me.mouseX = evt.pageX;
            me.mouseY = evt.pageY;
        });
    },
    makeAgogo: function() {
        this.agogo = document.createElement('div');
        this.agogo.setAttribute('id', 'agogo-chase');
        document.body.appendChild(this.agogo);
    },
    startChasing: function() {
        var me = this;
        setInterval(function() {
            me.updateAgogo();
        }, this.agogoUpdateRate);
    },
    updateAgogo: function() {
        if (this.mouseX == null || this.mouseY == null) {
            return;
        }

        this.changeAgogoClass();
        this.moveAgogoPosition();
    },
    changeAgogoClass: function() {
        if (!this.agogo.classList.contains('agogo-running-left')) {
            this.agogo.classList.add('agogo-running-left');
        }
    },
    moveAgogoPosition: function(rect) {
        var rect = this.agogo.getBoundingClientRect();

        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;

        var distanceX = this.mouseX - centerX;
        var distanceY = this.mouseY - centerY;
        var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < this.agogoCloseDistance) {
            return;
        }

        var ratio = this.agogoMoveDistance / distance;
        var newLeft = rect.left + (this.mouseX - rect.left) * ratio;
        var newTop = rect.top + (this.mouseY - rect.top) * ratio;

        this.agogo.style.left = newLeft + 'px';
        this.agogo.style.top = newTop + 'px';
    },
    setAgogoBeginPosition: function() {
        var place = Math.floor((Math.random() * 4));
        var agogoWidth = this.agogo.offsetWidth;
        var agogoHeight = this.agogo.offsetHeight;
        var randomLeft = Math.floor((Math.random() * screen.width));
        var randomTop = Math.floor((Math.random() * screen.height));

        switch (place) {
            case 0: // top
                this.agogo.style.left = randomLeft + 'px';
                this.agogo.style.top = '-' + agogoWidth + 'px';
                break;
            case 1: // left
                this.agogo.style.left = '-' + agogoHeight + 'px';
                this.agogo.style.top = randomTop + 'px';
                break;
            case 2: // right
                this.agogo.style.left = screen.width + 'px';
                this.agogo.style.top = randomTop + 'px';
                break;
            case 3: // bottom
                this.agogo.style.left = randomLeft + 'px';
                this.agogo.style.top = screen.height + 'px';
                break;
        }
    },
}).main();
