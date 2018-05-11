export function CfFullCalendar (Vue, $, defaultsDeep, eventsPropertyName = 'events') {
    const watch = {
        eventSources: {
          deep: true,
          handler (val) {
              this.$emit('rebuild-sources')
          },
        },
    }
    watch[eventsPropertyName] = {
        deep: true,
        handler (val) {
            $(this.$el).fullCalendar('removeEvents')
            $(this.$el).fullCalendar('addEventSource', this[eventsPropertyName])
        },
    }

    return Vue.extend({
        props: {
            events: {
                default() {
                    return []
                },
            },
            eventSources: {
                default() {
                    return []
                },
            },
            editable: {
                default() {
                    return true
                },
            },
            selectable: {
                default() {
                    return true
                },
            },
            selectHelper: {
                default() {
                    return true
                },
            },
            header: {
                default() {
                    return {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay'
                    }
                },
            },
            defaultView: {
                default() {
                    return 'agendaWeek'
                },
            },
            sync: {
                default() {
                    return false
                }
            },
            config: {
                type: Object,
                default() {
                    return {}
                },
            },
        },
        computed: {
            defaultConfig() {
                const self = this
                return {
                    header: this.header,
                    defaultView: this.defaultView,
                    editable: this.editable,
                    selectable: this.selectable,
                    selectHelper: this.selectHelper,
                    aspectRatio: 2,
                    timeFormat: 'HH:mm',
                    events: this[eventsPropertyName],
                    eventSources: this.eventSources,
                    eventRender(...args) {
                        if (this.sync) {
                            self[eventsPropertyName] = cal.fullCalendar('clientEvents')
                        }
                        self.$emit('event-render', ...args)
                    },
                    eventDestroy(event) {
                        if (this.sync) {
                            self[eventsPropertyName] = cal.fullCalendar('clientEvents')
                        }
                    },
                    eventClick(...args) {
                        self.$emit('event-selected', ...args)
                    },
                    eventDrop(...args) {
                        self.$emit('event-drop', ...args)
                    },
                    eventResize(...args) {
                        self.$emit('event-resize', ...args)
                    },
                    dayClick(...args){
                        self.$emit('day-click', ...args)
                    },
                    select(start, end, jsEvent, view, resource) {
                        self.$emit('event-created', {
                            start,
                            end,
                            allDay: !start.hasTime() && !end.hasTime(),
                            view,
                            resource
                        })
                    }
                }
            },
        },
        mounted() {
            const cal = $(this.$el)
            this.$on('remove-event', (event) => {
                if (event && event.hasOwnProperty('id')) {
                    $(this.$el).fullCalendar('removeEvents', event.id);
                } else {
                    $(this.$el).fullCalendar('removeEvents', event);
                }
            })
            this.$on('rerender-events', () => {
                $(this.$el).fullCalendar('rerenderEvents')
            })
            this.$on('refetch-events', () => {
                $(this.$el).fullCalendar('refetchEvents')
            })
            this.$on('render-event', (event) => {
                $(this.$el).fullCalendar('renderEvent', event)
            })
            this.$on('reload-events', () => {
                $(this.$el).fullCalendar('removeEvents')
                $(this.$el).fullCalendar('addEventSource', this.events)
            })
            this.$on('rebuild-sources', () => {
                $(this.$el).fullCalendar('removeEvents')
                this.eventSources.map(event => {
                    $(this.$el).fullCalendar('addEventSource', event)
                })
            })
            cal.fullCalendar(defaultsDeep(this.config, this.defaultConfig))
        },
        methods: {
            fireMethod(...options) {
                return $(this.$el).fullCalendar(...options)
            },
        },
        watch,
        beforeDestroy() {
            this.$off('remove-event')
            this.$off('rerender-events')
            this.$off('refetch-events')
            this.$off('render-event')
            this.$off('reload-events')
            this.$off('rebuild-sources')
        },
        render(h) {
            return h('div', {
                ref: 'calendar'
            })
        }
    })
}
