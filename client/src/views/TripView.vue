<script setup>
import VMap from '/src/components/trip/VMap.vue';
import VSelect from '/src/components/common/VSelect.vue';
import { onMounted, ref } from "vue";
import { getSidoApi, searchApi } from "@/api/attraction.js";
import { useRouter } from "vue-router";
const router = useRouter();

onMounted(() => {
    getSido();
})

const places = ref()
const sidoList = ref()
const searchItem = ref({})
const classGroup = 'form-select mb-3'
const typeList = ref([
    { text: '관광지', value: '12' },
    { text: '문화시설', value: '14' },
    { text: '축제공연행사', value: '15' },
    { text: '여행코스', value: '25' },
    { text: '레포츠', value: '28' },
    { text: '숙박', value: '32' },
    { text: '쇼핑', value: '38' },
    { text: '음식점', value: '39' }
])

const getSido = () => {
    getSidoApi(({ data }) => {
        console.log(data.data)
        sidoList.value = data.data.map((item) => {
            return { "value": item.sidoCode, 'text': item.sidoName }
        })
    }, (error) => console.log(error))
}

const search = () => {
    console.log(searchItem.value)
    if (searchItem.value.title == "") {
        alert("검색어를 입력해주세요.");
    } else {
        searchApi(searchItem.value, ({ data }) => {
            if (data.data.length === 0) {
                alert("검색결과가 없습니다.");
            } else {
                places.value = data.data
            }
        }, error => console.log(error))
    }
}

const selectSido = (option) => {
    searchItem.value.sidoCode = option
}

const selectType = (option) => {
    searchItem.value.contentTypeId = option
}

</script>

<template>
    <div>
        <div class="container" style="margin-top: 10%;">
            <!-- <input id="memberId" value="${loginId}" type="hidden"/> -->
            <div class="col">
                <div class="row justify-content-center">
                    <div class="col-md-3 text-center">
                        <VSelect :selectOption="sidoList" :defaultValue="'검색 할 지역 선택'" :classGroup="classGroup"
                            @on-key-select="selectSido" />
                    </div>
                    <div class="col-md-3 text-center">
                        <VSelect :selectOption="typeList" :defaultValue="'관광지 유형'" :classGroup="classGroup"
                            @on-key-select="selectType" />
                    </div>
                    <div class="col-md-3 mb-3 text-center d-flex col">
                        <input id="search-keyword" class="form-control mr-2" type="search" name="search-keyword"
                            placeholder="검색어" aria-label="검색어" v-model="searchItem.title" />
                        <button class="btn btn-primary btn-sm" id="btn-search"
                            style="white-space: nowrap; margin-left: 5%" @click="search">
                            검색
                        </button>
                        <!-- ms-md-2 클래스를 추가하여 중간 및 큰 화면 크기에서 왼쪽 마진을 추가 -->
                    </div>
                </div>
                <VMap :places="places" />
                <!-- <VMap/> -->
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "/src/assets/css/tourist_spot.css"
/* #map {
flex: 1;
} */
</style>
