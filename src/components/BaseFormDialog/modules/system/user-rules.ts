export default {
    userName: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度必须在2到20个字符之间', trigger: 'blur' }
    ],
    nickName: [
        { required: true, message: '用户昵称不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '昵称长度必须在2到20个字符之间', trigger: 'blur' }
    ],
    phonenumber: [
        { required: false, message: '手机号不能为空', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
    ],
   email: [
     { required: false, message: '邮箱不能为空', trigger: 'blur' },
     { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ],
    password: [
     { required: true, message: '密码不能为空', trigger: 'blur' },
     { min: 2, max: 20, message: '用户名长度必须在2到20个字符之间', trigger: 'blur' }
    ]
}