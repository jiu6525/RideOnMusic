<script setup>
import { onMounted, onUpdated, ref, watch } from "vue";
import { Axios } from '@/util/http-commons.js';
import { useRouter } from "vue-router";
import {chatService, socket, handleSocketMessage, addedPlaces} from '@/services/ChatService.js';
import { VueDraggableNext } from 'vue-draggable-next';

import { storeToRefs } from "pinia";
import store from "@/stores";
import { useMemberStore } from "@/stores/memberStore.js";
const memberStore = useMemberStore();
const { userInfo } = storeToRefs(memberStore);

const router = useRouter(); 
const props = defineProps({
    keyword: String,
    places: Object
});

const playlistStore = store.usePlaylistStore();

const http = Axios();
const markerImg = "/src/assets/img/marker7.png"
const preparingImg = "/src/assets/img/preparingimg.jpg"
const appKey = import.meta.env.VITE_KAKAO_APPKEY;
const apiurl = ref(import.meta.env.VITE_API_URL); //import 방식으로 고치기

var markers = [];
var overlays = [];
var positions = [];
let map = null;
var polyline; // 선을 담는 변수
const file = ref();
const initialForm = {
  planTitle: "",
  startDate: "2024-04-05",
  endDate: "2024-04-07",
  transport: "public",
  thumbnail: null,
};
const form = ref(initialForm);

watch(() => props.places, (places) => {
    displayPlaces(places)
})

// watch(addedPlaces, (newPlaces, oldPlaces) => {
//     if (newPlaces.length >= 2) {
//         drawLine();
//     } else {
//         removeDraw();
//     }
// }, { deep: true });

watch(() => addedPlaces.value, (newPlaces, oldPlaces) => {
    if (newPlaces.length >= 2) {
        drawLine();
    } else {
        removeDraw();
    }
}, { deep: true });



onMounted(() => {
    chatService.connect();
    chatService.ws.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        handleSocketMessage(eventData);
    };

    if (window.kakao && window.kakao.maps) {
        initMap();
    } else {
        loadScript();
    }
});

onUpdated(() => {
});

const addFile = async () => {
    form.value.thumbnail = file.value.files[0];
}

