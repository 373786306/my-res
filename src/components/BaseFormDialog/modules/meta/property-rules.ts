export default {
    propertyName: [
        { required: true, message: '名称不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '名称长度必须在2到20个字符之间', trigger: 'blur' },
    ],
    propertyDisplayName: [
        { required: true, message: '显示名称不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '显示名称长度必须在2到20个字符之间', trigger: 'blur' }, 
    ],
    propertyValueType: [
        { required: true, message: '值类型不能为空', trigger: 'change' },
    ],
   
}