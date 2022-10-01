<!-- eslint-disable vue/no-unused-vars -->
<template>
  <el-table
    :data="list"
    border
    style="width: 100%"
  >
    <el-table-column
      type="index"
      label="序号"
      width="100"
    />
    <el-table-column
      prop="name"
      label="角色名"
      width="180"
      sortable
    />
    <el-table-column
      prop="description"
      label="描述"
      sortable
    />
    <el-table-column
      fixed="right"
      label="操作"
      width="240"
      align="center"
    >
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="set(scope.$index,0)">分配权限</el-button>
        <el-button type="text" size="small" @click="set(scope.$index,1)">修改</el-button>
        <el-button type="text" size="small" @click="set(scope.$index,2)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: null
    }
  },
  data() {
    return {}
  },
  methods: {
    set(index, is) {
      console.log(index)
      this.$emit('setRole', { index: index, is: is })
    }
  }

}
</script>

<style>

</style>
