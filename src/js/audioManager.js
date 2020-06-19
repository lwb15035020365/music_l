(function ($, root) {
    var $scope = $(document.body);

    function audioManager() {
        this.audio = new Audio();
        this.status = "pause";
    }

    audioManager.prototype = {
        bindEvent: function () {
            $(this.audio).on('ended', function () {
                $scope.find(".next-btn").trigger('click');
            })
        },
        play: function () {
            this.audio.play();
            this.status = "play";
        },
        pause: function () {
            this.audio.pause();
            this.status = "pause";
        },
        setAudioSource: function (src) {
            this.audio.src = src;
            this.audio.load();
        },
        jumpToplay: function (time) {
            this.audio.currentTime = time;
            this.play();
        }
    }
    root.audioManager = audioManager;
})(window.Zepto, window.player || (window.player = {}))