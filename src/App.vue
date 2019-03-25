<template>
	<div id="app">
        <div class="app-container">
            <div class="container-wrapper">
                <HeaderComponent></HeaderComponent>

                <NavComponent></NavComponent>

                <div id="app-content">
                    <transition name="fade" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </div>            
            </div>
        </div>
    </div>
</template>

<script>
    import NavComponent from './components/nav/nav.vue'
    import HeaderComponent from './components/header/header.vue'

    export default {
        components: {
            NavComponent,
            HeaderComponent
        },
        data() {
            return {

            }
        },
        watch: {
            
        },
        methods: {

        },
        mounted() {

        }
    }
</script>