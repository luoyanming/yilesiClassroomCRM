import HeaderComponent from './header.vue'

const Header = {
    install: function(Vue) {
        Vue.component('Header', HeaderComponent);
    }
}

export default Header