//서버에 등록 요청
const handleFormSubmit = async () => {
  if (!addedPlaces.value) {
    alert("추가된 장소가 없습니다.");
    return;
  }
  console.log(console.log(userInfo.value.memberId));
  const formData = new FormData();
  formData.append("planTitle", form.value.planTitle);
  formData.append("startDate", form.value.startDate);
  formData.append("endDate", form.value.endDate);
  formData.append("transport", form.value.transport);
  formData.append("memberId", userInfo.value.memberId);
  const contentIds = addedPlaces.value.map((place) => place.contentId);
  formData.append("selectedPlaces", contentIds);
  if (playlistStore.hasPlaylist) {
    console.log(playlistStore.planPlaylistId);
    formData.append("playlistId", playlistStore.planPlaylistId);
  }
  if (form.value.thumbnail) {
    formData.append("file", form.value.thumbnail);
  }
  displayFormData(formData);
  try {
    const response = await http.post(apiurl.value + "plan", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    form.value = initialForm;
    router.push({ name: "plannerlist" });
    socket.send(
      JSON.stringify({
        type: "plan",
      })
    );
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};

    socket.onmessage = (event) => {
        const eventData = JSON.parse(event.data);
        if (eventData.type === 'plan') {
            router.push({ name: 'plannerlist' });
        }
    };

//디버깅 
const displayFormData = (formData) => {
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
};

const loadScript = () => {
    const script = document.createElement("script");
    script.onload = () => kakao.maps.load(initMap);
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}&libraries=services,clusterer,drawing`;
    document.head.appendChild(script);
};

const initMap = () => {
    const container = document.getElementById("map");
    const options = {
        center: new kakao.maps.LatLng(36.35559977190671, 127.29859991863871),
        level: 9,
    };
    map = new kakao.maps.Map(container, options);
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    var mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
};

function displayPlaces(places) {
    var bounds = new kakao.maps.LatLngBounds();
    removeMarker();
    removeDraw();
    for (var i = 0; i < places.length; i++) {
        var placePosition = new kakao.maps.LatLng(places[i].latitude, places[i].longitude);
        if (places[i].firstImg == "") {
            places[i].firstImg = preparingImg;
        }
        positions.push({
            contentId: places[i].contentId,
            idx: i,
            title: places[i].title,
            addr: places[i].addr1,
            img: places[i].firstImg,
            //TODO: 이 부분도 컴포넌트로 뺄 수 있나..?
            content: '<div class="info">' +
                '<div class="title">' + places[i].title + "</div>" +
                '<div class="body">' +
                '<div class="img">' + '<img src="' + places[i].firstImg + '" width="80" height="70">' + "</div>" +
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
}

function addMarker(position) {
    var imageSrc = markerImg,
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

    var infowindow = new kakao.maps.InfoWindow({
        content: position.content // 인포윈도우에 표시할 내용
    });

    kakao.maps.event.addListener(marker, "click", function () {
        addPlace(position);
    });

    kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
    kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));

    marker.setMap(map);
    markers.push(marker);
}


// 장소 추가 함수
function addPlace(position) {
    if (duplicateCheck(position)) {
        addedPlaces.value.push({
            contentId: position.contentId,
            idx: position.idx,
            title: position.title,
            addr: position.addr,
            img: position.img,
            latitude: position.latlng.La,
            longitude: position.latlng.Ma
        });
        updateMap();
    }
    sendPathUpdate();
}

const sendPathUpdate = () => {
    socket.send(JSON.stringify({
        type: 'path',
        contents : addedPlaces.value
    }));
};

// 중복 검사 함수
function duplicateCheck(position) {
    return !addedPlaces.value.some(place => place.contentId === position.contentId);
}



// 지도 업데이트 함수
function updateMap() {
    if (addedPlaces.value.length >= 2) {
        drawLine();
    } else {
        removeDraw();
    }
}

// 장소 제거 함수
function removePlace(idx) {
    const index = addedPlaces.value.findIndex(p => p.idx === idx);
    if (index !== -1) {
        addedPlaces.value.splice(index, 1); //인덱스로부터 1개 제거
        updateMap();
    }
    socket.send(JSON.stringify({ 
          type: 'path', 
          contents : addedPlaces.value
    }));
}

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
function makeOverListener(map, marker, infowindow) {
    return function () {
        infowindow.open(map, marker);
    };
}

// 인포윈도우를 닫는 클로저를 호출
function makeOutListener(infowindow) {
    return function () {
        infowindow.close();
    };
}

// 지도 위에 표시되고 있는 마커,오버레이 모두 제거
function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    for (var i = 0; i < overlays.length; i++) {
        overlays[i].setMap(null);
    }

    markers = [];
    positions = [];
    addedPlaces.value = [];
}

function drawLine() {
    var linePath = addedPlaces.value.map(place => {
        return new kakao.maps.LatLng(place.longitude, place.latitude);
    });

    removeDraw(); // 기존 선을 제거
    polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 4,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeStyle: "solid", //실선
    });

    polyline.setMap(map);
}


// 모든 선을 지도에서 제거
function removeDraw() {
    if (polyline) {
        polyline.setMap(null);
    }
}

// 추가된 장소들을 최단 경로로 정렬하는 함수
function sortPlacesByShortestPath() {
    if (addedPlaces.value.length < 2) return; // 장소가 2개 미만이면 정렬할 필요가 없음

    var startPoint = addedPlaces.value[0]; // 출발 지점은 첫 번째로 추가된 장소로 설정
    var sortedPlaces = [startPoint]; // 정렬된 장소를 저장할 배열에 출발 지점 추가

    // 출발 지점을 기준으로 각 장소까지의 거리를 계산하여 정렬
    while (sortedPlaces.length < addedPlaces.value.length) {
        var minDistance = Infinity;
        var nearestPlaceIndex = -1;

        for (var i = 1; i < addedPlaces.value.length; i++) {
            var distance = calculateDistance(startPoint.latitude, startPoint.longitude, addedPlaces.value[i].latitude, addedPlaces.value[i].longitude);
            if (distance < minDistance && !sortedPlaces.includes(addedPlaces.value[i])) {
                minDistance = distance;
                nearestPlaceIndex = i;
            }
        }

        if (nearestPlaceIndex !== -1) {
            startPoint = addedPlaces.value[nearestPlaceIndex];
            sortedPlaces.push(startPoint);
        }
    }

    // 정렬된 장소 배열로 교체
    addedPlaces.value = sortedPlaces;
    viewPlanAndDraw();
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

</script>

<template>
    <div class="row justify-content-center  gx-5">
        <div class="col-md-3 map_wrap">
            <form @submit.prevent="handleFormSubmit" enctype="multipart/form-data">
                <div id="menu_wrap" class="bg_white">
                    <div id="planner_body">
                        <ul>
                            <li>
                                <div class="label">플랜이름:</div>
                                <input v-model="form.planTitle" type="text" placeholder="플랜 이름"/>
                            </li>
                            <li>
                                <div class="label">일정 :</div>
                                <input v-model="form.startDate" type="date" value="2024-04-05" /> -
                                <input v-model="form.endDate" type="date" value="2024-04-07" />
                            </li>
                            <li id="transport">
                                <div class="label">교통수단 :</div>
                                <div class="content ib">
                                    <select v-model="form.transport">
                                        <option value="public" selected>대중교통</option>
                                        <option value="ownCar">자차</option>
                                    </select>
                                </div>
                            </li>
                            <li>
                                <div class="label">썸네일 :</div>
                                <input @change="addFile($event)" ref="file" type="file" id="file" name="file">
                            </li>

                        </ul>
                        <br />

                        <div id="buttons">
                            <!-- <button id="shortest-path-btn" class="btn btn-primary btn-ghost btn-open"
                                @click="sortPlacesByShortestPath()" type="button">최단경로로
                                변환하기
                            </button> -->
                            <!-- 최종 계획 정보를 PlannerRegister에게 넘긴다. -->
                            <button type="submit" class="btn btn-primary btn-ghost btn-open">저장</button>
                        </div>
                        <div id="area_sel"></div>

                   <!-- 드래그 구현중      -->
                        <!-- <div id="area_sel">
                            <div v-for="place in addedPlaces.value" :key="place.idx" style="display:flex">
                                <img :src="place.img" style="width: 50px; height: 50px;">
                                <div>
                                    [{{ place.title }}]<br>
                                    지번 주소: {{ place.addr }}
                                </div>
                                <button @click="removePlace(place.idx)">삭제</button>
                            </div>
                        </div> -->
                        <div id="area_sel">
                            <VueDraggableNext 
                                v-if="addedPlaces.value && addedPlaces.value.length > 0" 
                                v-model="addedPlaces.value" 
                                :options="{ handle: '.drag-handle' }" 
                                @end="sendPathUpdate">
                                <div v-for="place in addedPlaces.value" :key="place.index" class="drag-handle draggable">
                                    <img :src="place.img" style="width: 50px; height: 50px;">
                                    <div>
                                        [{{ place.title }}]<br>
                                        지번 주소: {{ place.addr }}
                                    </div>
                                    <button @click="removePlace(place.idx)">삭제</button>
                                </div>
                            </VueDraggableNext>
                            <div v-else>
                                추가된 항목이 없습니다.
                            </div>
                        </div>


                    </div>
                </div>
            </form>
        </div>
        <div class="col-md-9">
            <div id="map" style="height: 600px;"></div>
        </div>
    </div>
</template>

<style scoped>
.ch {
    background-color: aqua;
}

.wrap {
    position: absolute;
    left: 0;
    bottom: 30px;
    width: 288px;
    height: 140px;
    margin-left: -140px;
    text-align: left;
    overflow: hidden;
    font-size: 12px;
    font-family: "Malgun Gothic", dotum, "돋움", sans-serif;
    line-height: 1.5;
}

.wrap * {
    padding: 0;
    margin: 0;
}

.info {
    width: 286px;
    height: 120px;
    border-radius: 5px;
    border-bottom: 2px solid #ccc;
    border-right: 1px solid #ccc;
    overflow: hidden;
    background: #fff;
}

.wrap .info:nth-child(1) {
    border: 0;
    box-shadow: 0px 1px 2px #888;
}

.info .title {
    padding: 5px 0 0 10px;
    height: 30px;
    background: #eee;
    border-bottom: 1px solid #ddd;
    font-size: 18px;
    font-weight: bold;
}

.info .close {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #888;
    width: 17px;
    height: 17px;
    background:
        url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png");
}

.info .close:hover {
    cursor: pointer;
}

.info .body {
    display: inline;
    position: relative;
    overflow: hidden;
}

.info .desc {
    position: relative;
    margin: 13px 0 0 90px;
    height: 75px;
}

.desc .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.desc .jibun {
    font-size: 11px;
    color: #888;
    margin-top: -2px;
}

.info .img {
    position: absolute;
    top: 6px;
    left: 5px;
    width: 73px;
    height: 71px;
    border: 1px solid #ddd;
    color: #888;
    overflow: hidden;
}

.info:after {
    content: "";
    position: absolute;
    margin-left: -12px;
    left: 50%;
    bottom: 0;
    width: 22px;
    height: 12px;
    background:
        url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png");
}

.info .link {
    color: #5085bb;
}

/* @import "/src/assets/css/tourist_spot.css" */

/* #map {
  flex: 1;
} */

/* 드래그 부분 */
.drag-handle {
    cursor: move; /* 드래그 가능한 커서 스타일 */
    padding: 10px;
    margin-bottom: 5px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 5px;
    display: flex;
    align-items: center;
}

.drag-handle img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
}

.drag-handle button {
    margin-left: auto;
}
</style>
