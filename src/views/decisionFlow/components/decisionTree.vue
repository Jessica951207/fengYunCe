<template>
    <el-dialog :visible.sync="dialogVisible" width="60%">
        <div id="main" ref="main" :style="{width: '100%', height: '500px'}" ></div>
        <div style="text-align:right;">
            <el-button @click="cancel('userForm')">取消</el-button>
            <el-button type="primary" @click="confirm('userForm')">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {getDecisonInfo} from "../../../api/decisionProcess"
    export default {
        name: "decisionTree",
        data(){
            return{
                dialogVisible:false,
                myChart:null,
            }
        },
        mounted(){

        },
        methods:{
            open(){
                this.dialogVisible = true;
                setTimeout(() => {
                    this.drawTree();
                }, 0);
            },
            drawTree(){
                // var ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/flare.json';

                if(this.$refs.main) {
                    this.myChart = this.$echarts.init(this.$refs.main);
                    console.log(1111111)

                    var option;

                    this.myChart.showLoading();
                    getDecisonInfo().then(data => {
                        console.log("data", data)
                        this.myChart.hideLoading();

                        data.children.forEach(function (datum, index) {
                            index % 2 === 0 && (datum.collapsed = true);
                        });

                        this.myChart.setOption(option = {
                            tooltip: {
                                trigger: 'item',
                                triggerOn: 'mousemove'
                            },
                            series: [
                                {
                                    type: 'tree',

                                    data: [data],

                                    top: '1%',
                                    left: '7%',
                                    bottom: '1%',
                                    right: '20%',

                                    symbolSize: 7,

                                    label: {
                                        position: 'left',
                                        verticalAlign: 'middle',
                                        align: 'right',
                                        fontSize: 9
                                    },

                                    leaves: {
                                        label: {
                                            position: 'right',
                                            verticalAlign: 'middle',
                                            align: 'left'
                                        }
                                    },

                                    emphasis: {
                                        focus: 'descendant'
                                    },

                                    expandAndCollapse: true,
                                    animationDuration: 550,
                                    animationDurationUpdate: 750
                                }
                            ]
                        });
                    });

                    option && this.myChart.setOption(option);
                }else{
                    console.log("none")
                }

            },
            cancel(){
                this.dialogVisible = false;
            },
            confirm(){
                this.dialogVisible = false;
            },

        }
    }
</script>

<style scoped>

</style>