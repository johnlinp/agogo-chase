window.addEventListener('load', function load(event){
    window.removeEventListener('load', load, false);
    AgogoChase.init();
}, false);

var AgogoChase = {
    init: function() {
        var appcontent = document.getElementById('appcontent');
        if (appcontent){
            appcontent.addEventListener('DOMContentLoaded', AgogoChase.onPageLoad, true);
        }
    },

    onPageLoad: function(evt) {
        var doc = evt.originalTarget;
        var keyword = 'agogo';
        var url = doc.location.href;
        var title = doc.title;

        if (url.toLowerCase().search(keyword) == -1 &&
                title.toLowerCase().search(keyword) == -1) {
            return;
        }

        var agogo = doc.createElement('div');
        agogo.setAttribute('id', 'agogo-chase');
        doc.body.appendChild(agogo);
    },
};
