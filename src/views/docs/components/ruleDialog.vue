<template>
    <!--:close-on-click-modal="closeModal"-->
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle"  width="70%" :close-on-click-modal="false">
        <div  class="el-dialog-div">
            <el-divider content-position="left">基础信息</el-divider>
            <el-form :model="formInfo" :rules="rules" ref="formInfo" label-width="110px" label-position="left">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="规则组名称" prop="rgname">
                            <el-input v-model="formInfo.rgname" placeholder="请输入规则组名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="规则组类型" prop="rgType">
                            <el-select v-model="formInfo.rgType" placeholder="请选择" style="width: 100%">
                                <el-option
                                        v-for="item in ruleTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="规则组简称">
                            <el-input v-model="formInfo.codename" placeholder="请输入规则组简称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="适用机构" prop="institution">
                            <el-select v-model="formInfo.institution" placeholder="请选择" style="width: 100%">
                                <el-option
                                        v-for="item in orzOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="提示语返回方式">
                            <el-select v-model="formInfo.returnType" placeholder="请选择" style="width: 100%">
                                <el-option
                                        v-for="item in optionsType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否生效" prop="status">
                            <el-radio-group v-model="formInfo.status">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="展示区域">
                            <el-select v-model="formInfo.showArea" placeholder="请选择" style="width: 100%">
                                <el-option
                                        v-for="item in optionsRegion"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="优先级">
                            <el-input v-model="formInfo.ruleLevel" placeholder="请输入优先级" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-divider content-position="left" class="title">提示语信息</el-divider>
            <!--提示语表格-->
            <marked-table ref="markRef"></marked-table>

            <el-divider content-position="left" class="title">规则信息</el-divider>
            <el-button type="success" icon="el-icon-plus" @click="handleAddRule">新增规则</el-button>
            <!--规则表格-->
            <rules-table ref="ruleRef"></rules-table>

            <div style="text-align:right;margin: 24px ">
                <el-button  @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </div>
        </div>

    </el-dialog>
</template>

<script>
    import MarkedTable from "./components/markedTable";
    import RulesTable from "./components/rulesTable";
    import {remarkInfoQuery ,ruleGroupIdQuery ,saveInfo} from "../../../api/rules"
    import {changePermissionToText} from "../../../utils/changeValue"

    export default {
        name: "ruleDialog",
        components: {RulesTable, MarkedTable},
        data(){
            return{
                closeModal:false,
                formLabelWidth: '120px',
                dialogTitle:"",
                formInfo: {
                    rgname:"",
                    rgType:"",
                    codename:"",
                    institution:"",
                    returnType:"",
                    status:"",
                    showArea:"",
                    ruleLevel:"",
                },
                dialogVisible: false,
                isShow:false,
                ruleTypeOptions: [],
                orzOptions:[],
                optionsType:[
                    {value: 1, label:'按规则组返回'},
                    {value: 2, label: '按规则返回T'},
                    {value: 3, label: '按规则返回F'}
                    ],
                optionsRegion:[
                    {value: 1, label: 'DTI'},
                    {value: 2, label: '中联惠捷评分'},
                    {value: 3, label: '中征信评分'},
                    {value: 4, label: '外部数据'},
                    {value: 5, label: '征信规则提示'},
                    {value: 6, label: '规则组语句'}
                    ],
                rules:{
                    rgname:[
                        { required: true, message: '请输入规则组名称', trigger: 'blur' },
                    ],
                    rgType:[
                        { required: true, message: '请输入规则组类型', trigger: 'blur' },
                    ],
                    institution:[
                        { required: true, message: '请选择适用机构', trigger: 'change' },
                    ],
                    status:[
                        { required: true, message: '请选择是否生效', trigger: 'change' },
                    ],
                }
            }
        },
        watch:{
            "$store.state.dialogType": {
                handler(newVal, oldVal) {
                    this.dialogTitle = newVal ==='edit'?'修改规则组':'新增规则组'
                },
                deep:true
            },

        },
        mounted(){
            this.ruleTypeOptions = this.$store.state.ruleTypeOptions;
            this.orzOptions = this.$store.state.orzOptions;
            // this.markOptions = this.$store.state.markOptions;
            // this.regionOptions = this.$store.state.regionOptions;


        },
        methods:{
            //新增规则信息的按钮
            handleAddRule() {
                this.$refs.formInfo.validate((valid) => {
                    if(valid){
                        this.$refs.ruleRef.openAdd();
                    }
                })

            },
            getTableInfo(rgruleid){
                console.log("rgruleid",rgruleid)
                let param = Object.assign({
                    rgruleid:rgruleid
                })
                //获取dialog内容详细信息 + 提示语信息
                remarkInfoQuery(param).then(res => {
                    this.formInfo = res[0];
                    let data = res[0].rulePromptObjects
                    data.map(cur => {
                        cur.permissions = changePermissionToText(cur.permissions);
                    })
                    // console.log(data)
                    this.$store.state.markInfoTable = res[0].rulePromptObjects
                })

               // 获取规则信息
                ruleGroupIdQuery(param).then(res => {
                    this.$store.state.ruleInfoTable = res.data

                })
            },
            open(){
                this.dialogVisible = true;
                this.formInfo = {
                    rgname:"",
                    rgType:"",
                    codename:"",
                    institution:"",
                    returnType:"",
                    status:"",
                    showArea:"",
                    ruleLevel:"",
                }
            },
            cancel(){
                this.dialogVisible = false;
            },
            confirm(){
                this.$refs.formInfo.validate((valid) => {
                    if(valid){
                        let params = Object.assign({},this.formInfo,this.$store.state.remarkInfoForm,this.$store.state.ruleInfoForm)
                        console.log("this.formInfo",this.formInfo);
                        console.log("this.remarkInfoForm",this.$store.state.remarkInfoForm);
                        console.log("this.ruleInfoForm",this.$store.state.ruleInfoForm);
                        console.log("params",params);
                        saveInfo(params).then(res => {
                            //todo later
                            this.dialogVisible = false;
                            alert('submit!');
                        })
                    }
                })


            },

        }
    }
</script>

<style scoped>
    .el-divider__text{
        font-size: 20px;
    }
    .title{
        margin: 42px 0;
    }
    .el-dialog-div{
        height: 70vh;
        overflow: auto;
    }
    .el-dialog-div .el-form .el-row{
        margin-left: 0!important;
        margin-right: 0!important;
    }

</style>