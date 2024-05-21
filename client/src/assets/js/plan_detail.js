//페이지 로드되자마자 실행
window.onload = function () {
    adjustTimelineHeight();
};

// 선을 담을 변수
var polyline;

// 지도를 표시할 div 요소 가져오기
var mapContainer = document.getElementById("map");

// 마커를 담을 배열
var markers = [];
var positions = [];
var overlays = [];

var mapOption = {
    center: new kakao.maps.LatLng(37.566535, 126.9779692), // 지도의 중심좌표, 일단 서울 시청 좌표로 설정
    level: 7 // 지도의 확대 레벨
};

// 지도 생성
var map = new kakao.maps.Map(mapContainer, mapOption);

// 지도 컨트롤 추가
var mapTypeControl = new kakao.maps.MapTypeControl();
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// trips 배열에서 각 trip 정보를 가져와 마커를 생성하는 함수
function createMarkers(trips) {
    console.log(trips)
    var bounds = new kakao.maps.LatLngBounds(); // 모든 마커를 포함할 수 있도록 bounds를 설정합니다.
    removeMarker();
    removeDraw();

    trips.forEach(function (trip) {
        var placePosition = new kakao.maps.LatLng(trip.latitude, trip.longitude);
        if (trip.firstImg == "") {
            trip.firstImg = "./assets/img/preparingimg.jpg";
        }
        const position = {
            contentId: trip.contentId,
            title: trip.title,
            addr: trip.addr1,
            img: trip.firstImg,
            content: '<div class="info">' +
                '<div class="title">' + trip.title + "</div>" +
                "</div>"
            ,
            latlng: placePosition
        }
        addMarker(position);
        bounds.extend(placePosition);
    });
    map.setBounds(bounds);
}

function addMarker(position) {
    var imageSrc = "/img/marker7.png",
        imageSize = new kakao.maps.Size(80, 80),
        imgOptions = {
            spriteSize: new kakao.maps.Size(45),
            spriteOrigin: new kakao.maps.Point(0, 0),
            offset: new kakao.maps.Point(25, 25),
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
            position: position.latlng, // 위도(latitude), 경도(longitude) 순서로 전달
            image: markerImage,
        });

    // 마커에 표시할 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({
        content: position.content // 인포윈도우에 표시할 내용
    });

    addedPlaces.push({
        contentId: position.contentId,
        idx: position.idx,
        title: position.title,
        addr: position.addr,
        img: position.img,
        latitude: position.latlng.La,
        longitude: position.latlng.Ma
    });
    viewPlanAndDraw();

    kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
    kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
    kakao.maps.event.addListener(marker, 'click', () => scrollToTimeline(position.contentId));

    marker.setMap(map);
    markers.push(marker);
}

function scrollToTimeline(contentId) {
    const timelineElement = document.getElementById(`trip-${contentId}`);
    if (timelineElement) {
        timelineElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
}

function viewPlanAndDraw() {
    if (addedPlaces.length >= 2) {
        drawLine(); // 여기서 drawLine 함수 호출
    } else {
        removeDraw();
    }
}

function makeOverListener(map, marker, infowindow) {
    return function () {
        infowindow.open(map, marker);
    };
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다
function makeOutListener(infowindow) {
    return function () {
        infowindow.close();
    };
}

// 지도 위에 표시되고 있는 마커,오버레이 모두 제거합니다
function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    for (var i = 0; i < overlays.length; i++) {
        overlays[i].setMap(null);
    }

    markers = [];
    positions = [];
    addedPlaces = [];
}

function removeDraw() {
    if (polyline) {
        polyline.setMap(null);
    }
}

// 선 그리기 함수
function drawLine() {
    // 선을 구성할 좌표 배열
    var linePath = [];

    // 추가된 장소들의 좌표를 배열에 추가합니다
    for (var i = 0; i < addedPlaces.length; i++) {
        linePath.push(new kakao.maps.LatLng(addedPlaces[i].longitude, addedPlaces[i].latitude));
    }

    // 기존에 그려진 선이 있다면 제거합니다.
    removeDraw();

    // 지도에 표시할 선을 생성합니다.
    polyline = new kakao.maps.Polyline({
        path: linePath, // 선을 구성하는 좌표배열입니다.
        strokeWeight: 4, // 선의 두께입니다.
        strokeColor: '#808000', // 선의 색깔입니다.
        strokeOpacity: 1, // 선의 투명도입니다.
        strokeStyle: 'solid' // 선의 스타일입니다.
    });

    // 지도에 선을 표시합니다.
    polyline.setMap(map);

}

// 타임라인 영역 스크롤 길이로 막대기 길이 결정하는 메서드 -> css 속성 동적 변경
function adjustTimelineHeight() {
    var timeline = document.querySelector('.main-timeline');
    var timelineHeight = timeline.scrollHeight; // Get the scroll height
    var styleId = 'dynamic-timeline-style';
    var existingStyle = document.getElementById(styleId);

    // If the style tag does not exist, create and append it
    if (!existingStyle) {
        existingStyle = document.createElement('style');
        existingStyle.id = styleId;
        document.head.appendChild(existingStyle);
    }

    // Set or update the content of the style tag
    existingStyle.textContent = '.main-timeline::after {height:' + timelineHeight + 'px;';
}

// 지도에 마크할 영역 받아와서 createMarkers 호출
function markMap(no) {
    fetch(`/plan/triplist?planNo=` + no)
        .then((response) => response.json())
        .then((data) => createMarkers(data.resdata));
}

//버튼 입력에 따라서 입력 폼, 텍스트 폼 상태 변환
function editMemo(contentId) {
    var displayDiv = document.getElementById('memo-text-' + contentId);
    var editDiv = document.getElementById('memo-edit-' + contentId);
    displayDiv.style.display = 'none';
    editDiv.style.display = 'block';
}

// 메모 등록 요청 보내기
function saveMemo(planNo, contentId) {
    var memoInput = document.getElementById('memo-input-' + contentId).value;
    fetch(`/plan/memo`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            planNo: planNo,
            contentId: contentId,
            memoText: memoInput
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var displayDiv = document.getElementById('memo-text-' + contentId);
                displayDiv.innerHTML = '<div className="overview text-control scrollbar">'+ memoInput+'</div>'  ;
                displayDiv.style.display = 'block';
                document.getElementById('memo-edit-' + contentId).style.display = 'none';
            } else {
                alert('메모 등록 실패');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('등록 에러');
        });
}