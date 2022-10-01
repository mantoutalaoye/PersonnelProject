<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="treeNode.isedit?'编辑部门':'新增部门'" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择">
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartments, addDepartments, updateDepartments } from '@/api/getDepartments'
import { getEmployeeSimple } from '@/api/employees'
// import { Loading } from 'element-ui'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      // 只要进入这个位置- 开始检查- 获取最新的数据
      const { depts } = await getDepartments() // 获取最新的数组
      // 判断value是否和 depts中的同级部门出现了重复
      // this.treeNode 是点击了哪个节点 添加子部门 仁伟财务部 的子级的pid = 仁伟财务部.id
      // value 123 - 要和treeNode的子级的去比较
      // id pid
      const list = depts.filter(item => item.pid === this.treeNode.id) // 得到的是所有的子级
      const isRepeat = list.some(item => item.name === value) // 是否重复
      isRepeat ? callback(new Error(`同级部门已经有${value}的部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments() // 获取最新的数组
      const isRepeat = depts.some(item => item.code === value)
      isRepeat ? callback(new Error(`组织架构中已经有${value}的编码了`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      peoples: [], // 接收获取的员工简单列表的数据,
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' }, {
            trigger: 'blur',
            validator: checkNameRepeat // 自定义函数的形式校验
          }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' }, {
            trigger: 'blur',
            validator: checkCodeRepeat
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  watch: {
    // 每次开启弹窗都会判断是新增还是编辑
    showDialog() {
      console.log(111)
      if (this.treeNode.isedit) {
        this.formData = this.treeNode
      } else {
        this.formData = {
          name: '', // 部门名称
          code: '', // 部门编码
          manager: '', // 部门管理者
          introduce: '' // 部门介绍
        }
      }
    }
  },
  created() {
    this.getEmployeeSimple()
  },
  methods: {
    // 获取员工简单列表数据
    async  getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 点击确定时触发
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 表示可以提交了
          if (this.treeNode.isedit) {
            delete this.treeNode.isedit
            await updateDepartments(this.formData)
            this.$message.success('编辑部门成功')
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 调用新增接口 添加父部门的id
            this.$message.success('新增部门成功')
          }
          this.$emit('addDepts')
          // 子组件 update:固定写法 (update:props名称, 值)
          this.$emit('update:showDialog', false) // 触发事件
        }
      })
    },
    btnCancel() {
      this.$refs.deptForm.resetFields() // 重置校验字段
      this.$emit('update:showDialog', false) // 关闭
    }
  }

}
</script>
