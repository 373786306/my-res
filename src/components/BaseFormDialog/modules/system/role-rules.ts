export default {
    
    roleName: [
        { required: true, message: '角色名称不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '角色名称长度必须在2到20个字符之间', trigger: 'blur' }
    ],
    roleKey: [
        { required: true, message: '角色权限不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '角色权限长度必须在2到20个字符之间', trigger: 'blur' }
    ],
    roleSort: [
        { required: true, message: '排序不能为空', trigger: 'blur' },
    ],
    status: [
     { required: true, message: '状态不能为空', trigger: 'blur' },
    ]
}