<script setup>

</script>

<template>
<div>
    <!--배너 부분 시작-->
    <div>
        <div id="cards" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to="0" class="active" aria-current="true"
                        aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner">
                <div class="carousel-item active " data-bs-interval="5000">
                    <img src="/src/assets/img/bg6.jpg" class="d-block w-100" alt="...">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>First slide label</h5>
                        <p>Some representative placeholder content for the first
                            slide.</p>
                    </div>
                </div>
                <div class="carousel-item" data-bs-interval="5000">
                    <img src="/src/assets/img/bg4.jpg" class="d-block w-100" alt="...">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>First slide label</h5>
                        <p>Some representative placeholder content for the first
                            slide.</p>
                    </div>
                </div>
                <div class="carousel-item" data-bs-interval="5000">
                    <img src="/src/assets/img/bg3.jpg" class="d-block w-100" alt="...">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>First slide label</h5>
                        <p>Some representative placeholder content for the first
                            slide.</p>
                    </div>
                </div>
            </div>
            <button class="carousel-control-prev" type="button"
                    data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button"
                    data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>

    <!-- 배경 색상과 불투명도를 가진 섹션 -->
    <div class="background-color-section">
        <div class="text-center mb-5" style="margin-top: 3cm; margin-bottom: 2cm">
            <h4>
                <mark>한국의 아름다운 여행지로 떠나보세요</mark>
            </h4>
        </div>

        <!--배너 부분 끝-->
        <div class="container mt-5">
            <div class="container mt-5">
                <div class="row g-4">
                    <!-- 이미지 반복 시작 -->
                    <div class="col-4">
                        <div class="square-image">
                            <img src="/src/assets/img/bg4.jpg" class="img-fluid" alt="Image">
                        </div>
                    </div>
                    <!-- 이미지 9개에 대해 위의 div를 반복 -->
                    <div class="col-4">
                        <div class="square-image">                        
                            <img src="/src/assets/img/bg4.jpg" class="img-fluid" alt="Image">
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="square-image">
                            <img src="/src/assets/img/bg4.jpg" class="img-fluid" alt="Image">
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="square-image">
                            <img src="/src/assets/img/bg4.jpg" class="img-fluid" alt="Image">
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="square-image">
                            <img src="/src/assets/img/bg4.jpg" class="img-fluid" alt="Image">
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="square-image">
                            <img src="/src/assets/img/bg4.jpg" class="img-fluid" alt="Image">
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="square-image">
                            <img src="/src/assets/img/bg4.jpg" class="img-fluid" alt="Image">
                        </div>
                    </div>

                    <div class="col-4">
                        <div class="square-image">
                            <img src="/src/assets/img/bg4.jpg" class="img-fluid" alt="Image">
                        </div>
                    </div>

                    <div class="col-4">
                        <div class="square-image">
                            <img src="/src/assets/img/bg4.jpg" class="img-fluid" alt="Image">
                        </div>
                    </div>

                    <!-- 더 많은 이미지 컬럼 추가 -->
                </div>
            </div>

            <div class="text-center">
                <button class="btn btn-primary">핫플 이동하기</button>
            </div>
        </div>
    </div>

</div>
</template>

<style scoped>
@import "/src/assets/css/common.css"
/* @import '/src/assets/css/member.css' */
</style>