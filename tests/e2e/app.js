import {CfFullCalendar} from './../../src/index';

new Vue({
    el: '#app',
    data () {
        return {
            events: [
                {
                    id: 1,
                    title: 'First event',
                },
                {
                    id: 2,
                    title: 'Second event'
                }
            ]
        }
    },
    components: {
        'full-calendar': new CfFullCalendar(Vue, $, defaultsDeep)
    }
});
