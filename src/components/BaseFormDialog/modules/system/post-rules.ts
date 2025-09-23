export default {
    
    postName: [
        { required: true, message: '岗位名称不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '岗位名称长度必须在2到20个字符之间', trigger: 'blur' }
    ],
    postCode: [
        { required: true, message: '岗位编码不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '岗位编码长度必须在2到20个字符之间', trigger: 'blur' }
    ],
    orderNum: [
        { required: true, message: '排序不能为空', trigger: 'blur' },
    ],
    status: [
     { required: true, message: '状态不能为空', trigger: 'blur' },
    ]
}