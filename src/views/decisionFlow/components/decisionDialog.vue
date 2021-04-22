<template>
    <!--Add & Edit Role-->
    <el-dialog :visible.sync="dialogVisible" >
        <el-form :model="formInfo" label-width="100px" label-position="left" ref="formInfoForm" :rules="rules">
            <el-form-item label="决策流名称" prop="username">
                <el-input v-model="formInfo.username" placeholder="请输入决策流名称"/>
            </el-form-item>
            <el-form-item label="决策流代号" prop="password">
                <el-input v-model="formInfo.password" placeholder="请输入决策流名称"/>
            </el-form-item>
            <el-form-item label="所属产品" prop="roleList">
                <el-select v-model="formInfo.roleList" multiple placeholder="请选择" style="width: 100%">
                    <el-option
                            v-for="item in ownRoleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属机构" prop="roleList">
                <el-select v-model="formInfo.roleList" multiple placeholder="请选择" style="width: 100%">
                    <el-option
                            v-for="item in ownRoleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否启用">
                <el-switch v-model="formInfo.value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="提示语返回">
                <el-switch v-model="formInfo.value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="运行锁">
                <el-switch v-model="formInfo.value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="活动形式">
                <el-input type="textarea" v-model="formInfo.desc"></el-input>
            </el-form-item>
        </el-form>
        <div style="text-align:right;">
            <el-button @click="cancel('userForm')">取消</el-button>
            <el-button type="primary" @click="confirm('userForm')">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "decisionDialog",
        data(){
            return{
                dialogVisible:false,
                formInfo: {
                    username:"",
                    password:"",
                    phone:"",
                    email:"",
                    roleList:[]
                },
                ownRoleOptions: [],
                rules:{
                    username:[
                        { required: true, message: '角色名不能为空', trigger: 'blur' },
                    ],
                    password:[
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                    ],

                }
            }
        },
        methods:{
            open(){
                this.dialogVisible = true;
            },
            cancel(formName){
                this.dialogVisible = false;
                // this.$refs[formName].resetFields();
            },
            confirm(formName){
                console.log("confirm!")
            },
        }
    }
</script>

<style scoped>

</style>