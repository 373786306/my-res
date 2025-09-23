export default {
    parentId: [
    { required: true, message: '上级菜单不能为空', trigger: 'blur' },
    ],
    menuType: [
        { required: true, message: '菜单类型不能为空', trigger: 'blur' },
    ],
    orderNum: [
        { required: true, message: '显示排序不能为空', trigger: 'blur' },
    ],
   menuName: [
     { required: true, message: '菜单名称不能为空', trigger: 'blur' },
     { min: 2, max: 30, message: '菜单名称长度必须在2到30个字符之间', trigger: 'blur' }
    ],
    path: [
     { required: true, message: '路由地址不能为空', trigger: 'blur' },
     { min: 2, max: 20, message: '路由地址长度必须在2到20个字符之间', trigger: 'blur' }
    ]
}