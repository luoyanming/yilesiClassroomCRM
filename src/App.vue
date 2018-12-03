<template>
	<div id="app">
        <div class="app-container">
            <div class="container-wrapper">
                <Header></Header>

                <Nav></Nav>

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
export default {
	name: 'app-content',
	components: {
	}
}

</script>