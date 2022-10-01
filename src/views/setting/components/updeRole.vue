<template>
  <el-dialog :title="roleForm?'编辑角色':'新增角色'" :visible="showDialog" @close="btnCancel">
    <el-form ref="roleForm" :model="QroleForm" :rules="rules" label-width="120px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="QroleForm.name" />
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="QroleForm.description" />
      </el-form-item>
    </el-form>
    <!-- 底部 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { updateRole, addRole } from '@/api/setting'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    roleForm: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      QroleForm: {
        name: '',
        description: ''
      }
    }
  },
  watch: {
    roleForm(newValue) {
      if (newValue) {
        this.QroleForm = this.roleForm
      }
    }
  },
  methods: {
    btnOK() {
      this.$refs.roleForm.validate(async isOK => {
        if (isOK) {
          if (this.roleForm !== null) {
            updateRole(this.QroleForm)
            this.$message.success('修改成功')
          } else {
            await addRole(this.QroleForm)
            this.$message.success('添加成功')
          }
          this.$emit('updateroleForm')
          this.QroleForm = {
            name: '',
            description: ''
          }
          this.$emit('update:showDialog', false)
          this.$emit('getrole')
        }
      })
    },
    btnCancel() {
      this.QroleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.$emit('update:showDialog', false)
      this.$emit('updateroleForm')
    }
  }
}
</script>

<style>

</style>
