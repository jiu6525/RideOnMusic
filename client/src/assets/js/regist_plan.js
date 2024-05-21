/*시도코드 관광지 타입 키워드를 통한 값을 얻어와서 비동기 처리 진행*/
document.getElementById("btn-search").addEventListener("click", () => {
	search();
});

function search() {
	let sidoCode = document.getElementById("search-area").value;
	let contentTypeId = document.getElementById("search-content-id").value;
	let keyword = document.getElementById("search-keyword").value;

	let searchParams = {
		sidoCode: sidoCode,
		contentTypeId: contentTypeId,
		title: keyword
	};

	fetch('/attraction/search', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(searchParams)
	})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			if (data.length === 0) {
				alert("검색결과가 없습니다.");
			} else {
				displayPlaces(data);
			}
		})
		.catch(error => console.error('Error:', error));
}


// 지도를 표시할 div 요소 가져오기
var mapContainer = document.getElementById("map");

// 마커를 담을 배열
var markers = [];
var positions = [];
var overlays = [];



// 이미 추가된 장소들을 저장할 배열
var addedPlaces = [];

// 지도 옵션 설정
var mapOption = {
	center: new kakao.maps.LatLng(37.566535, 126.9779692), // 서울 시청을 중심으로 지도 표시
	level: 7 // 지도의 확대 레벨
};

// 지도 생성
var map = new kakao.maps.Map(mapContainer, mapOption);

// 지도 컨트롤 추가
var mapTypeControl = new kakao.maps.MapTypeControl();
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 검색 결과 목록과 마커를 표시하는 함수
function displayPlaces(places) {
	bounds = new kakao.maps.LatLngBounds();
	removeMarker();
	removeDraw();
	for (var i = 0; i < places.length; i++) {
		var placePosition = new kakao.maps.LatLng(places[i].latitude, places[i].longitude);
		// 이미지가 없다면 준비중으로 대체
		if (places[i].firstImg == "") {
			places[i].firstImg = "./assets/img/preparingimg.jpg";
		}
		positions.push({
			contentId: places[i].contentId,
			idx: i,
			title: places[i].title,
			addr: places[i].addr1,
			img: places[i].firstImg,
			content: '<div class="info">' +
				'<div class="title">' + places[i].title + "</div>" +
				'<div class="body">' +
				'<div class="img">' + '<img src="' + places[i].firstImg + '" width="73" height="70">' + "</div>" +
				"</div>" +
				'<div class="desc">' +
				'<div class="ellipsis">' + places[i].addr1 + "</div>" +
				'<div class="jibun ellipsis">' + places[i].addr2 + "</div>" +
				"</div>" +
				"</div>"
			,
			latlng: placePosition
		});
		addMarker(positions[i]);
		bounds.extend(placePosition);

	}

	map.setBounds(bounds);

	// 지도 옵션 설정

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


	kakao.maps.event.addListener(marker, "click", function() {
		displayPlan(position);
	});

	kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
	kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));

	marker.setMap(map);
	markers.push(marker);
}



function displayPlan(position) {
	// 이미 추가된 장소인지 확인
	if (duplicateCheck(position)) {
		// 추가된 장소 목록에 현재 장소 추가
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
	}
}

function viewPlanAndDraw() {
	viewPlan();

	if (addedPlaces.length >= 2) {
		drawLine(); // 여기서 drawLine 함수 호출
	} else {
		removeDraw();
	}
}


function viewPlan() {
	// 클릭한 마커의 좌표

	var el = document.getElementById('area_sel');
	var detailAddr = "";
	for (var i = 0; i < addedPlaces.length; i++) {
		detailAddr += '<div style="display:flex"><img src=' + addedPlaces[i].img + ' style="width: 50px;height: 50px;">[' + addedPlaces[i].title + ']<br> 지번 주소 : ' + addedPlaces[i].addr + '</div>' +
			' <button class="btn btn-primary btn-ghost btn-open" onclick="removePlace(' + addedPlaces[i].idx + ')" type="button">삭제</button>' +
			'<input type="hidden" name="selectedPlaces" value=' + addedPlaces[i].contentId + '>';
	}
	// 추가된 장소가 아닌 경우에만 내용을 추가
	el.innerHTML = detailAddr;

}

function removePlace(idx) {
	for (var i = 0; i < addedPlaces.length; i++) {
		if (addedPlaces[i].idx == idx) {
			addedPlaces.splice(i, 1); // 배열에서 해당 인덱스의 요소를 삭제
			break; // 삭제 후 반복문을 더 이상 실행하지 않음
		}
	}
	viewPlanAndDraw();
}


function duplicateCheck(position) {
	var isDuplicate = false;
	addedPlaces.some(function(addedPlace) {
		if (addedPlace.title == position.title) {
			isDuplicate = true;
			return true; // 중복이 발견되면 즉시 종료
		}
	});
	return !isDuplicate;
}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
function makeOverListener(map, marker, infowindow) {
	return function() {
		infowindow.open(map, marker);
	};
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다 
function makeOutListener(infowindow) {
	return function() {
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


// 선을 담을 변수
var polyline;

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
		strokeColor: '#FF0000', // 선의 색깔입니다.
		strokeOpacity: 1, // 선의 투명도입니다.
		strokeStyle: 'solid' // 선의 스타일입니다.
	});

	// 지도에 선을 표시합니다.
	polyline.setMap(map);

}

// 두 지점 간의 거리를 계산하는 함수
function calculateDistance(lat1, lon1, lat2, lon2) {
	var R = 6371; // 지구의 반지름 (km)
	var dLat = (lat2 - lat1) * Math.PI / 180; // 위도 차이
	var dLon = (lon2 - lon1) * Math.PI / 180; // 경도 차이
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var distance = R * c; // 거리 (km)
	return distance;
}

// 추가된 장소들을 최단 경로로 정렬하는 함수
function sortPlacesByShortestPath() {
	if (addedPlaces.length < 2) return; // 장소가 2개 미만이면 정렬할 필요가 없음

	var startPoint = addedPlaces[0]; // 출발 지점은 첫 번째로 추가된 장소로 설정
	var sortedPlaces = [startPoint]; // 정렬된 장소를 저장할 배열에 출발 지점 추가

	// 출발 지점을 기준으로 각 장소까지의 거리를 계산하여 정렬
	while (sortedPlaces.length < addedPlaces.length) {
		var minDistance = Infinity;
		var nearestPlaceIndex = -1;

		for (var i = 1; i < addedPlaces.length; i++) {
			var distance = calculateDistance(startPoint.latitude, startPoint.longitude, addedPlaces[i].latitude, addedPlaces[i].longitude);
			if (distance < minDistance && !sortedPlaces.includes(addedPlaces[i])) {
				minDistance = distance;
				nearestPlaceIndex = i;
			}
		}

		if (nearestPlaceIndex !== -1) {
			startPoint = addedPlaces[nearestPlaceIndex];
			sortedPlaces.push(startPoint);
		}
	}

	// 정렬된 장소 배열로 교체
	addedPlaces = sortedPlaces;

	viewPlanAndDraw();
}

