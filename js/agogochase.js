({
    main: function() {
        var keyword = 'agogo';
        var url = document.location.href;
        var title = document.title;

        if (url.toLowerCase().search(keyword) == -1 &&
                title.toLowerCase().search(keyword) == -1) {
            return;
        }

        var agogo = document.createElement('div');
        agogo.setAttribute('id', 'agogo-chase');
        agogo.className += 'agogo-running-left';
        document.body.appendChild(agogo);
    },
}).main();
