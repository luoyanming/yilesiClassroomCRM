<template>
    <div class="app-container">
        <div class="container-wrapper">
            <Header></Header>

            <Nav></Nav>

            <div class="main-wrapper light-overscroll luoym">
                
                <section class="welcome">欢迎来到轻课堂CRM管理后台</section>
                
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                
            };
        }
    }
</script>

<style lang="scss" scoped>
    .welcome{
        position: absolute;
        z-index: 3;
        top: 50%;
        left: 50%;
        padding-top: 160px;
        white-space: nowrap;
        font-size: 18px;
        line-height: 1px;
        color: #ccc;
        background: url('/static/c-icon-logo.png') no-repeat center top;
        background-size: 120px 120px;
        -webkit-transform: translate3d(-50%, -160px, 0);
           -moz-transform: translate3d(-50%, -160px, 0);
            -ms-transform: translate3d(-50%, -160px, 0);
             -o-transform: translate3d(-50%, -160px, 0);
                transform: translate3d(-50%, -160px, 0);
    }
</style>

