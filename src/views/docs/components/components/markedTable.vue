<template>
    <div>
        <el-button type="success" icon="el-icon-plus" @click="handleAddMark">新增提示语</el-button>
        <el-table :data="tableList" v-loading="listLoading" style="width: 100%;margin-top:10px;" border  max-height="250">
            <el-table-column align="center" label="序号" width="120">
                <template scope="scope">
                    <span>{{scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="提示语名称" >
                <template slot-scope="scope">
                    {{ scope.row.promptName }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="命中提示语" >
                <template slot-scope="scope">
                    {{ scope.row.hitPrompt }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="未命中提示语" >
                <template slot-scope="scope">
                    {{ scope.row.unHitPrompt }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="权限" >
                <template slot-scope="scope">
                    {{ scope.row.permissions }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope)">设置</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <add-remark ref="addRemarkRef" :dialogType="dialogType" @changedFormInfo="changedFormInfo"></add-remark>
    </div>
</template>

<script>
    import AddRemark from "./addRemark";
    import {remarkInfoQuery } from "../../../../api/rules"
    export default {
        name: "markedTable",
        components: {AddRemark},
        data(){
            return{
                dialogType:"new",
                tableList: [
                    // {promptName:"",hitPrompt:"",unHitPrompt:"",permissions:""},
                ],
                listLoading:false,
                sonFormVal:[],
                index:""
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
            "$store.state.markInfoTable":{
                handler(newVal,oldVal){
                    this.tableList = newVal;
                },
                deep:true
            },


        },
        mounted(){

        },
        methods:{
            changedFormInfo(val,index){
                console.log("接收子组件传过来的值",val,index);
                this.sonFormVal = val;
                this.index = index;

                if(this.dialogType === 'new'){
                    this.tableList.push(val);
                }else{
                    this.tableList.splice(index,1,val)
                    // console.log("aaaa",val)
                }

            },
            handleAddMark(){
                this.dialogType = "new";
                this.$refs.addRemarkRef.openAdd();
            },
            handleEdit({$index,row}){
                //permission:"1,2"    permissions:"客户经理，内控"     permissionArr:["1","2"]

                this.dialogType = "edit";
                console.log("row",row);

                if(row.permission != ""){
                    //把 "1,2,3"->["1","2","3"]
                    let permissionArr = row.permission.split(",");
                    let rowInfo = Object.assign({},row,{permissionArr:permissionArr});

                    console.log("处理好的rowInfo",rowInfo,$index)
                    this.$refs.addRemarkRef.openEdit(rowInfo,$index);
                }else{
                    console.log("参数permission为空！")
                }

            },
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