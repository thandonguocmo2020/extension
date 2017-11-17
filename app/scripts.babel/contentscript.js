'use strict';

import Vue from 'vue';
import Backgroud from './backgroud/index.vue';
import 'bootstrap';

// ADD VUE TO DOM 
var body = document.body;
var appVue = document.createElement('vue-app');
var appentAppVue = body.appendChild(appVue);
var _nodeVue = document.getElementsByTagName('vue-app');
_nodeVue[0].setAttribute('id', 'app-vue');

new Vue({
    el: '#app-vue',
    render: c => c(Backgroud)
});


