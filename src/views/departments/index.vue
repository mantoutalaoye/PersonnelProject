<template>
  <div class="dashboard-container">
    <div class="custom-tree-node">
      <span style="border-bottom: 1px solid #000;">馒头姥爷科技有限公司</span>
      <div>
        <span>负责人</span>
        <el-dropdown>
          <!-- 内容 -->
          <span>操作
            <i class="el-icon-arrow-down" />
          </span>
          <!-- 具名插槽 -->
          <el-dropdown-menu slot="dropdown">
            <!-- 下拉选项 -->
            <el-dropdown-item>添加子部门</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <treeTools :tree-node="departs" @delDepts="getdeparts" @editDepts="edit" @addDepts="add" />
    <add-dept :tree-node="node" :show-dialog.sync="showDialog" @addDepts="getdeparts" />
  </div>
</template>

<script>
import treeTools from '@/components/tree-tools.vue'
import { getDepartments } from '@/api/getDepartments'
import { tranListToTreeData } from '@/utils/index'
import addDept from '@/views/departments/components/add-dept.vue'
export default {
  components: {
    treeTools,
    addDept
  },
  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showDialog: false,
      node: {}
    }
  },
  created() {
    this.getdeparts()
  },
  methods: {
    async getdeparts() {
      const res = await getDepartments()
      console.log(res)
      this.departs = res.depts
      this.departs = tranListToTreeData(this.departs, '')
      console.log(this.departs)
    },
    add(data) {
      console.log(data)
      this.node = { ...data, ...{ isedit: false }}
      this.showDialog = true
    },
    edit(data) {
      this.node = { ...data, ...{ isedit: true }}
      console.log(data)
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container{
  padding: 1.2%;
}
.custom-tree-node{
  padding: 50px 40px 8px 60px;
  background-color: #fff;
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
