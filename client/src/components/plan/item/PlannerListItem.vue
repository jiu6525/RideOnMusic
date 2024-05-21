<script setup>
import { ref, computed, defineProps } from "vue"
import "@/assets/css/plan_list.css";
import "@/assets/css/board.css";

const props = defineProps({ planners: Array })
const defaultImage = "/src/assets/img/bg6.jpg"
const fileUrl = import.meta.env.VITE_API_URL + "/plan/img"

const getImageUrl = ((thumbnailImgInfo) => {
    if (thumbnailImgInfo && thumbnailImgInfo.saveFolder && thumbnailImgInfo.saveFile) {
        return fileUrl + `/${thumbnailImgInfo.saveFolder}/${thumbnailImgInfo.saveFile}`;
    }
    return defaultImage;
});

</script>

<template>
    <div class="container" id="list-container">
        <div class="row justify-content-center">
            <div class="col-lg-8 col-md-10 col-sm-12">
                <h2 class="my-3 py-3 shadow-sm bg-light text-center">
                    <mark class="sky">계획 목록</mark>
                </h2>
            </div>
            <div class="col-lg-8 col-md-10 col-sm-12">
                <div class="gallery">
                    <div v-for="plan in planners" :key="plan.id" class="gallery-item">
                        <div>
                            <img :src="getImageUrl(plan.thumbnailImgInfo)" alt="Loaded from server"
                                class="gallery-image">
                            <div class="gallery-info">
                                <div class="gallery-title">
                                    {{ plan.planTitle }}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>