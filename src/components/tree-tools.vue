<template>
  <el-tree
    v-loading="loading"
    class="treelist"
    :data="treeNode"
    default-expand-all
    :expand-on-click-node="false"
  >
    <div slot-scope="{ data }" class="custom-tree-node">
      <span>{{ data.name }}</span>
      <div>
        <span>{{ data.manager }}</span>
        <!-- 放置下拉菜单 -->
        <el-dropdown @command="handleCommand">
          <!-- 内容 -->
          <span>操作
            <i class="el-icon-arrow-down" />
          </span>
          <!-- 具名插槽 -->
          <el-dropdown-menu slot="dropdown">
            <!-- 下拉选项 -->
            <el-dropdown-item :command="{name:'add',data:data}">添加子部门</el-dropdown-item>
            <el-dropdown-item :command="{name:'edit',data:data}">编辑部门</el-dropdown-item>
            <el-dropdown-item :command="{name:'del',id:data.id}">删除部门</el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </el-tree>
</template>

<script>
import { delDepartments } from '@/api/getDepartments'
export default {
  props: {
    treeNode: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: true
    }
  },
  watch: {
    treeNode(newValue) {
      if (newValue) {
        this.loading = false
      }
    }
  },
  methods: {
    handleCommand(command) {
      if (command.name === 'add') {
        console.log('add')
        this.$emit('addDepts', command.data) // 触发自定义事件
      } else if (command.name === 'edit') {
        console.log('edit')
        this.$emit('editDepts', command.data)
      } else if (command.name === 'del') {
        this.$confirm('确定要删除该部门吗').then(() => {
          // 如果点击了确定就会进入then
          console.log(command.id)
          return delDepartments(command.id) // 返回promise对象
        }).then(() => {
          this.$emit('delDepts') // 触发自定义事件
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.treelist{
  padding: 0 40px 60px 60px;

}
.custom-tree-node{
  width: 100%;
  display: flex;
  justify-content: space-between;
  &>div{
    &>span{
      width: 42px;
      display: inline-block;
      margin-right: 8px;
      font-size: 14px;
    }

  }
}
</style>
