<template>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="closeModal" :append-to-body="appendBody" :title="dialogType==='edit'?'修改提示语':'新增提示语'">
        <el-form :model="formInfo" ref="formInfo" :rules="rules" label-width="100px" label-position="left">
            <el-form-item label="提示语名称" prop="promptName">
                <el-input v-model="formInfo.promptName" placeholder="请输入提示语名称" />
            </el-form-item>
            <el-form-item label="命中提示语" prop="hitPrompt">
                <el-input v-model="formInfo.hitPrompt" placeholder="请输入提示语" />
            </el-form-item>
            <el-form-item label="未命中提示语" prop="unHitPrompt">
                <el-input v-model="formInfo.unHitPrompt" placeholder="请输入提示语" />
            </el-form-item>
            <el-form-item label="选择权限" prop="permissionArr">
                <el-checkbox-group v-model="formInfo.permissionArr">
                    <el-checkbox label="1">客户经理</el-checkbox>
                    <el-checkbox label="2">内控</el-checkbox>
                    <el-checkbox label="3">我司审批</el-checkbox>
                    <el-checkbox label="4">银行审批</el-checkbox>
                    <el-checkbox label="5">面签</el-checkbox>
                    <el-checkbox label="6">放款</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item style="text-align:right;">
                <el-button @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="confirmRole">确定</el-button>
                <!--<el-button @click="resetForm">重置</el-button>-->
            </el-form-item>
        </el-form>

    </el-dialog>
</template>

<script>
import {changePermissionToText} from "../../../../utils/changeValue"
    export default {
        name: "addRemark",
        data(){
            return{
                formInfo: {
                    promptName:"",
                    hitPrompt:"",
                    unHitPrompt:"",
                    permissions:[],  //权限文字
                    permissionArr:[],
                    permission:"",
                },
                dialogVisible:false,
                closeModal:false,
                appendBody:true,
                index:"",
                rules:{
                    promptName:[
                        { required: true, message: '请输入提示语名称', trigger: 'blur' },
                    ],
                    permissionArr:[
                        { required: true, message: '请输入提示语设置权限', trigger: 'change' },
                    ]
                }
            }
        },
        props:{
            dialogType:{
                type:String,
                default:'new'
            }
        },
        methods:{
            openAdd(){
                this.dialogVisible = true;
                if(this.dialogVisible){
                    this.formInfo = {
                        promptName:"",
                        hitPrompt:"",
                        unHitPrompt:"",
                        permissions:[],
                        permissionArr:[],
                    }
                }

            },
            openEdit(row,index){
                this.dialogVisible = true;
                this.formInfo = row;
                this.index = index;
            },
            confirmRole(){
                this.$refs.formInfo.validate((valid) => {
                    if(valid){
                        //permission:"4,5"   permissionArr:["4,5"]   permissions:"银行审批,面签"

                        this.formInfo.permissions = changePermissionToText(this.formInfo.permissionArr);
                        this.formInfo.permission = this.formInfo.permissionArr.toString();

                        //把新建的提示语表单传给父组件
                        this.$emit('changedFormInfo',this.formInfo,this.index);
                        //把新建的提示语信息表单 放到store里
                        this.$store.state.remarkInfoForm = this.formInfo;
                        this.dialogVisible = false;
                    }
                })

            },
            //重置
            resetForm(){
                this.$refs.formInfo.resetFields();
            }
        }
    }
</script>

<style scoped>

</style>