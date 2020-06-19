var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var songList;
var controlManager;
var audio = new root.audioManager();
var timer = null;

function bindClick() {
    $scope.on('play:change', function (event, index, flag) {
        audio.setAudioSource(songList[index].audio);
        if (audio.status == 'play' || flag) {
            audio.play();
            rotated(0);
            root.processor.start(0);
        }
        root.render(songList[index]);
        root.processor.renderAllTime(songList[index].duration);
        $('.img-wrapper').attr('data-deg', 0);

        $('.img-wrapper').css({
            transform: `rotateZ(0deg)`,
            transition: 'none'
        })
    })
}

function bindTouch() {
    var $spot = $scope.find('.spot');
    var offset = $scope.find('.pro-wrapper').offset();
    var left = offset.left;
    var width = offset.width;
    $spot.on('touchstart', function () {
        root.processor.stop();
    }).on('touchmove', function (e) {
        var x = e.changeTouches[0].clientX;
        var percent = (x - left) / width;
        if (percent > 1 || percent < 0) {
            percent = 0;
        }
        root.processor.update(percent);
    }).on('touchend', function (e) {
        var x = e.changeTouches[0].clientX;
        var percent = (x - left) / width;
        if (percent > 1 || percent < 0) {
            percent = 0;
        }
        var curDuration = songList[controlManager.index].duration;
        var curTime = curDuration * percent;
        audio.jumpToplay(curTime);
        root.processor.start(percent);
        $scope.find('.play-btn').addClass('playing');
    })
}


$scope.on('click', '.prev-btn', function () {
    var index = controlManager.prev();
    $scope.trigger('play:change', index);
})
$scope.on('click', '.next-btn', function () {
    var index = controlManager.next();
    $scope.trigger('play:change', index);
})
$scope.on('click', '.play-btn', function () {
    if (audio.status == 'play') {
        audio.pause();
        clearInterval(timer);
        root.processor.stop();
    } else {
        audio.play();
        root.processor.start();
        var deg = $('.img-wrapper').attr('data-deg') || 0;
        rotated(deg);
    }
    $(this).toggleClass('playing');
})
$scope.on("click", ".list-btn", function () {
    root.playList.show(controlManager);
})

function rotated(deg) {
    clearInterval(timer);
    deg = parseInt(deg);
    timer = setInterval(function () {
        deg += 2;
        $('.img-wrapper').attr('data-deg', deg);
        $('.img-wrapper').css({
            transform: 'rotateZ(' + deg + 'deg)',
            transition: 'transform .2s linear'
        })
    }, 200);
}

function getData(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function (data) {
            bindClick();
            bindTouch();
            root.playList.renderList(data);
            console.log(data);
            songList = data;
            controlManager = new root.controlManager(data.length);
            $scope.trigger('play:change', 0);
        }
    })
}
getData("../mock/data.json")