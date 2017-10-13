import NavComponent from './nav.vue'

const Nav = {
    install: function(Vue) {
        Vue.component('Nav', NavComponent);
    }
}

export default Nav