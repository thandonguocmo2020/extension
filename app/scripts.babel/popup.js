'use strict';

import Vue from 'vue';
import Popup from './popup/popup.vue';

document.addEventListener('DOMContentLoaded', () => {

    new Vue({
        el: '#app',
        render: c => c(Popup)
    })
    
})

