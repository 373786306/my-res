import type{ FormItemRule } from 'element-plus';

export default {
    industryName: [
    { required: true, message: '级别名称不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '级别名称长度必须在2到20个字符之间', trigger: 'blur' },
    
    ],
    industryTableName: [
        { required: true, message: '级别表名不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '级别表名长度必须在2到20个字符之间', trigger: 'blur' },
        {
            validator: (_rule: FormItemRule, value: string, callback: (error?: string | Error) => void) => {
            if (!value) return callback();

            // 正则：必须以字母开头，后续为字母、数字、下划线
            const pattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
            if (!pattern.test(value)) {
                return callback(new Error('表名必须以字母开头，且只能包含字母、数字和下划线'));
            }

            // 可选：避免 MySQL 关键字
            const MYSQL_KEYWORDS = new Set(['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'USER', 'ORDER', 'GROUP', 'WHERE', 'INDEX', 'VIEW', 'KEY', 'PRIMARY']);
            if (MYSQL_KEYWORDS.has(value.toUpperCase())) {
                return callback(new Error(`表名不能使用 MySQL 保留关键字：${value}`));
            }

            callback(); // 校验通过
            },
            trigger: 'blur'
        }
    ],
    industryDescription: [
        { required: true, message: '级别顺序不能为空', trigger: 'blur' },
    ]
}