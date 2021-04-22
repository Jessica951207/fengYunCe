<template>
	<div class="user-admin">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="角色过滤">
                <el-select v-model="formInline.role" placeholder="请选择">
                    <el-option
                            v-for="item in ownRoleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户名称">
                <el-input v-model="formInline.user" placeholder="用户名称模糊查询"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增用户</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="userList"
                  v-loading="listLoading"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%;margin-top:10px;"
        >
            <el-table-column align="center" type="index" label="序号" width="120">
                <template scope="scope">
                    <span>{{(listQuery.page - 1) * listQuery.limit + scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="姓名" >
                <template slot-scope="scope">
                    {{ scope.row.username }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="手机号" >
                <template slot-scope="scope">
                    {{ scope.row.phone }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="拥有角色" >
                <template slot-scope="scope">
                    {{ scope.row.roleNames }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope)">设置</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTableList" />

        <!--Add & Edit Role-->
        <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改用户':'新增用户'">
            <el-form :model="user" label-width="90px" label-position="left" ref="userForm" :rules="rules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="user.username" placeholder="请输入用户名"  @blur="checkName"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="user.password" placeholder="请输入密码" v-if="isShow"/>
                    <el-button type="danger" @click="resetPsw" v-else="!isShow">重置密码</el-button>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="user.phone" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="电子邮箱" prop="email">
                    <el-input v-model="user.email" placeholder="请输入电子邮箱" />
                </el-form-item>
                <el-form-item label="拥有角色" prop="roleList">
                    <el-select v-model="user.roleList" multiple placeholder="请选择" style="width: 100%">
                        <el-option
                                v-for="item in ownRoleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div style="text-align:right;">
                <el-button @click="cancel('userForm')">取消</el-button>
                <el-button type="primary" @click="confirmRole('userForm')">确定</el-button>
            </div>
        </el-dialog>

        <!--Add & Edit Role-->
        <el-dialog :visible.sync="isShowPsw" width="40%">
            <el-form :model="psw" label-width="90px" label-position="left" ref="pswForm">
                <el-form-item label="新密码" prop="newPsw">
                    <el-input v-model="psw.newPsw" placeholder="请输入新密码"  @blur="checkName"/>
                </el-form-item>
                <el-form-item label="再次输入" prop="againPsw">
                    <el-input v-model="psw.againPsw" placeholder="请再次输入密码"/>
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button type="primary" @click="confirmReset">确定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import { getUserTable ,userAdd ,userOwnRole,getUserInfo,userModify,checkUserName,userDelete,resetPsw,roleAuth} from "../../../api/userManage";
    import Pagination from '@/components/Pagination'
    import {getSession} from "../../../utils/storage";

    const userInfo = getSession("userInfo");
export default {
	name: 'userAdmin',
    components: {Pagination},
    data(){
	    return{
            formInline: {
                role:"",
                user: ''
            },
            user: {
                username:"",
                password:"",
                phone:"",
                email:"",
                roleList:[]
            },
            routes: [],
            listLoading: true,
            userList: [
                {username:"jisso",phone:"13524629564",roleNames:"blackPink",remark:""},
                {username:"rose",phone:"13524629564",roleNames:"2blackPink",remark:"blackPink"}
            ],
            dialogVisible: false,
            dialogType: 'new',
            total: 10,
            listQuery : {
                page: 1,
                limit: 20,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: '+id'
            },
            ownRoleOptions: [],
            isShow:true,
            isShowPsw:false,
            psw:{
                newPsw:"",
                againPsw:"",
            },
            choose:{
                userId:"",
                username:""
            },
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
    mounted(){
        this.getRoleList();
        this.getTableList();

    },
    methods:{
        getRoleList(){
            userOwnRole().then( res => {
                console.log(res)
                res.data.map(cur => {
                    this.ownRoleOptions.push({
                        value:cur.roleId,
                        label:cur.roleName,
                    })

                })
            })
        },
        getTableList(){
            this.listLoading = true;
            let params = Object.assign(
                {roleId:this.formInline.role},
                {username:this.formInline.user},
                {page:this.listQuery.page},
                {limit:this.listQuery.limit}
            )
            getUserTable(params).then( res => {
                this.listLoading = false;
                this.userList = res.data;
                this.total = res.count
            })
        },
        onSearch() {
            this.getTableList();
        },
        handleAdd() {
            this.dialogType = 'new';
            this.dialogVisible = true;
            this.isShow = true;

        },
        handleEdit(scope) {
            this.choose.userId = scope.row.id;
            this.choose.username = scope.row.username;
            this.isShow = false;
            this.dialogType = 'edit';
            // let param = Object.assign({roleId:scope.row.id})
            getUserInfo(scope.row.id).then( res => {
                this.user.username = res.data.username;
                this.user.phone = res.data.phone;
                this.user.email = res.data.email;
                this.user.roleList = res.data.roleList
            })
            this.dialogVisible = true;

        },
        handleDelete({ $index, row }) {
            let param = Object.assign({userId:row.id})
            console.log(param)

            this.$confirm('确定要删除这个角色吗?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async() => {
                        await userDelete(param)
                        this.userList.splice($index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.getTableList();
                    }
                )
                .catch(err => { console.error(err) })
        },
        checkName(){
            let param = Object.assign(
                {username:this.user.username},
                {id:userInfo.id},
            )
            checkUserName(param).then(res => {
                if(res.code == 0){
                    this.$message({
                        type: 'success',
                        message: '用户名可以使用!'
                    })
                }else{
                    this.$message.error('用户名不可以使用!')
                }

            })
        },
        confirmRole(formName){
            console.log(this.user)
            let param = Object.assign(
                {id:this.choose.userId},
                this.user
            )

            if(this.dialogType === "new"){
                userAdd(param).then( res => {
                    console.log(res)
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    })
                    this.dialogVisible = false;
                    this.$refs[formName].resetFields();
                    this.getTableList();
                })
            }else{
                userModify(param).then( res => {
                    console.log(res)
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    })
                    this.dialogVisible = false;
                    this.$refs[formName].resetFields();
                })
            }

        },
        cancel(formName){
            this.dialogVisible = false;
            this.$refs[formName].resetFields();
        },
        resetPsw(){
            this.isShowPsw = true;
        },
        confirmReset(){
            let param = Object.assign(
                {userId:this.choose.userId },
                {username:this.choose.username},
                {password:this.psw.newPsw},
            )

            if(this.psw.newPsw != this.psw.againPsw){
                this.$message.error('密码不一致!')
            }else{
                resetPsw(param).then(res => {
                    this.isShowPsw = false;
                    this.$message({
                        type: 'success',
                        message: '密码修改成功!'
                    })
                })
            }

        }


    }

};
</script>

<style scoped>
    .user-admin{
        margin-top: 10px;
    }
</style>
