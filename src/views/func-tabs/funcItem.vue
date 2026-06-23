<template>
    <div :class="['viewer-func-item', {'viewer-func-item-more': hasMore, 'viewer-func-item-active': active && enableActive, 'viewer-func-item-small': size=='small'}]"
        v-show="visible"
        @click="handleClick">
        <div :class="['viewer-func-item-icon', item.iconClass, icon]"></div>
        <div class="viewer-func-item-label">{{label || item.name}}</div>
        <slot></slot>
    </div>
</template>
<script>
import * as FuncItems from './funcItems.js'
export default {
    props: {
        item: {
            type: Object,
            default: function () {
                return {
                    code: null,
                    name: null,
                    iconClass: null,
                    active: false,
                }
            }
        },

        size: {
            type: String,
            default: function () {
                return null
            }
        },

        icon: {
            type: String,
            default: function () {
                return ''
            }
        },

        label: {
            type: String,
            default: function () {
                return null
            }
        },

        visible: {
            type: Boolean,
            default: function () {
                return true
            }
        },

        enableActive: {
            type: Boolean,
            default: function () {
                return false
            }
        },

        hasMore: {
            type: Boolean,
            default: function () {
                return false
            }
        },
    },
    computed: {
        funcItemClickTime(){
            return FuncItems.funcState.getActiveItem().clickTime
        }
    },
    watch: {
        funcItemClickTime(val){
            let state = FuncItems.funcState.getActiveItem()
            if(state.code == this.item.code && state.group == this.item.group){
                if(this.item.enableToggle){
                    this.item.active = !this.item.active
                } else {
                    this.item.active = true
                }
                // console.log('choose ', state.code, this.item.active + '')
            }else{
                this.item.active = false
            }
            this.active = this.item.active
        }, 
    },
    data(){
        return {
            act: 'zyv',
            active: this.item.active
        }
    },
    methods: {
        handleClick(){
            if(this.enableActive){
                FuncItems.funcState.setActiveItem(this.item)
            }
            this.$emit('on-click', this.item)
        },
    }
}
</script>




