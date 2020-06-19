
(function ($, root) {
    var $scope = $(document.body);
    var curDuration;
    var frameId;
    var lastPercent = 0;
    var startTime;

    function formaTime(duration) {
        duration = Math.round(duration);
        var minute = Math.floor(duration / 60);
        var second = duration - minute * 60;
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = "0" + second;
        }
        return minute + ':' + second;
    }

    function renderAllTime(duration) {
        lastPercent = 0;
        curDuration = duration;
        var allTime = formaTime(curDuration);
        $scope.find('.all-time').html(allTime);
    }

    function update(percent) {
        var curTime = percent * curDuration;
        curTime = formaTime(curTime);
        $scope.find(".cur-time").html(curTime);
        var percentage = (percent - 1) * 100 + '%';
        $scope.find('.pro-top').css({
            transform: 'translateX(' + percentage + ')'
        })
    }

    function start(percentage) {
        lastPercent = percentage === undefined ? lastPercent : percentage;
        cancelAnimationFrame(frameId);
        startTime = new Date().getTime();

        function frame() {
            var curTime = new Date().getTime();
            var percent = lastPercent + (curTime - startTime) / (curDuration * 1000);
            if (percent < 1) {
                frameId = requestAnimationFrame(frame);
                update(percent);
            } else {
                cancelAnimationFrame(frameId);
                $scope.find('.next-btn').trigger('click');
            }
        }
        frame();
    }

    function stop() {
        var stopTime = new Date().getTime();
        lastPercent = lastPercent + (stopTime - startTime) / (curDuration * 1000);
        cancelAnimationFrame(frameId);
    }

    root.processor = {
        renderAllTime,
        start,
        update,
        stop
    }
})(window.Zepto, window.player || (window.player));