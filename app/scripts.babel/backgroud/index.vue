<template>
    <div>

    </div>
</template>
<script>    

import { setTimeout, setInterval, clearInterval } from 'timers';
import $ from 'jquery';

export default {
    created(){

        let links = [];
        let start = 0;
        let count = 0;
        let i =0 ;

        document.body.addEventListener('DOMNodeInserted', OnNodeInserted, true);

        function OnNodeInserted(event) {

            window.scrollTo(0, document.body.scrollHeight);

            console.log(i++);
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
                    console.log('STOP AND SEND DATA');
                    console.log(result);
                    clearInterval(timer);
                }
            }
        }, 10000);

    }
}
    
</script>