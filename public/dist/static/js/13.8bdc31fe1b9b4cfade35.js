webpackJsonp([13],{QQmU:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var o=t("I3G/"),s=t.n(o),i={methods:{socCrCodeValidator:function(e,r,t){r&&""!==r?(/(^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$)/.test(r)||t(new Error("请输入合理的统一社会信用代码")),t()):t(new Error("请输入统一社会信用代码"))},certNoValidator:function(e,r,t){switch(e.certType){case"id_type_1":/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/.test(r)?t():t(new Error("请输入正确的证件号码"));break;case"id_type_2":/^[a-zA-Z0-9]{5,17}$/.test(r)?t():t(new Error("请输入正确的证件号码"));break;case"id_type_3":/^[HMChmc]{1}([0-9]{8,10})$/.test(r)?t():t(new Error("请输入正确的证件号码"));break;case"id_type_4":/^[0-9]{8,10}$/.test(r)?t():t(new Error("请输入正确的证件号码"));break;default:t(new Error("请输入正确的证件号码"))}},bankNoValidator:function(e,r,t){r&&""!==r?/^([1-9]{1})\d{1,30}$/.test(r)?this.$api.cust.customer.checkAcctNo(r,e.cusId?e.cusId:"").then(function(e){e?t(new Error("银行卡号码已注册")):t()}):t(new Error("请输入合理的银行卡号码")):t(new Error("银行卡号码不能为空"))},telephoneValidator:function(e,r,t){if(""===r)t(new Error("请输入手机号码"));else if(/^1[34578]\d{9}$/.test(r)){var o={phoneNo:r};e.userId&&(o.userId=e.userId),e.excludeCurUser&&(o.excludeCurUser=e.excludeCurUser),s.a.api.core.checkUserExist(o).then(function(r){e.existForTrue?r?(t(),e.callback&&e.callback(r,e.param)):(t(new Error("该手机号还未注册")),e.callback()):r?t(new Error("手机号码已注册")):t()})}else t(new Error("请输入合理手机号码"))},emailValidator:function(e,r,t){r&&""!==r||t();/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(r)?t():t(new Error("邮箱格式不正确"))},loginNameValidator:function(e,r,t){r?this.$api.bsp.user.checkCode(e.userId,r).then(function(e){"success"!==e.type||e.msg?t():t(new Error("登录名已存在"))}):t()},checkNum:function(e,r,t){r&&(/^\d*$/.test(r)?t():t(new Error("请输入数字!"))),t()}}},a=t("QmSG"),n={mixins:[i],data:function(){var e=this;return{registerForm:{cusName:"",contactorName:"",contactorPhone:"",contactorId:"",password:"",password2:"",verifyCode:"",msgVerifyCode:""},newUser:!0,loading:!1,time:0,smsCodeLoading:!1,btnText:"立即注册",verifyCode:"",rules:{cusName:[{required:!0,trigger:"blur",validator:function(r,t,o){""!==t&&t?(t.length<3||t.length>30)&&o(new Error("长度在 3 到 30 个字符")):o(new Error("请输入企业名称")),e.$api.cust.register.checkCustomerExist({cusName:t}).then(function(e){e&&o(new Error("已存在企业，请直接登录")),o()})}}],contactorName:[{required:!0,message:"请输入您的姓名",trigger:"blur"},{min:2,max:20,message:"长度在 2 到 20 个字符",trigger:"blur"}],contactorPhone:[{required:!0,trigger:"blur",validator:this.telephoneValidator}],password:[{required:!0,message:"请输入登录密码",trigger:"blur"},{min:6,max:20,message:"长度在 6 到 20 个字符",trigger:"blur"}],password2:[{required:!0,trigger:"blur",validator:function(r,t,o){t!==e.registerForm.password&&o(new Error("两次密码不一致")),o()}}],verifyCode:[{required:!0,trigger:"blur",message:"请输入验证码"}],msgVerifyCode:[{required:!0,trigger:"blur",message:"请输入手机验证码"}]}}},computed:{smsBtnText:function(){return this.smsCodeLoading?this.time+"s":"获取验证码"}},watch:{newUser:function(){var e=this.registerForm.cusName;this.resetForm("registerForm"),this.registerForm.cusName=e,this.registerForm.contactorId=""}},methods:{phoneCallback:function(e){e?(this.registerForm.contactorName=e.userName,this.registerForm.contactorId=e.userId):(this.registerForm.contactorName="",this.registerForm.contactorId="")},go:function(e){e.bean&&e.bean.serviceUrl?window.location.href=e.bean.serviceUrl:this.$router.push({name:"bsp.accreditation.register-success"})},getSMS:function(){var e=this;console.debug("getSMS..."),this.$refs.registerForm.validateField("contactorPhone",function(r){if(console.debug("errorMessage="+r),!r){e.smsCodeLoading=!0,e.time=60;var t=setInterval(function(){e.time--,0===e.time&&(e.smsCodeLoading=!1,clearInterval(t))},1e3);e.$api.cust.register.sendSMS({phoneNo:e.registerForm.contactorPhone}).then(function(e){})}})},submitForm:function(e){var r=this;this.$refs[e].validate(function(e){if(!e)return!1;r.loading=!0,r.btnText="正在注册...",r.$api.cust.register.register(r.registerForm).then(function(e){if(r.loading=!1,r.btnText="立即注册","success"===e.type){var t={};t=r.newUser?{username:r.registerForm.contactorPhone,password:r.registerForm.password,kaptchaReceived:r.registerForm.verifyCode,grant_type:"password",client:"frontend",appCode:a.a.appCode}:{username:r.registerForm.contactorPhone,msgVerifyCode:r.registerForm.msgVerifyCode,grant_type:"password",client:"frontend",msgLogin:!0,appCode:a.a.appCode,entId:e.bean.entId},r.loading=!0,r.btnText="正在登录...",r.$store.dispatch("login",t).then(function(e){var t=e.isLogin,o=e.msg;r.loading=!1,r.btnText="立即注册",t&&r.go(o)})}})})},resetForm:function(e){this.$refs[e].resetFields()},refreshVerifyCode:function(){var e=this;this.$api.core.getCaptcha(Math.random()).then(function(r){e.verifyCode=r.body,e.loading=!1})},created:function(){this.refreshVerifyCode()}}},c={render:function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("div",[t("pl-header"),e._v(" "),t("pl-layout",{staticClass:"layout-contianer",attrs:{"show-left":!1}},[t("pl-content-box",{attrs:{slot:"right"},slot:"right"},[t("br"),e._v(" "),t("div",{staticClass:"bolck-title"},[t("span",[e._v("注册信息")])]),e._v(" "),t("el-form",{ref:"registerForm",staticClass:"register-form",attrs:{model:e.registerForm,rules:e.rules,"label-width":"100px"}},[t("pl-content-box-block",{attrs:{"fixed-width":!1}},[t("pl-content-box-card",{staticClass:"accreditation-content-box no-border"},[t("div",{staticClass:"accreditation-content"},[t("el-form-item",{attrs:{prop:"contactorName",label:"用户姓名"}},[t("el-row",[t("el-col",{attrs:{span:12}},[t("el-input",{attrs:{disabled:!e.newUser,placeholder:"请输入用户姓名",tips:"您的姓名将作为系统的用户名"},model:{value:e.registerForm.contactorName,callback:function(r){e.$set(e.registerForm,"contactorName",r)},expression:"registerForm.contactorName"}})],1)],1)],1),e._v(" "),t("el-form-item",{attrs:{prop:"contactorPhone",label:"手机号",rules:[{required:!0,message:"手机号码不能为空",trigger:"change"},{callback:e.phoneCallback,required:!0,trigger:"blur",validator:this.telephoneValidator,existForTrue:!e.newUser}]}},[t("el-input",{attrs:{placeholder:"建议使用常用手机",tips:"注册成功后，您可以用该手机登录和找回密码"},model:{value:e.registerForm.contactorPhone,callback:function(r){e.$set(e.registerForm,"contactorPhone",r)},expression:"registerForm.contactorPhone"}})],1),e._v(" "),e.newUser?t("el-form-item",{attrs:{prop:"password",label:"登录密码"}},[t("el-input",{attrs:{type:"password",placeholder:"请输入登录密码",tips:"建议使用字母、数字和符号两种以上的组合，6-20个字符"},model:{value:e.registerForm.password,callback:function(r){e.$set(e.registerForm,"password",r)},expression:"registerForm.password"}})],1):e._e(),e._v(" "),e.newUser?t("el-form-item",{attrs:{prop:"password2",label:"确认密码"}},[t("el-input",{attrs:{type:"password",placeholder:"请再次输入密码",tips:"请再次输入密码"},model:{value:e.registerForm.password2,callback:function(r){e.$set(e.registerForm,"password2",r)},expression:"registerForm.password2"}})],1):e._e(),e._v(" "),e.newUser?t("el-form-item",{attrs:{prop:"verifyCode",label:"验证码"}},[t("el-row",[t("el-col",{staticStyle:{"padding-right":"4px"},attrs:{span:20}},[t("el-input",{attrs:{placeholder:"请输入验证码"},model:{value:e.registerForm.verifyCode,callback:function(r){e.$set(e.registerForm,"verifyCode",r)},expression:"registerForm.verifyCode"}})],1),e._v(" "),t("el-col",{staticClass:"text-right",attrs:{span:4}},[t("div",{staticClass:"code-img"},[t("div",{attrs:{title:"点击刷新验证码",width:"80"},domProps:{innerHTML:e._s(e.verifyCode)},on:{click:e.refreshVerifyCode}})])])],1)],1):e._e(),e._v(" "),t("el-form-item",{attrs:{prop:"msgVerifyCode",label:"短信验证码"}},[t("el-row",[t("el-col",{staticStyle:{"padding-right":"5px"},attrs:{span:19}},[t("el-input",{attrs:{placeholder:"请输入手机验证码"},model:{value:e.registerForm.msgVerifyCode,callback:function(r){e.$set(e.registerForm,"msgVerifyCode",r)},expression:"registerForm.msgVerifyCode"}})],1),e._v(" "),t("el-col",{staticClass:"text-right",attrs:{span:5}},[t("el-button",{staticStyle:{padding:"10px 14px"},attrs:{type:"primary",loading:e.smsCodeLoading},on:{click:e.getSMS}},[e._v(e._s(e.smsBtnText))])],1)],1)],1),e._v(" "),t("el-form-item",{staticStyle:{"text-align":"center"}},[t("el-button",{attrs:{type:"primary",loading:e.loading},on:{click:function(r){e.submitForm("registerForm")}}},[e._v(e._s(e.btnText))]),e._v(" "),t("el-button",{on:{click:function(r){e.resetForm("registerForm")}}},[e._v("重置")])],1)],1)])],1)],1)],1)],1)],1)},staticRenderFns:[]};var l=t("VU/8")(n,c,!1,function(e){t("w/MU")},"data-v-24a99437",null);r.default=l.exports},"w/MU":function(e,r){}});
//# sourceMappingURL=13.8bdc31fe1b9b4cfade35.js.map