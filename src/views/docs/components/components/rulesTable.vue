<template>
    <div style="display: inline;margin-left: 10px">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" style="display: inline">
            <el-form-item label="">
                <el-input v-model="formInline.name" placeholder="字段名称模糊查询"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                <!--<el-button type="success" icon="el-icon-plus" @click="handleAddRule">新增规则</el-button>-->
            </el-form-item>
        </el-form>
        <el-table :data="tableList" v-loading="listLoading" style="width: 100%;margin-top:10px;" border  max-height="250">
            <el-table-column align="center" label="序号" >
                <template scope="scope">
                    <span>{{scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="信息类型" >
                <template slot-scope="scope">
                    {{ scope.row.msgType }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="字段名称" width="300px">
                <template slot-scope="scope">
                    {{ scope.row.rname }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="类型" >
                <template slot-scope="scope">
                    {{ scope.row.type === 1 ? "判断" : "取值" }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="关系" >
                <template slot-scope="scope">
                    {{ changeRtypeToText(scope.row.rtype) }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="参数一" >
                <template slot-scope="scope">
                    {{ scope.row.rparam1 }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="参数二" >
                <template slot-scope="scope">
                    {{ scope.row.rparam2 }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="命中提示语" >
                <template slot-scope="scope">
                    {{ scope.row.hitPrompt }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="未命中提示语" width="150px">
                <template slot-scope="scope">
                    {{ scope.row.unHitPrompt }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope)">设置</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <add-rule-info ref="addRuleInfoRef" :dialogType="dialogType" @changedFormInfo="changedFormInfo"></add-rule-info>
    </div>

</template>

<script>
    import AddRuleInfo from "./addRuleInfo";
    import {ruleGroupIdQuery ,querySymbol} from "../../../../api/rules"
    export default {
        name: "rulesTable",
        components: {AddRuleInfo},
        data(){
            return{
                dialogType:"new",
                formInline: {
                    user: '',
                    user: '',
                    region: ''
                },
                tableList: [
                    // {msgId:'',msgType:'',fcname:'',type:"",rname:'',rtype:'',rparam1:'',rparam2:'',hitPrompt:'',unhitPrompt:''},
                ],
                listLoading:false,
                sonFormVal:[],
                index:"",
                relationOptions:[]
            }
        },
        watch:{
            "$store.state.dialogType": {
                handler(newVal, oldVal) {
                    if(newVal === "new"){
                        this.tableList = [];
                    }
                },
                deep:true
            },
            "$store.state.ruleInfoTable":{
                handler(newVal,oldVal){
                    this.tableList = newVal;
                },
                deep:true
            },

        },
        mounted(){
            this.getInitInfo();
        },
        methods:{
            //把rtype的value值改成文字
            changeRtypeToText(val){
                let result = "";
                this.$store.state.relationOptions.map(cur => {
                    if(cur.value == val){
                        result = cur.label
                    }
                })
                return result
            },
            getInitInfo(){
                //符号参数 addRuleInfo.vue里面需要的
                querySymbol().then(res => {
                    res.map(cur => {
                        this.$store.state.relationOptions.push({
                            value:cur.bcId,
                            label:cur.bcName,
                        })
                    })
                })
            },
            //搜索
            onSearch() {
                this.listLoading = true;
                let param = Object.assign({
                    rgruleid:this.$store.state.rgruleid,
                })
                ruleGroupIdQuery(param).then(res => {
                    this.listLoading = false;
                    this.tableList = res.data
                })
            },
            //新增规则信息
            // handleAddRule() {
            //     this.dialogType = 'new'
            //     this.$refs.addRuleInfoRef.openAdd();
            //
            // },
            //打开规则的dialog
            openAdd(){
                this.dialogType = 'new'
                this.$refs.addRuleInfoRef.openAdd();
            },
            //设置
            handleEdit({$index,row}){
                this.dialogType = 'edit'
                this.$refs.addRuleInfoRef.openEdit(row,$index);
            },
            // 修改的数据
            changedFormInfo(val,index){
                console.log("接收rule子组件传过来的值",val,index);
                this.sonFormVal = val;
                this.index = index;

                if(this.dialogType === 'new'){
                    this.tableList.push(val);
                }else{
                    this.tableList.splice(index,1,val)
                }

            },
            //删除
            handleDelete({$index}){
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableList.splice($index,1)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>