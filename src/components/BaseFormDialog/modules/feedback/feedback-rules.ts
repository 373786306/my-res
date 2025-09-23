export default {
    fillUnit: [
    { required: true, message: '填报单位不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '填报单位长度必须在2到20个字符之间', trigger: 'blur' }

    ],
    fillBy: [
        { required: true, message: '填报人不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '填报人长度必须在2到20个字符之间', trigger: 'blur' }
    ],

    contact: [
        { required: false, message: '联系方式不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '联系方式长度必须在2到20个字符之间', trigger: 'blur' }
    ],
    assessStatus: [
        { required: true, message: '评估状态不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '评估状态长度必须在2到20个字符之间', trigger: 'blur' }
    ],
    suitSituation: [
        { required: true, message: '适用情形不能为空', trigger: 'blur' },
        { min: 2, max: 100, message: '适用情形长度必须在2到100个字符之间', trigger: 'blur' }
    ],
    implementationSituation: [
        { required: true, message: '贯标情况不能为空', trigger: 'blur' },
        { min: 2, max: 100, message: '贯标情况长度必须在2到100个字符之间', trigger: 'blur' }
    ],
    
}