export default {
    templateName: [
        { required: true, message: '模板名称不能为空', trigger: 'blur' },
        { type:'string', min: 1, max: 50, message: '模板名称长度必须在1到50个字符之间', trigger: 'blur' },
    ],
    templateDescription: [
        { required: true, message: '模板描述内容不能为空', trigger: 'blur' },
        { type:'string', min: 1, max: 200, message: '模板描述内容长度必须在1到200个字符之间', trigger: 'blur' },
    ],
    
}