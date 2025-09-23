export default {
    parentId: [
    { required: true, message: '上级单位不能为空', trigger: 'blur' },
    ],
    deptName: [
        { required: true, message: '部门名称不能为空', trigger: 'blur' },
    ],
    orderNum: [
        { required: true, message: '显示排序不能为空', trigger: 'blur' },
    ],
    phone: [
        { required: false, message: '手机号不能为空', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
    ],
   email: [
     { required: false, message: '邮箱不能为空', trigger: 'blur' },
     { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ],

    status: [
     { required: true, message: '状态不能为空', trigger: 'blur' },
    ]
}