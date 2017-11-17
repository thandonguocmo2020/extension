'use strict';

import Vue from 'vue';
import Popup from './popup/popup.vue';

import { setTimeout, setInterval, clearInterval } from 'timers';
import $ from 'jquery';

let links = [];
let start = 0;
let count = 0;

document.body.addEventListener('DOMNodeInserted', OnNodeInserted, true);

function OnNodeInserted(event) {

    window.scrollTo(0, document.body.scrollHeight);

    $('a').each(function () {
        if (!links.includes($(this).attr('href'))) {
            links.push($(this).attr('href'));
        }
    });

}

var timer = setInterval(function () {

    // continue
    if (links.length > 0 && links.length > start) {
        start = links.length;
    } else {
        // x3 time check stop
        if (count < 3) {
            count++;
        } else {

            let result = links.filter((item, index) => {
                if (index != 0 && item.split('/').length == 3) {
                    return item
                }
            });
            // console.log('STOP AND SEND DATA');
            // console.log(result);
            clearInterval(timer);
        }
    }
}, 10000);


var body = document.body;
var appVue = document.createElement('vue-app');
var appentAppVue = body.appendChild(appVue);
var _nodeVue = document.getElementsByTagName('vue-app');
_nodeVue[0].setAttribute('id', 'app-vue');


new Vue({
    el: '#app-vue',
    render: c => c(Popup)
});


