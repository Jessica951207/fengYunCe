<template>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="closeModal" :append-to-body="appendBody" :title="dialogType==='new'?'新增规则':'修改规则'" width="65%">
        <el-form :model="formInfo" ref="formInfo" :rules="rules" label-width="100px" label-position="left">
            <el-form-item label="信息类型">
                <el-select v-model="formInfo.msgParentId" placeholder="基础信息" @change="addListenerOnMsg">
                    <el-option
                            v-for="item in optionsInfoType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                <el-select v-model="formInfo.msgId" placeholder="请选择" style="margin-left: 15px">
                    <el-option
                            v-for="item in optionsInfoDetail"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="决策变量" prop="fcid">
                <el-select v-model="formInfo.fcid" placeholder="请选择" style="width: 100%">
                    <el-option
                            v-for="item in decisionVarOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="规则类型" prop="type">
                <el-select v-model="formInfo.type" placeholder="请选择规则类型" style="width: 100%">
                    <el-option
                            v-for="item in ruleTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="规则名称" prop="rname">
                <el-input v-model="formInfo.rname" placeholder="请输入规则名称" />
            </el-form-item>
            <el-form-item label="判断关系" prop="rtype">
                <el-select v-model="formInfo.rtype" placeholder="请选择" style="width: 100%">
                    <el-option
                            v-for="item in relationOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="参数一" prop="rparam1">
                <el-input v-model="formInfo.rparam1" placeholder="请输入参数一" />
            </el-form-item>
            <el-form-item label="参数二">
                <el-input v-model="formInfo.rparam2" placeholder="请输入参数二" />
            </el-form-item>
            <el-form-item label="命中提示语">
                <el-input v-model="formInfo.hitPrompt" placeholder="命中提示语" />
            </el-form-item>
            <el-form-item label="未命中提示语">
                <el-input v-model="formInfo.unHitPrompt" placeholder="未命中提示语" />
            </el-form-item>

        </el-form>
        <div style="text-align:right;">
            <el-button @click="dialogVisible=false">取消</el-button>
            <el-button type="primary" @click="confirmRole">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {loadField ,queryMsgtype ,queryMsgtypeParent ,querySymbol } from "../../../../api/rules"

    export default {
        name: "addRuleInfo",
        data(){
            return{
                dialogVisible:false,
                closeModal:false,
                appendBody:true,
                formInfo: {
                    msgParentId:'',
                    msgId:'',
                    fcid:'',
                    type:"",
                    rname:'',
                    rtype:'',
                    rparam1:'',
                    rparam2:'',
                    hitPrompt:'',
                    unHitPrompt:'',
                },
                optionsInfoType:[],
                optionsInfoDetail:[],
                infoDetail:[],
                decisionVarOptions:[],
                relationOptions:[],
                index:"",
                ruleTypeOptions:[
                    {label:"逻辑判断",value:1},
                    {label:"取值",value:2},
                ],
                rules:{
                    fcid:[
                        { required: true, message: '请选择决策变量', trigger: 'change' },
                    ],
                    type:[
                        { required: true, message: '请选择规则类型', trigger: 'change' },
                    ],
                    rname:[
                        { required: true, message: '请输入规则组名称', trigger: 'blur' },
                    ],
                    rtype:[
                        { required: true, message: '请选择判断关系', trigger: 'change' },
                    ],
                    rparam1:[
                        { required: true, message: '请输入参数一', trigger: 'blur' },
                    ],

                }
            }
        },
        props:{
            dialogType:{
                type:String,
                default:'new'
            }
        },
        mounted(){
            this.getInitInfo();
            //获取符号参数
            this.relationOptions = this.$store.state.relationOptions;
        },
        methods:{
            getInitInfo(){
                //父：信息类型 二级联动
                queryMsgtypeParent().then(res => {
                    res.map(cur => {
                        this.optionsInfoType.push({
                            value:cur.id,
                            label:cur.name
                        })
                    })
                })
                //子：信息类型的详细信息内容
                queryMsgtype().then(res => {
                    this.infoDetail = res;
                })

                //决策变量
                loadField().then(res => {
                    res.map(cur => {
                        this.decisionVarOptions.push({
                            value:cur.fcid,
                            label:cur.fcname,
                        })
                    })
                })

            },
            //二级联动
            addListenerOnMsg(){
                let parentChoose = this.formInfo.msgParentId;
                // console.log("parentChoose",parentChoose)
                this.optionsInfoDetail = [];
                this.infoDetail.map(cur => {
                    if(cur.parentId == parentChoose){
                        this.optionsInfoDetail.push({
                            value:cur.id,
                            label:cur.msgType
                        })
                    }
                })
            },
            //子 id 获取 父 id
            sonIdToGetParentId(val){
                let parentId = ""
                this.infoDetail.map(cur => {
                    if(cur.id == val){
                        parentId = cur.parentId
                    }
                })
                return parentId
            },
            openAdd(){
                this.dialogVisible = true;
                this.formInfo = {
                    msgParentId:'',
                    msgId:'',
                    fcid:'',
                    flag:"",
                    rname:'',
                    rtype:'',
                    rparam1:'',
                    rparam2:'',
                    hitPrompt:'',
                    unHitPrompt:'',
                }
            },
            openEdit(row,index){
                this.dialogVisible = true;
                // console.log("row",row);
                let msgParentId = this.sonIdToGetParentId(row.msgId);
                row = Object.assign(row,{msgParentId:msgParentId})
                this.formInfo = row;
                this.index = index;
                this.addListenerOnMsg();

            },
            confirmRole(){
                this.$refs.formInfo.validate((valid) => {
                    if(valid){
                        //把新建的规则信息放到store
                        this.$store.state.ruleInfoForm = this.formInfo;
                        this.$emit('changedFormInfo',this.formInfo,this.index);
                        this.dialogVisible = false;
                    }
                })

            },
        }
    }
</script>

<style scoped>

</style>