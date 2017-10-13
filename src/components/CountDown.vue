<template>
    <div>
        <el-button type="primary" size="small" :disabled="disabled">{{time | change}}</el-button>
    </div>
</template>

<script>
    let flag = false
    export default {
        data () {
            return {
                time : '获取验证码',
                disabled:false
            }
        },
        props : {
            start : {
                type : Boolean
            }
        },
        watch : {
            start (value,oldvalue) {
                if(value == true){
                    this.countDown()
                }
            }
        },
        methods: {
            countDown () {
                this.time = 60;
                let time = setInterval(()=>{
                    this.time --;
                    this.disabled = true;
                    if(this.time == 0){
                        this.$emit('countDown')
                        this.time = '重发'
                        this.disabled = false;
                        flag = true
                        clearInterval(time)
                    }
                },100)
            }
        },
        filters : {
            change (value) {
                if(!value) return ""
                if(!isNaN(value)){
                    if(flag == true){
                        return `重新发送${value}S`
                    }
                    return value+'S'
                }else{
                    return value
                }
            }
        }

    }
</script>