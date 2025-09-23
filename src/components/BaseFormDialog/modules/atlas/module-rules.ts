export default {
    productName: [
        { required: true, message: '产品名称不能为空', trigger: 'blur' },
        { type:'string', min: 1, max: 50, message: '产品名称长度必须在1到50个字符之间', trigger: 'blur' },
    ],
    productModel: [
        { required: true, message: '产品型号不能为空', trigger: 'blur' },
        { type:'string', min: 1, max: 50, message: '产品型号长度必须在1到50个字符之间', trigger: 'blur' },
    ],
    productType: [
        { required: true, message: '产品类型不能为空', trigger: 'blur' },
    ],
    productStatus: [
        { required: true, message: '产品状态不能为空', trigger: 'blur' },
    ]
    
}